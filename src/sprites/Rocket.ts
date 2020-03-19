import { SceneBase } from "../scenes/SceneBase";

export class Rocket extends Phaser.GameObjects.Container {
  private rocketSprite: Phaser.Physics.Matter.Sprite;
  private rocketBackSprite: Phaser.Physics.Matter.Sprite;

  constructor (scene: SceneBase, x: number | undefined, y: number | undefined) {
    super(scene);
    x = x || 0;
    y = y || 0;
    this.rocketSprite = this.scene.matter.add.sprite((x * 4) + 128, (y * 4) - 128, 'player', 'rocket_front');
    this.rocketBackSprite = this.scene.matter.add.sprite((x * 4) + 128, (y * 4) - 128, 'player', 'rocket');
    this.rocketSprite.setScale(4).setDepth(70)
    this.rocketBackSprite.setScale(4).setDepth(70).setIgnoreGravity(true);
    // this.setDepth(70);
    scene.add.existing(this.rocketSprite);
    scene.add.existing(this.rocketBackSprite);
    // this.add(this.rocketSprite);
    // this.add(this.rocketBackSprite);

    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;
    const sensor = M.Bodies.rectangle(0, 0, 256, 256, { isSensor: true, label: 'rocket' });
    this.rocketSprite.setExistingBody(sensor);
    this.rocketBackSprite.setExistingBody(sensor);
    this.rocketSprite.setIgnoreGravity(true);
    this.rocketBackSprite.setIgnoreGravity(true);

    this.rocketSprite.setPosition((x * 4) + 128, (y * 4) - 128);
  }

  public getBackSprite () {
    return this.rocketBackSprite;
  }
}
