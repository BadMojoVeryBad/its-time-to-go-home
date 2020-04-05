import { CutsceneAction } from './CutsceneAction';

export class RemoveObjectAction extends CutsceneAction {
  private object!: Phaser.GameObjects.GameObject;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.object = data.object;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.object.destroy();
      resolve();
    });
  }
}
