import 'phaser';

export class FollowCamera extends Phaser.Cameras.Scene2D.Camera {
  private follow!: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, follow: Phaser.Physics.Arcade.Sprite, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.follow = follow;
    this.startFollow(follow, true, 0.1, 0.1);
  }

  public updateCamera() {
    // Do things here.
  }
}