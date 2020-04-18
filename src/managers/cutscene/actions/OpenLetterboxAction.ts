import { SceneBase } from '../../../scenes/base/SceneBase';
import { CONST } from '../../../util/CONST';
import { CutsceneAction } from './CutsceneAction';

export class OpenLetterboxAction extends CutsceneAction {
  private duration: number = 1000;
  private zoom: number = 1.4;

  constructor(scene: SceneBase, data: any) {
    super(scene);
    this.duration = data.duration;

    if (data.zoom !== undefined) {
      this.zoom = data.zoom;
    }
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;

      const topBar = this.scene.add.graphics();
      topBar.setDepth(401);
      topBar.setScrollFactor(0);
      topBar.fillStyle(0x000000, 1);
      topBar.fillRect(0, 0 - (this.scene.gameHeight / CONST.SCALE), this.scene.gameWidth, this.scene.gameHeight / CONST.SCALE);

      const bottomBar = this.scene.add.graphics();
      bottomBar.setDepth(400);
      bottomBar.setScrollFactor(0);
      bottomBar.fillStyle(0x000000, 1);
      bottomBar.fillRect(0, this.scene.gameHeight, this.scene.gameWidth, this.scene.gameHeight / CONST.SCALE);

      this.scene.data.set('cutscene_letterbox_top', topBar);
      this.scene.data.set('cutscene_letterbox_bottom', bottomBar);

      this.scene.tweens.add({
        targets: topBar,
        duration: 1600,
        ease: 'Quad.easeInOut',
        y: this.scene.gameHeight / CONST.SCALE,
      });

      this.scene.tweens.add({
        targets: bottomBar,
        duration: 1600,
        ease: 'Quad.easeInOut',
        y: 0 - (this.scene.gameHeight / CONST.SCALE),
        onComplete: () => {
          resolve();
        },
      });

      cam.zoomTo(this.zoom, 1600, 'Quad.easeInOut');
    });
  }
}
