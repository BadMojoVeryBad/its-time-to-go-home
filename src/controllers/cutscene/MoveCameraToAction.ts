import { CutsceneAction } from './CutsceneAction';

export class MoveCameraToAction extends CutsceneAction {
  private camera!: Phaser.Cameras.Scene2D.Camera;
  private xTarget: number = 0;
  private yTarget: number = 0;
  private follow: Phaser.Physics.Matter.Sprite | undefined = undefined;
  private duration: number = 2400;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.camera = data.camera;
    this.follow = data.follow;
    this.xTarget = data.xTarget;
    this.yTarget = data.yTarget;

    if (data.duration !== undefined) {
      this.duration = data.duration;
    }
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      if (this.follow === undefined) {
        this.camera.stopFollow();
        this.camera.pan(this.xTarget + 400, this.yTarget + 300, this.duration, 'Quad.easeInOut', false, (camera: any, progress: number) => {
          if (progress === 1) {
            resolve();
          }
        });
      } else {
        this.camera.pan(this.follow.x, this.follow.y - 100, this.duration, 'Quad.easeInOut', false, (camera: any, progress: number) => {
          if (progress === 1) {
            this.camera.startFollow(this.follow, true, 0.1, 0.1, 0, 100);
            resolve();
          }
        });
      }
    });
  }
}
