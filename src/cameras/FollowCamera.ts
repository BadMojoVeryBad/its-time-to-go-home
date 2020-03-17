export class FollowCamera extends Phaser.Cameras.Scene2D.Camera {
  private follow!: Phaser.Physics.Matter.Sprite;

  constructor(scene: Phaser.Scene, follow: Phaser.Physics.Matter.Sprite, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.scene = scene;
    this.follow = follow;
    // this.startFollow(follow, true, 0.1, 0.1, 0, 100);
    // this.setOrigin(0, 0);

    this.scene.cameras.remove(this.scene.cameras.main);
    this.scene.cameras.addExisting(this, true);
    this.scene.cameras.main.setRoundPixels(true);
    this.scene.cameras.main.setBounds(0, 0, this.scene.map.widthInPixels * 4, this.scene.map.heightInPixels * 4);
    this.fadeIn(400);
  }

  public getFollowedObject () {
    return this.follow;
  }
}
