import { ParticleManager } from '../managers/ParticleManager';
import { SceneBase } from '../scenes/base/SceneBase';
import { CONST } from '../util/CONST';

export class Rocket {
  private rocketSprite: Phaser.Physics.Matter.Sprite;
  private rocketBackSprite: Phaser.Physics.Matter.Sprite;
  private scene: SceneBase;
  private particleManager: ParticleManager;

  constructor(scene: SceneBase, x: number | undefined, y: number | undefined) {
    this.scene = scene;
    x = x || CONST.ZERO;
    y = y || CONST.ZERO;

    // Create the sprites this object is made out of.
    const width = this.scene.textures.get('player').get('rocket0000').width * CONST.SCALE;
    this.rocketSprite = this.scene.matter.add.sprite((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF), 'player', 'rocket_front');
    this.rocketBackSprite = this.scene.matter.add.sprite((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF), 'player', 'rocket0000');
    this.rocketSprite.setScale(CONST.SCALE).setDepth(70);
    this.rocketBackSprite.setScale(CONST.SCALE).setDepth(70);

    // Add to scene.
    scene.add.existing(this.rocketSprite);
    scene.add.existing(this.rocketBackSprite);

    // Physics stuff.
    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;
    const sensor = M.Bodies.rectangle(CONST.ZERO, CONST.ZERO, width, width, { isSensor: true, label: 'rocket' });
    const sensor2 = M.Bodies.rectangle(CONST.ZERO, CONST.ZERO, width, width, { isSensor: true, label: 'rocket_back' });
    this.rocketSprite.setExistingBody(sensor);
    this.rocketBackSprite.setExistingBody(sensor2);
    this.rocketSprite.setIgnoreGravity(true);
    this.rocketBackSprite.setIgnoreGravity(true);
    this.rocketSprite.setPosition((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF))
      .setDepth(70);
    this.rocketBackSprite.setPosition((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (width * CONST.HALF))
      .setDepth(70);

    this.particleManager = new ParticleManager(this.scene);
    this.particleManager.createParticleEmitter('rocket_smoke', [
      'rocket_smoke_1',
      'rocket_smoke_2',
    ], 75);
    this.particleManager.getParticleEmitter('rocket_smoke').setPosition((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE));
    this.particleManager.start('rocket_smoke');
  }

  public getRocketSprite() {
    return this.rocketSprite;
  }

  public getSmokeParticles() {
    return this.particleManager.getParticleEmitter('rocket_smoke');
  }

  public getRocketBackSprite() {
    return this.rocketBackSprite;
  }
}
