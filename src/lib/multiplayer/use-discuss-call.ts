import { useCallback, useEffect, useRef, useState } from "react";
import { P2PRoom, type PeerInfo } from "./p2p";

export function discRtcRoomId(code: string): string {
  return `disc-${code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24)}`.slice(0, 64);
}

function watchSpeaking(stream: MediaStream, onChange: (on: boolean) => void): () => void {
  const audio = stream.getAudioTracks()[0];
  if (!audio || typeof AudioContext === "undefined") return () => undefined;
  const ctx = new AudioContext();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 512;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  let last = false;
  let raf = 0;
  const loop = () => {
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (const n of data) sum += n;
    const speaking = sum / data.length > 18;
    if (speaking !== last) {
      last = speaking;
      onChange(speaking);
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    void ctx.close();
  };
}

export function useDiscussCall(opts: { code: string; selfId: string; name: string; enabled: boolean }) {
  const { code, selfId, name, enabled } = opts;
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStreamState] = useState<MediaStream | null>(null);
  const [speaking, setSpeaking] = useState<Record<string, boolean>>({});
  const roomRef = useRef<P2PRoom | null>(null);
  const localRef = useRef<MediaStream | null>(null);
  const speakStop = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!enabled || !code || !selfId || selfId === "ssr") return;
    const p2p = new P2PRoom({
      room: discRtcRoomId(code),
      selfId: selfId.slice(0, 64),
      name,
      onPeersChanged: setPeers,
      onConnected: () => {
        setJoined(true);
        if (localRef.current) p2p.setLocalStream(localRef.current);
      },
      onTrack: (from, stream) => {
        setRemoteStreams((cur) => ({ ...cur, [from]: stream }));
      },
      onMessage: (from, data) => {
        if (!data || typeof data !== "object") return;
        const msg = data as { t?: string; on?: boolean };
        if (msg.t === "speak") {
          setSpeaking((cur) => ({ ...cur, [from]: Boolean(msg.on) }));
        }
      },
    });
    roomRef.current = p2p;
    void p2p.join();
    return () => {
      roomRef.current = null;
      p2p.close();
      setJoined(false);
      setPeers([]);
      setRemoteStreams({});
      setSpeaking({});
    };
  }, [code, selfId, name, enabled]);

  useEffect(() => {
    const alive = new Set(peers.map((p) => p.id));
    setRemoteStreams((cur) => {
      const next: Record<string, MediaStream> = {};
      for (const [id, stream] of Object.entries(cur)) {
        if (alive.has(id)) next[id] = stream;
      }
      return next;
    });
    setSpeaking((cur) => {
      const next: Record<string, boolean> = {};
      for (const [id, on] of Object.entries(cur)) {
        if (alive.has(id) || id === selfId) next[id] = on;
      }
      return next;
    });
  }, [peers, selfId]);

  const stopLocal = useCallback(() => {
    speakStop.current?.();
    speakStop.current = null;
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    setLocalStreamState(null);
    roomRef.current?.setLocalStream(null);
    setSpeaking((cur) => ({ ...cur, [selfId]: false }));
    roomRef.current?.broadcast({ t: "speak", on: false });
  }, [selfId]);

  const setMedia = useCallback(
    async (audio: boolean, video: boolean) => {
      if (!audio && !video) {
        stopLocal();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio,
          video: video ? { facingMode: "user" } : false,
        });
        speakStop.current?.();
        localRef.current?.getTracks().forEach((t) => t.stop());
        localRef.current = stream;
        setLocalStreamState(stream);
        roomRef.current?.setLocalStream(stream);
        speakStop.current = watchSpeaking(stream, (on) => {
          setSpeaking((cur) => ({ ...cur, [selfId]: on }));
          roomRef.current?.broadcast({ t: "speak", on });
        });
      } catch (err) {
        stopLocal();
        throw err;
      }
    },
    [selfId, stopLocal],
  );

  return { peers, joined, remoteStreams, localStream, speaking, setMedia, endCall: stopLocal };
}
