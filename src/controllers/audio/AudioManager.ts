import { Sound } from './Sound.ts';

export abstract class AudioManager {
  private static sounds: { [index:string] : Sound } = {};

  public static addSound(key: string, soundUrl: any, config: {} = {}) {
    AudioManager.sounds[key] = new Sound(soundUrl, config);
  }

  public static play(key: string, ignoreIfPlaying: boolean = true) {
    if (!AudioManager.sounds[key].isPlaying() || (AudioManager.sounds[key].isPlaying() && !ignoreIfPlaying)) {
      AudioManager.sounds[key].play();
    }
  }

  public static stop(key: string) {
    if (AudioManager.sounds[key].isPlaying()) {
      AudioManager.sounds[key].stop();
    }
  }

  public static volume(key: string) {
    return AudioManager.sounds[key].volume();
  }

  public static fadeIn(key: string, duration: number = 400, volume: number = 1) {
    AudioManager.sounds[key].fadeIn(volume, duration);
  }

  public static fadeOut(key: string, duration: number = 400, volume: number = 0) {
    AudioManager.sounds[key].fadeOut(volume, duration);
  }
}
