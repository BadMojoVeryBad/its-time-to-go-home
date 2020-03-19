import { CutsceneAction } from './CutsceneAction';

export class DrawTextAction extends CutsceneAction {
  private text: string = '';
  private x: number = 0;
  private y: number = 0;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.text = data.text;
    this.x = data.x;
    this.y = data.y;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      const text = this.scene.add.bitmapText(this.x, this.y, 'font', this.text);
      text.setDepth(200);
      text.setScale(0.5);
      text.setAlpha(0);
      this.scene.tweens.add({
        targets: text,
        duration: 800,
        ease: 'Quad.easeInOut',
        alpha: 1,
        onComplete: () => {
          resolve();
        },
      });
    });
  }
}
