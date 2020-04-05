import { CutsceneAction } from './CutsceneAction';

export class CustomAction extends CutsceneAction {
  private fn: (resolve: () => void) => void;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.fn = data.fn;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.fn(resolve);
    });
  }
}
