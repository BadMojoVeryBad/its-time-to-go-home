import { GameplaySceneBase } from '../scenes/GameplaySceneBase.ts';
import { CONST } from '../util/CONST.ts';

export class Tank extends Phaser.Physics.Matter.Sprite {
  protected scene!: GameplaySceneBase;
  private textureWidth: number = 0;
  private textureHeight: number = 0;
  private debugOrigin: Phaser.GameObjects.Graphics | undefined;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    super(scene.matter.world, x, y, 'player', 'fuel-tank0000');
    this.setupSprite();
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    // Draw origin point for debugging.
    if (CONST.DEBUG && this.debugOrigin !== undefined) {
      this.debugOrigin.setPosition(this.x, this.y);
    }
  }

  public startTank() {
    this.anims.play('fuel-tank');
  }

  private setupSprite() {
    // Add the sprite to the scene.
    this.scene.add.existing(this);

    // Set the correct scale for this game.
    this.setScale(CONST.SCALE);

    // Set up physics.
    this.setIgnoreGravity(true);
    this.setStatic(true);

    // Get the width and height of the texture this sprite uses.
    // These can come in handy later.
    this.textureWidth = this.scene.textures.get('player').get('fuel-tank0000').width * CONST.SCALE;
    this.textureHeight = this.scene.textures.get('player').get('fuel-tank0000').height * CONST.SCALE;

    // The x and y coordinates we get from the constructor are
    // for the top left, but Phaser works with center origin.
    // Translate the sprite to account for this.
    this.setPosition(this.x + this.textureWidth / 2, this.y - this.textureHeight / 2);

    this.setMask(this.createBitmapMask());

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
