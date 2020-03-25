import { SoundController } from '../SoundController';
import { CutsceneAction } from './CutsceneAction';

export class SoundVolumeAction extends CutsceneAction {
  private key: string = '';
  private volume: number = 0;
  private direction: string = 'none';

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.key = data.key;
    this.volume = data.volume;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.direction = (SoundController.getSound(this.key).volume > this.volume) ? 'down' : 'up';
      resolve();
    });
  }

  public preUpdate() {
    if (this.direction === 'none') {
      return;
    }

    if (this.direction === 'up') {
      SoundController.getSound(this.key).volume = SoundController.getSound(this.key).volume + 0.01;
    } else if (this.direction === 'down') {
      SoundController.getSound(this.key).volume = SoundController.getSound(this.key).volume - 0.01;
    }

    // If we hit the target, stop moving.
    if ((this.direction === 'up' && SoundController.getSound(this.key).volume > this.volume) ||
      (this.direction === 'down' && SoundController.getSound(this.key).volume < this.volume)) {
      this.direction = 'none';
    }
  }
}
