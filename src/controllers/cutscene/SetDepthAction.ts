import { CutsceneAction } from './CutsceneAction';

export class SetDepthAction extends CutsceneAction {
  private object!: any;
  private depth: number = 0;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.object = data.object;
    this.depth = data.depth;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.object.setDepth(this.depth);
      resolve();
    });
  }
}
