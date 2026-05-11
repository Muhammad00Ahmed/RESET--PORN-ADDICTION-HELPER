export type AudioMode = 'CALM' | 'VULNERABILITY' | 'URGE' | 'MUTE';

const isBrowser = typeof window !== 'undefined';

export class ResetAudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private padOsc: OscillatorNode | null = null;
  private padGain: GainNode | null = null;
  private pulseOsc: OscillatorNode | null = null;
  private pulseGain: GainNode | null = null;
  private breathGain: GainNode | null = null;
  private breathTimer: number | null = null;
  private activeMode: AudioMode = 'MUTE';

  init() {
    if (!isBrowser || this.context) {
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    this.context = new AudioContextClass();
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.context.destination);

    this.padOsc = this.context.createOscillator();
    this.padOsc.type = 'sine';
    this.padGain = this.context.createGain();
    this.padGain.gain.value = 0;
    this.padOsc.connect(this.padGain);
    this.padGain.connect(this.masterGain);
    this.padOsc.start();

    this.pulseOsc = this.context.createOscillator();
    this.pulseOsc.type = 'sine';
    this.pulseGain = this.context.createGain();
    this.pulseGain.gain.value = 0;
    this.pulseOsc.connect(this.pulseGain);
    this.pulseGain.connect(this.masterGain);
    this.pulseOsc.start();

    this.breathGain = this.context.createGain();
    this.breathGain.gain.value = 0;
    this.breathGain.connect(this.masterGain);
  }

  async resume() {
    if (!this.context) {
      this.init();
    }
    if (!this.context) {
      return;
    }
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  setMode(mode: AudioMode) {
    if (!this.context || !this.masterGain || !this.padOsc || !this.padGain || !this.pulseOsc || !this.pulseGain || !this.breathGain) {
      return;
    }

    if (this.activeMode === mode) {
      return;
    }
    this.activeMode = mode;
    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(0.12, now, 0.6);

    switch (mode) {
      case 'CALM':
        this.padOsc.frequency.setTargetAtTime(48, now, 1.2);
        this.padGain.gain.setTargetAtTime(0.04, now, 1.4);
        this.pulseOsc.frequency.setTargetAtTime(0.5, now, 0.8);
        this.pulseGain.gain.setTargetAtTime(0.01, now, 0.8);
        this.startBreathRhythm(5.6);
        break;
      case 'VULNERABILITY':
        this.padOsc.frequency.setTargetAtTime(62, now, 1.2);
        this.padGain.gain.setTargetAtTime(0.05, now, 1.4);
        this.pulseOsc.frequency.setTargetAtTime(0.8, now, 0.8);
        this.pulseGain.gain.setTargetAtTime(0.015, now, 0.8);
        this.startBreathRhythm(5.2);
        break;
      case 'URGE':
        this.padOsc.frequency.setTargetAtTime(40, now, 1.2);
        this.padGain.gain.setTargetAtTime(0.07, now, 1.2);
        this.pulseOsc.frequency.setTargetAtTime(1.1, now, 0.8);
        this.pulseGain.gain.setTargetAtTime(0.03, now, 0.6);
        this.startBreathRhythm(4.2);
        break;
      case 'MUTE':
      default:
        this.masterGain.gain.setTargetAtTime(0, now, 0.4);
        this.stopBreathRhythm();
        break;
    }
  }

  private startBreathRhythm(cycleSeconds: number) {
    if (!this.context || !this.breathGain) {
      return;
    }

    this.stopBreathRhythm();
    const start = this.context.currentTime;
    const update = () => {
      if (!this.context || !this.breathGain) {
        return;
      }
      const t = this.context.currentTime - start;
      const normalized = (Math.sin((t / cycleSeconds) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const value = 0.035 + normalized * 0.025;
      this.breathGain.gain.setTargetAtTime(value, this.context.currentTime, 0.12);
      this.breathTimer = window.setTimeout(update, 120);
    };
    update();
  }

  private stopBreathRhythm() {
    if (this.breathTimer) {
      window.clearTimeout(this.breathTimer);
      this.breathTimer = null;
    }
    if (this.breathGain) {
      this.breathGain.gain.setTargetAtTime(0, this.context?.currentTime || 0, 0.3);
    }
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!isBrowser || !window.speechSynthesis) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.0;
    utterance.volume = options?.volume ?? 0.96;
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}
