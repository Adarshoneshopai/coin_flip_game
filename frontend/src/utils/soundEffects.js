// Web Audio API synthesized realistic coin toss and landing sounds.
// Uses no external audio assets, ensuring 0 network latency, 0 bandwidth,
// and instant, reliable playback across all modern browsers.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play metallic coin flip / whoosh sound while the coin is in the air.
 */
export function playCoinFlipSound(muted = false) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // 1. Initial metallic thumb flick / ping
    const flickOsc1 = ctx.createOscillator();
    const flickOsc2 = ctx.createOscillator();
    const flickGain = ctx.createGain();

    flickOsc1.type = "sine";
    flickOsc1.frequency.setValueAtTime(3200, now);
    flickOsc1.frequency.exponentialRampToValueAtTime(1800, now + 0.08);

    flickOsc2.type = "triangle";
    flickOsc2.frequency.setValueAtTime(4800, now);
    flickOsc2.frequency.exponentialRampToValueAtTime(2400, now + 0.06);

    flickGain.gain.setValueAtTime(0.35, now);
    flickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    flickOsc1.connect(flickGain);
    flickOsc2.connect(flickGain);
    flickGain.connect(ctx.destination);

    flickOsc1.start(now);
    flickOsc2.start(now);
    flickOsc1.stop(now + 0.1);
    flickOsc2.stop(now + 0.1);

    // 2. Air spinning flutter / whoosh
    const spinOsc = ctx.createOscillator();
    const spinGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    spinOsc.type = "sine";
    spinOsc.frequency.setValueAtTime(1200, now);
    spinOsc.frequency.exponentialRampToValueAtTime(900, now + 1.5);

    // LFO modulates amplitude to mimic spinning coin rotation
    lfo.frequency.setValueAtTime(16, now);
    lfo.frequency.linearRampToValueAtTime(10, now + 1.5);

    lfoGain.gain.setValueAtTime(0.08, now);
    lfoGain.gain.linearRampToValueAtTime(0.01, now + 1.4);

    lfo.connect(spinGain.gain);
    spinGain.gain.setValueAtTime(0.09, now);
    spinGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    spinOsc.connect(spinGain);
    spinGain.connect(ctx.destination);

    lfo.start(now);
    spinOsc.start(now);
    lfo.stop(now + 1.5);
    spinOsc.stop(now + 1.5);
  } catch (err) {
    console.warn("Audio playback issue:", err);
  }
}

/**
 * Play metallic coin landing / clink sound when the coin lands.
 */
export function playCoinLandSound(isWin = false, muted = false) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Primary coin drop clink (crisp high metallic resonance)
    const ring1 = ctx.createOscillator();
    const ring2 = ctx.createOscillator();
    const ring3 = ctx.createOscillator();
    const gain = ctx.createGain();

    ring1.type = "sine";
    ring1.frequency.setValueAtTime(2640, now);
    ring1.frequency.exponentialRampToValueAtTime(2600, now + 0.5);

    ring2.type = "sine";
    ring2.frequency.setValueAtTime(5280, now);
    ring2.frequency.exponentialRampToValueAtTime(5200, now + 0.3);

    ring3.type = "triangle";
    ring3.frequency.setValueAtTime(7920, now);
    ring3.frequency.exponentialRampToValueAtTime(7800, now + 0.15);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    ring1.connect(gain);
    ring2.connect(gain);
    ring3.connect(gain);
    gain.connect(ctx.destination);

    ring1.start(now);
    ring2.start(now);
    ring3.start(now);
    ring1.stop(now + 0.65);
    ring2.stop(now + 0.65);
    ring3.stop(now + 0.65);

    // Micro secondary bounce clink at now + 0.07s
    const bTime = now + 0.07;
    const bRing = ctx.createOscillator();
    const bGain = ctx.createGain();

    bRing.type = "sine";
    bRing.frequency.setValueAtTime(3100, bTime);
    bRing.frequency.exponentialRampToValueAtTime(3000, bTime + 0.25);

    bGain.gain.setValueAtTime(0.2, bTime);
    bGain.gain.exponentialRampToValueAtTime(0.001, bTime + 0.25);

    bRing.connect(bGain);
    bGain.connect(ctx.destination);

    bRing.start(bTime);
    bRing.stop(bTime + 0.26);

    // If win: subtle pleasant celebratory chime
    if (isWin) {
      const winTime = now + 0.12;
      const winOsc1 = ctx.createOscillator();
      const winOsc2 = ctx.createOscillator();
      const winGain = ctx.createGain();

      winOsc1.type = "sine";
      winOsc1.frequency.setValueAtTime(1046.5, winTime); // C6
      winOsc2.type = "sine";
      winOsc2.frequency.setValueAtTime(1318.5, winTime); // E6

      winGain.gain.setValueAtTime(0.18, winTime);
      winGain.gain.exponentialRampToValueAtTime(0.001, winTime + 0.5);

      winOsc1.connect(winGain);
      winOsc2.connect(winGain);
      winGain.connect(ctx.destination);

      winOsc1.start(winTime);
      winOsc2.start(winTime);
      winOsc1.stop(winTime + 0.55);
      winOsc2.stop(winTime + 0.55);
    }
  } catch (err) {
    console.warn("Audio playback issue:", err);
  }
}
