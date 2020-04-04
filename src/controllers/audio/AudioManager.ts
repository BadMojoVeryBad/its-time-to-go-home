import { GameplaySceneBase } from '../../scenes/GameplaySceneBase.ts';
import { Sound } from './Sound.ts';
import { SoundInterface } from './SoundInterface.ts';
import { SpatialSound } from './SpatialSound';

export abstract class AudioManager {

  public static addSound(key: string, soundUrl: any, config: {} = {}) {
    AudioManager.sounds[key] = new Sound(soundUrl, config);
  }

  public static addSpatialSound(scene: GameplaySceneBase, key: string, soundUrl: any, target: Phaser.GameObjects.Sprite, config: {} = {}, x: number = 0, y: number = 0, radius: number = 400) {
    AudioManager.sounds[key] = new SpatialSound(scene, key, soundUrl, config, x, y, radius, target);
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

  public static removeSound(key: string) {
    delete AudioManager.sounds[key];
  }

  private static sounds: { [index: string]: SoundInterface } = {};
}
