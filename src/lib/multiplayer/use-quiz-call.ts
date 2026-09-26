/**
 * P2P mesh for a live-test room. Identity is the quiz player id so a remount
 * (paper ↔ lobby) can rejoin the same peer slot. Key the component on `code`.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { P2PRoom, type PeerInfo } from "./p2p";

export function rtcRoomId(code: string): string {
  return `quiz-${code.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 24)}`.slice(0, 64);
}

export function useQuizCall(opts: { code: string; selfId: string; name: string; enabled: boolean }) {
  const { code, selfId, name, enabled } = opts;
  const [peers, setPeers] = useState<PeerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, MediaStream>>({});
  const [localStream, setLocalStreamState] = useState<MediaStream | null>(null);
  const roomRef = useRef<P2PRoom | null>(null);
  const localRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!enabled || !code || !selfId || selfId === "ssr") return;
    const p2p = new P2PRoom({
      room: rtcRoomId(code),
      selfId: selfId.slice(0, 64),
      name,
      onPeersChanged: setPeers,
      onConnected: () => setJoined(true),
      onTrack: (from, stream) => {
        setRemoteStreams((cur) => ({ ...cur, [from]: stream }));
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
  }, [peers]);

  const stopLocal = useCallback(() => {
    localRef.current?.getTracks().forEach((t) => t.stop());
    localRef.current = null;
    setLocalStreamState(null);
    roomRef.current?.setLocalStream(null);
  }, []);

  const setMedia = useCallback(async (audio: boolean, video: boolean) => {
    if (!audio && !video) {
      stopLocal();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio,
        video: video ? { facingMode: "user" } : false,
      });
      localRef.current?.getTracks().forEach((t) => t.stop());
      localRef.current = stream;
      setLocalStreamState(stream);
      roomRef.current?.setLocalStream(stream);
    } catch (err) {
      stopLocal();
      throw err;
    }
  }, [stopLocal]);

  return { peers, joined, remoteStreams, localStream, setMedia, endCall: stopLocal };
}
