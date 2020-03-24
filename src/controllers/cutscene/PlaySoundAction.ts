import { SoundController } from '../../controllers/SoundController';
import { CutsceneAction } from './CutsceneAction';

export class PlaySoundAction extends CutsceneAction {
  private key: string = '';

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.key = data.key;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      SoundController.play(this.key);
      resolve();
    });
  }
}
