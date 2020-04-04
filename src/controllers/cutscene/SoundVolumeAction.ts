import { SoundController } from '../SoundController';
import { CutsceneAction } from './CutsceneAction';
import { AudioManager } from '../audio/AudioManager.ts';
import { SceneBase } from '../../scenes/SceneBase.ts';

export class SoundVolumeAction extends CutsceneAction {
  private key: string = '';
  private volume: number = 0;
  private direction: string = 'none';

  constructor(scene: SceneBase, data: any) {
    super(scene);
    this.key = data.key;
    this.volume = data.volume;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.direction = (AudioManager.volume(this.key) > this.volume) ? 'down' : 'up';

      if (this.direction === 'up') {
        AudioManager.fadeIn(this.key, 1600, this.volume);
      } else {
        AudioManager.fadeOut(this.key, 1600, this.volume);
      }

      resolve();
    });
  }
}
