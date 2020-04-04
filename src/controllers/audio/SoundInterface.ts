export interface SoundInterface {
  volume(): number;

  play(): void;

  stop(): void;

  fadeIn(volume: number, duration: number): void;

  fadeOut(volume: number, duration: number): void;

  isPlaying(): boolean;
}
