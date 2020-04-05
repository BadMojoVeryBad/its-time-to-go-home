import { Howl } from 'howler';
import { GameplaySceneBase } from '../../scenes/GameplaySceneBase.ts';
import AwaitLoaderCallback from '../../util/loader/AwaitLoaderCallback';
import { Sound } from './Sound.ts';
import { SoundInterface } from './SoundInterface.ts';
import { SpatialSound } from './SpatialSound';

/**
 * Manages the audio in this game. It's basically a wrapper around Howler.
 *
 * Because everything is managed globally, this manager is static and abstract.
 */
export abstract class AudioManager {

  /**
   * Add an audio asset to the audio manager. This does not preload the audio,
   * it will wait until the sound is created using AudioManager.addSound()
   * to load the asset.
   *
   * @param key A unique indetifier for the sound source.
   * @param source The URL to the audio asset.
   */
  public static addSoundSource(key: string, source: string) {
    if (AudioManager.sources[key]) {
      console.error('AudioManager: An audio source with this key already exists: ' + key);
    } else {
      AudioManager.sources[key] = source;
    }
  }

  /**
   * Add an audio asset to the audio manager. This preloads the audio, so
   * that there will be no delays when playing the sound. This method is
   * designed to be called in a scene's preload() method.
   *
   * @param scene The calling scene.
   * @param key A unique identifier for the sound source.
   * @param source A URL ti the audio asset.
   */
  public static preloadSoundSource(scene: Phaser.Scene, key: string, source: string) {
    // Phaser 3 typings doesn't like this call :(
    // @ts-ignore
    scene.sys.load.await = AwaitLoaderCallback;

    // The await loader has no TypeScript typing, so we tell the linter to
    // ignore it's call.
    // @ts-ignore
    scene.load.await(async (resolve: () => void) => {
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
          },
        });
      }
    });
  }

  /**
   * Adds a playable sound to this audio manager.
   *
   * @param key A unique identifier for the sound.
   * @param source The key of the sound source to use, as added to the audio
   *               manager using AudioManager.preloadSoundSource().
   * @param config Config for the Howler sound object.
   */
  public static addSound(key: string, source: string, config: {} = {}) {
    if (AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key already exists: ' + key);
      return;
    }
    const soundUrl = AudioManager.getSoundSource(source);
    AudioManager.sounds[key] = new Sound(soundUrl, config);
  }

  /**
   * Adds a playable spatial sound to this manager. Spatial sound means
   * that it will adjust it's volume based on how far away it is from the
   * target. This sound is tied to the scene it's in, so it will be
   * detroyed when the scene is.
   *
   * @param scene The scene this spatial sound belongs to.
   * @param key A unique identifier for this sound.
   * @param source The key of the sound source to use, as added to the audio
   *               manager using AudioManager.preloadSoundSource().
   * @param target The Phaser gameobject to adjust the sound volume to. The
   *               volume will become quieter the farther away from this object
   *               it is.
   * @param config Config for the Howler sound object.
   * @param x The sound's x position in the scene.
   * @param y The sound's y position in the scene.
   * @param radius The distance away from the sound's position it can be heard.
   */
  public static addSpatialSound(scene: GameplaySceneBase, key: string, source: string, target: Phaser.GameObjects.Sprite, config: {} = {}, x: number = 0, y: number = 0, radius: number = 400) {
    if (AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key already exists: ' + key);
      return;
    }
    const soundUrl = AudioManager.getSoundSource(source);
    AudioManager.sounds[key] = new SpatialSound(scene, key, soundUrl, config, x, y, radius, target);
  }

  /**
   * Play a sound in the audio manager.
   *
   * @param key The key of the sound to play.
   * @param ignoreIfPlaying Will not restart playback if the sound is already playing. Default `true`.
   */
  public static play(key: string, ignoreIfPlaying: boolean = true) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    if (!AudioManager.sounds[key].isPlaying() || (AudioManager.sounds[key].isPlaying() && !ignoreIfPlaying)) {
      AudioManager.sounds[key].play();
    }
  }

  /**
   * Stop a sound in the audio manager.
   *
   * @param key The key of the sound to stop.
   */
  public static stop(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    if (AudioManager.sounds[key].isPlaying()) {
      AudioManager.sounds[key].stop();
    }
  }

  /**
   * Get the volume of a sound in the audio manager.
   *
   * @param key The key of the sound to get the volume for.
   */
  public static volume(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    return AudioManager.sounds[key].volume();
  }

  /**
   * Fade in a sound in the audio manager.
   *
   * @param key The key of the sound to fade in.
   */
  public static fadeIn(key: string, duration: number = 400, volume: number = 1) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    AudioManager.sounds[key].fadeIn(volume, duration);
  }

  /**
   * Fade out a sound in the audio manager.
   *
   * @param key The key of the sound to fade out.
   */
  public static fadeOut(key: string, duration: number = 400, volume: number = 0) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    AudioManager.sounds[key].fadeOut(volume, duration);
  }

  /**
   * Remove a sound in the audio manager. It will no longer be playable.
   *
   * @param key The key of the sound to remove.
   */
  public static removeSound(key: string) {
    if (!AudioManager.sounds[key]) {
      console.error('AudioManager: A sound with this key does not exist: ' + key);
      return;
    }
    delete AudioManager.sounds[key];
  }

  /**
   * A map of all the sounds in the game. Sounds are added to this map using
   * the AudioManager.addSound() method.
   */
  private static sounds: { [index: string]: SoundInterface } = {};

  /**
   * A map of all the audio sources used in this game. These are preloaded at
   * the start of the game, so that no audio sources are loaded while the game
   * is running.
   *
   * An audio source is preloaded by calling AudioManager.preloadSoundSource()
   * method in the preload scene of a scene.
   */
  private static sources: { [index: string]: string } = {};

  /**
   * An internal method used to get a sound source from the sound source's
   * unique key.
   *
   * @param key The sound source's key, as defined using the
   *            AudioManager.preloadSoundSource() method.
   */
  private static getSoundSource(key: string): string | undefined {
    if (AudioManager.sources[key]) {
      return AudioManager.sources[key];
    } else {
      console.error('Audio Manager: A sound source with this key does not exist!');
    }
  }
}
