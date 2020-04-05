/**
 * Add sounds used in the `AudioManager` must implement this interface.
 */
export interface SoundInterface {
  /**
   * Returns the volume.
   *
   * @returns The current volume of the sound.
   */
  volume(): number;

  /**
   * Play the sound.
   */
  play(): void;

  /**
   * Stop the sound.
   */
  stop(): void;

  /**
   * Fade in the sound.
   */
  fadeIn(duration: number, volume: number): void;

  /**
   * Fade out the sound.
   */
  fadeOut(duration: number, volume: number): void;

  /**
   * Is the sound playing?
   *
   * @returns `true` if the sound is playing.
   */
  isPlaying(): boolean;
}
