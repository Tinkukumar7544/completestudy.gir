import {
  ARROW_DIR,
  YARD_ORIGIN,
  cellKey,
  inHomeCenter,
  inYard,
  isActiveSeat,
  isSafeBoardCell,
  ludoSeatInitial,
  ludoSeatName,
  onCross,
  popupCopy,
  rolledToday,
  startOwner,
  stretchOwner,
  tokenCell,
  yardPad,
  type LudoFlash,
} from "@/lib/exam/ludo-path";
import { unlockLudoSfx } from "@/lib/exam/ludo-sfx";
import { LUDO_COLORS, type LudoBoard, type LudoColor, type LudoToken } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

function pct(cell: number): number {
  return ((cell + 0.5) / 15) * 100;
}

const PIP_MAP: Record<number, Array<[number, number]>> = {
  1: [[50, 50]],
  2: [
    [28, 28],
    [72, 72],
  ],
  3: [
    [28, 28],
    [50, 50],
    [72, 72],
  ],
  4: [
    [28, 28],
    [72, 28],
    [28, 72],
    [72, 72],
  ],
  5: [
    [28, 28],
    [72, 28],
    [50, 50],
    [28, 72],
    [72, 72],
  ],
  6: [
    [28, 28],
    [72, 28],
    [28, 50],
    [72, 50],
    [28, 72],
    [72, 72],
  ],
};

const YARD_AREA: Record<LudoColor, string> = {
  blue: "1 / 1 / 7 / 7",
  yellow: "1 / 10 / 7 / 16",
  green: "10 / 10 / 16 / 16",
  red: "10 / 1 / 16 / 7",
};

function tokenPaint(token: LudoToken, fallback: LudoColor): LudoColor {
  return token.stampColor === "inherit" ? fallback : token.stampColor;
}

const FALLBACK_SUBJECTS: Record<LudoColor, string[]> = {
  red: ["Rock Mechanics", "Mining Law", "Overman paper 1", "Notes sprint"],
  blue: ["Ventilation", "Mine gases", "Surveying", "First aid"],
  yellow: ["Safety", "Strata control", "Legislation", "Mine fires"],
  green: ["Arithmetic", "English", "Reasoning", "GK"],
};

export function ludoPinLabel(token: LudoToken, index: number, color: LudoColor): string {
  const raw =
    token.name.trim() ||
    FALLBACK_SUBJECTS[color][index] ||
    token.dayName.trim() ||
    `Subject ${index + 1}`;
  if (raw.length <= 11) return raw;
  const first = raw.split(/\s+/).find(Boolean) ?? raw;
  if (first.length <= 11) return first;
  return first.slice(0, 10);
}

function pinInitials(label: string, index: number): string {
  const parts = label.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]!.charAt(0)}${parts[1]!.charAt(0)}`.toUpperCase();
  const compact = label.replace(/[^A-Za-z0-9]/g, "");
  if (compact.length >= 2) return compact.slice(0, 2).toUpperCase();
  return compact.slice(0, 1).toUpperCase() || String(index + 1);
}

function LocationPin({ label, index }: { label: string; index: number }) {
  const init = pinInitials(label, index);
  return (
    <span className="ludo-pin">
      <span className="ludo-pin-name">{label}</span>
      <svg viewBox="0 0 64 88" className="ludo-pin-svg" aria-hidden>
        <path
          className="ludo-pin-body"
          d="M32 84C32 84 6 52 6 32a26 26 0 1 1 52 0C58 52 32 84 32 84z"
        />
        <circle className="ludo-pin-hole" cx="32" cy="30" r="13.5" />
        <text className="ludo-pin-init" x="32" y="31" textAnchor="middle" dominantBaseline="middle">
          {init}
        </text>
      </svg>
    </span>
  );
}

function StarMark() {
  return (
    <svg viewBox="0 0 24 24" className="ludo-star" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2.6 14.4 8l5.8.5-4.4 3.8 1.4 5.6L12 15.8 6.8 17.9l1.4-5.6L3.8 8.5 9.6 8z"
      />
    </svg>
  );
}

function pathSquares() {
  const cells: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      if (inYard(r, c)) continue;
      if (inHomeCenter(r, c)) continue;
      if (!onCross(r, c)) continue;
      cells.push({ r, c });
    }
  }
  return cells;
}

const PATH_SQUARES = pathSquares();

export function LudoDieFace({ pips }: { pips: number }) {
  const value = Math.min(6, Math.max(1, pips || 6));
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
      {PIP_MAP[value]!.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="8.5" fill="var(--color-ludo-pip)" />
      ))}
    </svg>
  );
}

function LudoSeat({
  board,
  color,
  myColor,
  rolling,
  canRoll,
  onRoll,
  onOpen,
}: {
  board: LudoBoard;
  color: LudoColor;
  myColor: LudoColor;
  rolling?: boolean;
  canRoll?: boolean;
  onRoll?: () => void;
  onOpen?: (color: LudoColor) => void;
}) {
  const col = board.columns.find((c) => c.color === color);
  const name = ludoSeatName(board, color, myColor);
  const onTarget = isActiveSeat(board, color);
  const active = onTarget && board.turnColor === color && board.phase !== "won";
  const showDie = active && (board.phase === "roll" || board.phase === "move" || Boolean(rolling));
  const played = board.rules.oncePerDay && rolledToday(board, color);
  const hint = !onTarget
    ? "Off this target"
    : played
      ? "Played today"
      : color === myColor
        ? "You"
        : col?.studentName.trim()
          ? "On this target"
          : "Open seat";

  return (
    <div className={cn("ludo-seat", active && "is-turn", !onTarget && "is-idle")} data-color={color} data-corner={color} data-live={onTarget ? "1" : "0"}>
      <button
        type="button"
        className="ludo-seat-card"
        onClick={() => onOpen?.(color)}
        aria-label={`${name}, ${color} seat`}
      >
        <span className="ludo-seat-avatar" data-color={color}>
          {ludoSeatInitial(name)}
        </span>
        <span className="ludo-seat-meta">
          <span className="ludo-seat-name">{name}</span>
          <span className="ludo-seat-hint">{hint}</span>
        </span>
      </button>
      {showDie ? (
        <button
          type="button"
          className={cn("ludo-seat-die", rolling && "is-rolling", canRoll && active && "is-ready")}
          aria-label={canRoll && color === myColor ? `Roll for ${name}` : `${name} die showing ${board.lastPips || 6}`}
          onClick={(e) => {
            e.stopPropagation();
            onRoll?.();
          }}
        >
          <LudoDieFace pips={rolling ? 6 : board.lastPips || 6} />
        </button>
      ) : null}
    </div>
  );
}

function LudoPopupBanner({ flash, board, myColor }: { flash: LudoFlash; board: LudoBoard; myColor: LudoColor }) {
  const copy = popupCopy(flash, board, myColor);
  return (
    <div className="ludo-popup" data-kind={flash.kind} data-color={flash.actor} role="status" aria-live="polite">
      <span className="ludo-popup-accent" data-color={flash.actor} />
      <p className="ludo-popup-name">{copy.title}</p>
      <p className="ludo-popup-detail">{copy.detail}</p>
    </div>
  );
}

export function LudoBoardView({
  board,
  selectedId,
  legalTokenIds,
  legalCellKeys,
  rolling,
  canRoll,
  canEditNames,
  myColor,
  popup,
  onSelectToken,
  onSelectCell,
  onRename,
  onRoll,
  onOpenSeat,
}: {
  board: LudoBoard;
  selectedId?: string | null;
  legalTokenIds?: Set<string>;
  legalCellKeys?: Set<string>;
  rolling?: boolean;
  canRoll?: boolean;
  canEditNames?: boolean;
  myColor?: LudoColor;
  popup?: LudoFlash | null;
  onSelectToken?: (token: LudoToken, color: LudoColor) => void;
  onSelectCell?: (key: string, r: number, c: number) => void;
  onRename?: (color: LudoColor, name: string) => void;
  onRoll?: () => void;
  onOpenSeat?: (color: LudoColor) => void;
}) {
  const pips = Math.min(6, Math.max(1, board.lastPips || 6));
  const occupancy = new Map<string, number>();
  const seatColor = myColor ?? board.playerColor;

  return (
    <div className="ludo-match" data-mode={board.playerMode} data-active={board.activeColors.join(",")} onPointerDown={unlockLudoSfx}>
      {LUDO_COLORS.map((color) => (
        <LudoSeat
          key={color}
          board={board}
          color={color}
          myColor={seatColor}
          rolling={rolling && board.turnColor === color}
          canRoll={canRoll}
          onRoll={onRoll}
          onOpen={onOpenSeat}
        />
      ))}
      <div className="ludo-stage" role="application" aria-label="Ludo exam board">
        <div className="ludo-play">
          <div className="ludo-grid">
            {LUDO_COLORS.map((color) => {
              const col = board.columns.find((c) => c.color === color);
              const named = col?.studentName.trim() ?? "";
              const display = ludoSeatName(board, color, seatColor);
              const onTarget = isActiveSeat(board, color);
              const active = onTarget && board.turnColor === color && board.phase !== "won";
              return (
                <div
                  key={color}
                  className={cn("ludo-yard", active && "is-turn", !onTarget && "is-idle")}
                  data-color={color}
                  data-live={onTarget ? "1" : "0"}
                  style={{ gridArea: YARD_AREA[color] }}
                >
                  <div className="ludo-yard-frame">
                    <label className="ludo-player-field">
                      <span className="sr-only">{color} player name</span>
                      <input
                        className="ludo-player-name"
                        value={named || display}
                        placeholder={display}
                        maxLength={40}
                        disabled={!canEditNames}
                        onChange={(e) => {
                          const next = e.target.value;
                          onRename?.(color, next === display && !named ? "" : next);
                        }}
                        aria-label={`${color} player name`}
                      />
                    </label>
                    <div className="ludo-pads">
                      {(col?.tokens ?? [0, 1, 2, 3]).slice(0, 4).map((token, i) => {
                        const pad = yardPad(color, i, 4);
                        const origin = YARD_ORIGIN[color];
                        const localR = pad.r - origin.r;
                        const localC = pad.c - origin.c;
                        const filled = typeof token !== "number" && token.steps < 0;
                        return (
                          <span
                            key={typeof token === "number" ? `pad-${i}` : token.id}
                            className={cn("ludo-pad-slot", filled && "is-filled")}
                            data-color={color}
                            style={{
                              left: `${((localC + 0.5) / 6) * 100}%`,
                              top: `${((localR + 0.5) / 6) * 100}%`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {PATH_SQUARES.map(({ r, c }) => {
              const key = cellKey({ r, c });
              const stretch = stretchOwner(r, c);
              const start = startOwner(r, c);
              const paint = stretch ?? start;
              const safe = isSafeBoardCell(r, c);
              const note = board.cells[key];
              const label = note?.label?.trim() ?? "";
              const hasNote = Boolean(label || note?.content?.trim());
              const legal = legalCellKeys?.has(key);
              const arrow = start && board.columns.find((col) => col.color === start)?.arrowEnabled;
              const isArray = note?.kind === "array";
              const isSunday =
                note?.kind === "sunday" || board.columns.some((col) => col.tokens.some((t) => t.sundayKey === key));
              return (
                <button
                  key={key}
                  type="button"
                  className={cn(
                    "ludo-sq",
                    legal && "is-legal",
                    hasNote && "is-noted",
                    isArray && "is-array",
                    isSunday && "is-sunday",
                  )}
                  data-color={paint ?? undefined}
                  data-safe={safe ? "1" : undefined}
                  style={{ gridRow: r + 1, gridColumn: c + 1 }}
                  aria-label={label || (isArray ? "Array skip" : isSunday ? "Sunday box" : `Square ${r + 1},${c + 1}`)}
                  onClick={() => onSelectCell?.(key, r, c)}
                >
                  {safe ? <StarMark /> : null}
                  {arrow ? <span className="ludo-arrow" data-dir={ARROW_DIR[start!]} /> : null}
                  {isArray ? <span className="ludo-sq-tag">Arr</span> : isSunday ? <span className="ludo-sq-tag">Sun</span> : null}
                  {label ? <span className="ludo-sq-label">{label}</span> : hasNote ? <span className="ludo-sq-dot" /> : null}
                </button>
              );
            })}

            <div className="ludo-home" onClick={() => onRoll?.()}>
              <span className={cn("ludo-tri", !isActiveSeat(board, "yellow") && "is-idle")} data-dir="top" data-color="yellow" />
              <span className={cn("ludo-tri", !isActiveSeat(board, "green") && "is-idle")} data-dir="right" data-color="green" />
              <span className={cn("ludo-tri", !isActiveSeat(board, "red") && "is-idle")} data-dir="bottom" data-color="red" />
              <span className={cn("ludo-tri", !isActiveSeat(board, "blue") && "is-idle")} data-dir="left" data-color="blue" />
              <button
                type="button"
                className={cn("ludo-die", rolling && "is-rolling", canRoll && "is-ready")}
                aria-label={canRoll ? "Roll the die" : board.phase === "move" ? `Tap to move ${pips}` : `Die showing ${pips}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onRoll?.();
                }}
              >
                <LudoDieFace pips={pips} />
              </button>
            </div>
          </div>

          {board.columns.flatMap((col) =>
            col.tokens.map((token, i) => {
              const cell = tokenCell(col.color, token, i, col.tokens.length);
              const key = cellKey({ r: Math.round(cell.r * 10) / 10, c: Math.round(cell.c * 10) / 10 });
              const stack = occupancy.get(key) ?? 0;
              occupancy.set(key, stack + 1);
              const paint = tokenPaint(token, col.color);
              const selected = selectedId === token.id;
              const ready = legalTokenIds?.has(token.id);
              const inBase = token.steps < 0;
              const nudge = stack * 0.22;
              const label = ludoPinLabel(token, i, col.color);
              const onTarget = isActiveSeat(board, col.color);
              return (
                <button
                  key={token.id}
                  type="button"
                  className={cn(
                    "ludo-token",
                    inBase && "in-yard",
                    selected && "is-selected",
                    ready && "is-ready",
                    !onTarget && "is-idle",
                  )}
                  data-color={paint}
                  data-live={onTarget ? "1" : "0"}
                  style={{
                    left: `${pct(cell.c + nudge)}%`,
                    top: `${pct(cell.r + (inBase ? 0 : -0.08))}%`,
                    zIndex: selected ? 9 : 4 + stack,
                  }}
                  aria-label={label}
                  onClick={() => onSelectToken?.(token, col.color)}
                >
                  <LocationPin label={label} index={i} />
                </button>
              );
            }),
          )}
        </div>
        {popup ? (
          <LudoPopupBanner
            key={`${popup.kind}-${popup.actor}-${popup.pips ?? 0}-${popup.other ?? ""}`}
            flash={popup}
            board={board}
            myColor={seatColor}
          />
        ) : null}
      </div>
    </div>
  );
}

export function LudoColorChip({ color, label, hint, active }: { color: LudoColor; label: string; hint: string; active?: boolean }) {
  return (
    <div className={cn("surface-3d flex min-h-16 items-center gap-3 px-3 py-2", active && "ring-2 ring-primary")}>
      <span className="ludo-chip-dot" data-color={color} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium capitalize">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}
