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

  public static getSound(key: string) {
    return SoundController.sounds[key];
  }

  public static play(key: string, ignoreIfPlaying: boolean = false) {
    if (!ignoreIfPlaying || (ignoreIfPlaying && !SoundController.sounds[key].isPlaying)) {
      SoundController.sounds[key].play();
    }
    return SoundController.sounds[key];
  }
  private static game: Phaser.Game;
  private static sounds: { [index: string]: Phaser.Sound.BaseSound } = {};
}
