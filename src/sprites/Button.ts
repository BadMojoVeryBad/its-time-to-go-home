import { AudioManager } from '../controllers/audio/AudioManager.ts';
import { GameplaySceneBase } from '../scenes/GameplaySceneBase.ts';
import { CONST } from '../util/CONST.ts';

export class Button extends Phaser.Physics.Matter.Sprite {
  protected scene!: GameplaySceneBase;
  private textureWidth: number = 0;
  private textureHeight: number = 0;
  private originOffsetX: number = 0;
  private originOffsetY: number = 0;
  private debugOrigin: Phaser.GameObjects.Graphics | undefined;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    super(scene.matter.world, x, y, 'player', 'button0000');
    this.setupSprite();
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    // Draw origin point for debugging.
    if (CONST.DEBUG && this.debugOrigin !== undefined) {
      this.debugOrigin.setPosition(this.x, this.y);
    }
  }

  public pressButton() {
    this.anims.play('button-active');
    this.scene.time.delayedCall(800, () => {
      AudioManager.play('beep');
    });
  }

  public setBodyOrigin(x: number, y: number): this {
    this.originOffsetX = x * this.textureWidth;
    this.originOffsetY = y * this.textureHeight;

    if (this.body && this.body.position) {
      this.body.position.x += this.originOffsetX;
      this.body.position.y += this.originOffsetY;
      this.body.positionPrev.x += this.originOffsetX;
      this.body.positionPrev.y += this.originOffsetY;
    }

    return this;
  }

  public setPosition(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined): this {
    x = (x === undefined) ? 0 : x;
    y = (y === undefined) ? x : y;
    const offsetX = (this.originOffsetX === undefined) ? 0 : this.originOffsetX;
    const offsetY = (this.originOffsetY === undefined) ? 0 : this.originOffsetY;
    super.setPosition(x - offsetX, y - offsetY, z, w);
  }

  private setupSprite() {
    // Add the sprite to the scene.
    this.scene.add.existing(this);

    // Set the correct scale for this game.
    this.setScale(CONST.SCALE);

    // Get the width and height of the texture this sprite uses.
    // These can come in handy later.
    this.textureWidth = this.scene.textures.get('player').get('button0000').width * CONST.SCALE;
    this.textureHeight = this.scene.textures.get('player').get('button0000').height * CONST.SCALE;

    // Set up physics.
    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(this.x, this.y, this.textureWidth / 2 * (11 / 16), this.textureHeight * (6 / 16));
    this.setExistingBody(body);
    this.setIgnoreGravity(true);
    this.setStatic(true);
    this.setOrigin(0.5, 0.5);
    this.setBodyOrigin((2.75 / 16), (-5 / 16));

    // The x and y coordinates we get from the constructor are
    // for the bottom left, but Phaser works with center origin.
    // Translate the sprite to account for this.
    this.setPosition(this.x + this.textureWidth / 2, this.y - this.textureHeight / 2);

    // Setup debug graphics.
    if (CONST.DEBUG) {
      this.debugOrigin = this.scene.add.graphics();
      this.debugOrigin.setDepth(999);
      this.debugOrigin.fillStyle(0xffff00, 1);
      this.debugOrigin.fillCircle(0, 0, 5);
      this.debugOrigin.setPosition(this.x, this.y);
    }
  }
}
