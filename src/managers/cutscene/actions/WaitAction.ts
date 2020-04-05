import { CutsceneAction } from './CutsceneAction';

export class WaitAction extends CutsceneAction {
  private duration: number = 1000;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.duration = data.duration;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.scene.time.delayedCall(this.duration, () => {
        resolve();
      });
    });
  }
}
