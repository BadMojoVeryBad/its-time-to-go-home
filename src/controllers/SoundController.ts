import { SceneBase } from '../scenes/SceneBase';

export abstract class SoundController {

  public static init(game: Phaser.Game) {
    this.game = game;
  }

  public static addSound(key: string, config: {}) {
    if (SoundController.sounds[key]) {
      return;
    }

    SoundController.sounds[key] = this.game.sound.add(key, config);
  }

  public static getSound(key: string): Phaser.Sound.BaseSound {
    return SoundController.sounds[key];
  }

  public static play(key: string, ignoreIfPlaying: boolean = false) {
    if (!ignoreIfPlaying || (ignoreIfPlaying && !SoundController.sounds[key].isPlaying)) {
      SoundController.sounds[key].play();
    }
    return SoundController.sounds[key];
  }

  public static fadeIn(scene: SceneBase, key: string, ignoreIfPlaying: boolean = false) {
    if (!ignoreIfPlaying || (ignoreIfPlaying && !SoundController.sounds[key].isPlaying)) {
      this.game.plugins.get('rexSoundFade').fadeIn(scene, SoundController.sounds[key], 1600);
    }
    return SoundController.sounds[key];
  }

  public static fadeOut(scene: SceneBase, key: string) {
    this.game.plugins.get('rexSoundFade').fadeOut(scene, SoundController.sounds[key], 600);
  }

  private static game: Phaser.Game;
  private static sounds: { [index: string]: Phaser.Sound.BaseSound } = {};
}
