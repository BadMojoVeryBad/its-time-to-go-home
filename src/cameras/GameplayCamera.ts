import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase';
import { CONST } from '../util/CONST';

export class GameplayCamera extends Phaser.Cameras.Scene2D.Camera {
  public scene: GameplaySceneBase;
  private follow!: Phaser.Physics.Matter.Sprite;

  constructor(scene: GameplaySceneBase, follow: Phaser.Physics.Matter.Sprite, x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.scene = scene;
    this.follow = follow;

    this.scene.cameras.remove(this.scene.cameras.main);
    this.scene.cameras.addExisting(this, true);
    this.scene.cameras.main.setRoundPixels(true);
    this.scene.cameras.main.setBounds(CONST.ZERO, CONST.ZERO, this.scene.map.widthInPixels * CONST.SCALE, this.scene.map.heightInPixels * CONST.SCALE);
    this.startFollow(this.follow, true, 0.1, 0.1, 0, 100);
    this.fadeIn(400);

    // Debug.
    if (CONST.DEBUG) {
      this.scene.addDebugNumber(this.scene.cameras.main, 'zoom', 1, 2);
      this.scene.addDebugNumber(this.scene.cameras.main, 'scrollX', 0, this.scene.map.widthInPixels * CONST.SCALE);
      this.scene.addDebugNumber(this.scene.cameras.main, 'scrollY', 0, this.scene.map.heightInPixels * CONST.SCALE);

      const obj = {
        'Stop Follow': () => {
          this.scene.cameras.main.stopFollow();
        },
        'Start Follow': () => {
          this.scene.cameras.main.startFollow(this.follow, true, 0.1, 0.1, 0, 100);
        },
      };

      this.scene.addDebugButton(obj, 'Start Follow');
      this.scene.addDebugButton(obj, 'Stop Follow');
    }
  }

  public getFollowedObject() {
    return this.follow;
  }
}
