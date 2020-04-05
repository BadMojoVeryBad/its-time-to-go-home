import { GameplaySceneBase } from '../../scenes/GameplaySceneBase.ts';
import { Sound } from './Sound.ts';
import { SoundInterface } from './SoundInterface.ts';
import { SpatialSound } from './SpatialSound';
import { Howl } from 'howler';

export abstract class AudioManager {

  public static addSoundSource(key: string, source: string) {
    if (AudioManager.sources[key]) {
      console.error('AudioManager: An audio source with this key already exists: ' + key);
    } else {
      AudioManager.sources[key] = source;
    }
  }

  public static preloadSoundSource(scene: Phaser.Scene, key: string, source: string) {
    // The await loader has no TypeScript typing, so we tell the linter to
    // ignore it's call.
    // @ts-ignore
    scene.load.await(async (resolve: () => void) => {
      console.log('preload: ' + key);
      if (AudioManager.sources[key]) {
        console.error('AudioManager: An audio source with this key already exists: ' + key);
      } else {
        AudioManager.sources[key] = source;

        // We never use this object, but it has the effect of loading the audio
        // file. We resolve the promise when it's done.
        new Howl({
          src: source,
          preload : true,
          onload: () => {
            resolve();
          }
        });
      }
    });
  }

  public static addSound(key: string, source: string, config: {} = {}) {
    if (AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key already exists: ' + key);
      return;
    }
    const soundUrl = AudioManager.getSoundSource(source);
    AudioManager.sounds[key] = new Sound(soundUrl, config);
  }

  public static addSpatialSound(scene: GameplaySceneBase, key: string, source: string, target: Phaser.GameObjects.Sprite, config: {} = {}, x: number = 0, y: number = 0, radius: number = 400) {
    if (AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key already exists: ' + key);
      return;
    }
    const soundUrl = AudioManager.getSoundSource(source);
    AudioManager.sounds[key] = new SpatialSound(scene, key, soundUrl, config, x, y, radius, target);
  }

  public static play(key: string, ignoreIfPlaying: boolean = true) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    if (!AudioManager.sounds[key].isPlaying() || (AudioManager.sounds[key].isPlaying() && !ignoreIfPlaying)) {
      AudioManager.sounds[key].play();
    }
  }

  public static stop(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    if (AudioManager.sounds[key].isPlaying()) {
      AudioManager.sounds[key].stop();
    }
  }

  public static volume(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    return AudioManager.sounds[key].volume();
  }

  public static fadeIn(key: string, duration: number = 400, volume: number = 1) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    AudioManager.sounds[key].fadeIn(volume, duration);
  }

  public static fadeOut(key: string, duration: number = 400, volume: number = 0) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    AudioManager.sounds[key].fadeOut(volume, duration);
  }

  public static removeSound(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    delete AudioManager.sounds[key];
  }

  private static getSoundSource(key: string): string | undefined {
    if (AudioManager.sources[key]) {
      return AudioManager.sources[key];
    } else {
      console.error('Audio Manager: A sound source with this key does not exist!');
    }
  }

  private static sounds: { [index: string]: SoundInterface } = {};
  private static sources: { [index: string]: string } = {};
}
