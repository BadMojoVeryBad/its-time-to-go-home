import { SceneBase } from '../scenes/SceneBase';
import { CONST } from '../util/CONST';

export class Rocket {
  private rocketSprite: Phaser.Physics.Matter.Sprite;
  private rocketBackSprite: Phaser.Physics.Matter.Sprite;
  private scene: Phaser.Scene;

  constructor(scene: SceneBase, x: number | undefined, y: number | undefined) {
    this.scene = scene;
    x = x || CONST.ZERO;
    y = y || CONST.ZERO;

    // Create the sprites this object is made out of.
    const width = this.scene.textures.get('player').get('rocket').width * CONST.SCALE;
    this.rocketSprite = this.scene.matter.add.sprite((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF), 'player', 'rocket_front');
    this.rocketBackSprite = this.scene.matter.add.sprite((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF), 'player', 'rocket');
    this.rocketSprite.setScale(CONST.SCALE).setDepth(70);
    this.rocketBackSprite.setScale(CONST.SCALE).setDepth(70);

    // Add to scene.
    scene.add.existing(this.rocketSprite);
    scene.add.existing(this.rocketBackSprite);

    // Physics stuff.
    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;
    const sensor = M.Bodies.rectangle(CONST.ZERO, CONST.ZERO, width, width, { isSensor: true, label: 'rocket' });
    this.rocketSprite.setExistingBody(sensor);
    this.rocketBackSprite.setExistingBody(sensor);
    this.rocketSprite.setIgnoreGravity(true);
    this.rocketBackSprite.setIgnoreGravity(true);
    this.rocketSprite.setPosition((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF))
      .setDepth(70);
  }

  public getRocketSprite() {
    return this.rocketSprite;
  }

  public getRocketBackSprite() {
    return this.rocketBackSprite;
  }
}
