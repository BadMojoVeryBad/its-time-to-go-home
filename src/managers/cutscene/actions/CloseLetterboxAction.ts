import { SceneBase } from '../../../scenes/base/SceneBase';
import { CONST } from '../../../util/CONST';
import { CutsceneAction } from './CutsceneAction';

export class CloseLetterboxAction extends CutsceneAction {
  private duration: number = 1000;

  constructor(scene: SceneBase, data: any) {
    super(scene);
    this.duration = data.duration;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      const topBar = this.scene.data.get('cutscene_letterbox_top');
      const bottomBar = this.scene.data.get('cutscene_letterbox_bottom');

      this.scene.tweens.add({
        targets: topBar,
        duration: 1600,
        ease: 'Quad.easeInOut',
        y: 0 - this.scene.gameHeight / CONST.SCALE,
      });

      this.scene.tweens.add({
        targets: bottomBar,
        duration: 1600,
        ease: 'Quad.easeInOut',
        y: this.scene.gameHeight / CONST.SCALE,
        onComplete: () => {
          resolve();
        },
      });

      this.scene.data.remove([ 'cutscene_letterbox_top', 'cutscene_letterbox_bottom' ]);

      this.scene.cameras.main.zoomTo(1, 1600, 'Quad.easeInOut');
    });
  }
}
