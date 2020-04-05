import { SceneBase } from '../../../scenes/SceneBase';
import { AudioManager } from '../../audio/AudioManager.ts';
import { CutsceneAction } from './CutsceneAction';

export class PlaySoundAction extends CutsceneAction {
  private key: string = '';

  constructor(scene: SceneBase, data: any) {
    super(scene);
    this.key = data.key;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      AudioManager.play(this.key);
      resolve();
    });
  }
}
