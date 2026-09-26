import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MAX_CLASS_PLAYERS,
  MAX_DISC_PLAYERS,
  allConnected,
  allowsVideo,
  asDiscKind,
  asDiscMode,
  asFloorKind,
  asRoomKind,
  autoMic,
  clampClassTimeout,
  discModeLabel,
  floorRemainingMs,
  formatFloorLeft,
  waitingConnect,
} from "./discussion-room.ts";

describe("group discussion rooms", () => {
  it("caps at 20 and names the four connect modes", () => {
    assert.equal(MAX_DISC_PLAYERS, 20);
    assert.equal(asDiscMode("audio"), "audio");
    assert.equal(asDiscMode("nope"), "video");
    assert.equal(discModeLabel("hand"), "Hand-raise");
    assert.equal(allowsVideo("video"), true);
    assert.equal(allowsVideo("chat"), false);
    assert.equal(autoMic("hand"), false);
    assert.equal(autoMic("audio"), true);
    assert.equal(asDiscKind("question"), "question");
    assert.equal(MAX_CLASS_PLAYERS, 0);
    assert.equal(asRoomKind("class"), "class");
    assert.equal(asFloorKind("audio"), "audio");
    assert.equal(clampClassTimeout("90"), 90);
    assert.equal(clampClassTimeout(5), 15);
    assert.equal(clampClassTimeout(900), 300);
    assert.equal(formatFloorLeft(65_000), "1:05");
    assert.equal(floorRemainingMs(new Date(Date.now() + 8_000).toISOString()) > 0, true);
  });

  it("starts only after every present name has connected", () => {
    assert.equal(allConnected([]), false);
    assert.equal(
      allConnected([
        { readyAt: "1", leftAt: null },
        { readyAt: null, leftAt: null },
      ]),
      false,
    );
    assert.equal(
      allConnected([
        { readyAt: "1", leftAt: null },
        { readyAt: "2", leftAt: null },
      ]),
      true,
    );
    assert.equal(
      allConnected([
        { readyAt: "1", leftAt: null },
        { readyAt: null, leftAt: "3" },
      ]),
      true,
    );
    assert.equal(
      waitingConnect([
        { readyAt: "1", leftAt: null },
        { readyAt: null, leftAt: null },
        { readyAt: null, leftAt: "x" },
      ]),
      1,
    );
  });
});
