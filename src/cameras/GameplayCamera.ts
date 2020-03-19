import { CONST } from "../util/CONST";

export class GameplayCamera extends Phaser.Cameras.Scene2D.Camera {
  private follow!: Phaser.Physics.Matter.Sprite;

  constructor(scene: Phaser.Scene, follow: Phaser.Physics.Matter.Sprite, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.scene = scene;
    this.follow = follow;

    this.scene.cameras.remove(this.scene.cameras.main);
    this.scene.cameras.addExisting(this, true);
    this.scene.cameras.main.setRoundPixels(true);
    this.scene.cameras.main.setBounds(0, 0, this.scene.map.widthInPixels * CONST.SCALE, this.scene.map.heightInPixels * CONST.SCALE);
    this.startFollow(this.follow);
    this.fadeIn(400);
  }

  public getFollowedObject () {
    return this.follow;
  }
}
