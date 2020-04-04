import { Howl } from 'howler';
import { SoundInterface } from './SoundInterface.ts';

export class Sound implements SoundInterface {
  private sound: Howl;

  constructor(soundUrl: any, config: {} = {}) {
    let howlConfig = {
      volume: 1,
      loop: false,
      src: [ soundUrl ],
    };

    howlConfig = Object.assign(howlConfig, config);

    this.sound = new Howl(howlConfig);
  }

  public volume(): number {
    return this.sound.volume();
  }

  public play() {
    this.sound.play();
  }

  public stop() {
    this.sound.stop();
  }

  public fadeIn(volume: number = 1, duration: number = 400) {
    this.sound.fade(this.sound.volume(), volume, duration);
  }

  public fadeOut(volume: number = 0, duration: number = 400) {
    this.sound.fade(this.sound.volume(), volume, duration);
  }

  public isPlaying(): boolean {
    return this.sound.playing();
  }
}
