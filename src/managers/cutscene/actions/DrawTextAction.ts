import { SceneBase } from '../../../scenes/SceneBase';
import { CutsceneAction } from './CutsceneAction';

export class DrawTextAction extends CutsceneAction {
  private text: string = '';
  private x: number = 0;
  private y: number = 0;
  private duration = 800;
  private color = '';
  private fadeAfter: number = 0;

  constructor(scene: SceneBase, data: any) {
    super(scene);
    this.text = data.text;
    this.x = data.x;
    this.y = data.y;

    if (data.duration !== undefined) {
      this.duration = data.duration;
    }

    if (data.color !== undefined) {
      this.color = data.color;
    }

    if (data.fadeAfter !== undefined) {
      this.fadeAfter = data.fadeAfter;
    }
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      const font = (this.color) ? 'font_' + this.color : 'font';
      const text = this.scene.add.bitmapText(this.x, this.y, font, this.text);
      text.setDepth(200);
      text.setScale(0.5);
      text.setAlpha(0);

      this.scene.tweens.add({
        targets: text,
        duration: this.duration,
        ease: 'Quad.easeInOut',
        alpha: 1,
        onComplete: () => {
          resolve();

          if (this.fadeAfter) {
            this.scene.tweens.add({
              targets: text,
              duration: 800,
              ease: 'Quad.easeInOut',
              alpha: 0,
              delay: this.fadeAfter,
              onComplete: () => {
                text.destroy();
              },
            });
          }
        },
      });
    });
  }
}
