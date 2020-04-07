import { SceneBase } from '../../scenes/base/SceneBase.ts';
import { CONST } from '../../util/CONST';

/**
 * A base class to use to create sprites in this game. It provides
 * a bunch of helpful functions and abstractions.
 *
 * @extends Phaser.Physics.Matter.Sprite
 */
export class SpriteBase extends Phaser.Physics.Matter.Sprite {

  /**
   * The width in px of the sprite's texture in game, taking into account the
   * game's scale using `CONST.SCALE`.
   */
  protected textureWidth: number = 0;

  /**
   * The height in px of the sprite's texture in game, taking into account the
   * game's scale using `CONST.SCALE`.
   */
  protected textureHeight: number = 0;

  /**
   * Used to calculate the position of the sprite when the sprite origin and
   * matter body origin are different.
   */
  protected originOffsetX: number = 0;

  /**
   * Used to calculate the position of the sprite when the sprite origin and
   * matter body origin are different.
   */
  protected originOffsetY: number = 0;

  /**
   * Draws a border around the sprite if `CONST.DEBUG` is `true`.
   */
  private debugBorder?: Phaser.GameObjects.Graphics;

  /**
   * Draws a dot at the origin of the sprite if `CONST.DEBUG` is `true`.
   */
  private debugOrigin?: Phaser.GameObjects.Graphics;

  /**
   * Draws a dot at the origin of the sprite  body if `CONST.DEBUG` is
   * `true`.
   */
  private debugPhysicsOrigin?: Phaser.GameObjects.Graphics;

  /**
   * Creates a sprite with physics and adds it to the scene.
   *
   * @param scene The scene.
   * @param x The x position to add the sprite at.
   * @param y The y position to add the sprite at.
   * @param texture The texture key. Must be a texture atlas.
   * @param frame A frame in the texture atlas.
   */
  constructor(scene: SceneBase, x: number, y: number, texture: string, frame: string) {
    super(scene.matter.world, x, y, texture, frame);

    this.textureWidth = this.scene.textures.get(texture).get(frame).width * CONST.SCALE;
    this.textureHeight = this.scene.textures.get(texture).get(frame).height * CONST.SCALE;

    this.setScale(CONST.SCALE);

    this.scene.add.existing(this);

    if (CONST.DEBUG) {
      this.setupDebugGraphics();
    }
  }

  /**
   * Update the sprite.
   *
   * @param time The current timestamp.
   * @param delta The delta time, in ms, elapsed since the last frame.
   */
  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    // Draw debugging graphics.
    if (CONST.DEBUG) {
      // Sprite origin.
      if (this.debugOrigin !== undefined) {
        this.debugOrigin.setPosition(this.x, this.y);
      }

      // Sprite border.
      if (this.debugBorder !== undefined) {
        this.debugBorder.setPosition(this.x, this.y);
      }

      // Matter body origin.
      if (this.debugPhysicsOrigin !== undefined) {
        // Phaser/Matter typings are incomplete.
        // @ts-ignore
        this.debugPhysicsOrigin.setPosition(this.body.position.x - this.originOffsetX, this.body.position.y - this.originOffsetY);
      }
    }
  }

  /**
   * Sets the origin of the physics body inside the sprite. This essentially
   * allows you to offset the matter body inside the sprite.
   *
   * *Note to developers:* This method has a lot of lines that are ignored by
   * the Typescript linter. This is because the MatterJS plugin in Phaser
   * doesn't appear to have typings. Either that or I'm doing something
   * wrong 😊
   *
   * @param x A value between 0 and 1. 0.5 being the center of the body.
   * @param y A value between 0 and 1. 0.5 being the center of the body.
   */
  public setBodyOrigin(x: number, y: number): this {
    this.originOffsetX = x * this.textureWidth;
    this.originOffsetY = y * this.textureHeight;

    // @ts-ignore
    if (this.body && this.body.position && this.body.positionPrev) {
      // @ts-ignore
      this.body.position.x += this.originOffsetX;
      // @ts-ignore
      this.body.position.y += this.originOffsetY;
      // @ts-ignore
      this.body.positionPrev.x += this.originOffsetX;
      // @ts-ignore
      this.body.positionPrev.y += this.originOffsetY;
    }

    return this;
  }

  /**
   * Sets the position of the sprite, taking into account the physics
   * body offset created using `this.setBodyOrigin()`.
   *
   * @param x The x position of this Game Object. Default 0.
   * @param y The y position of this Game Object. Default `x`.
   * @param z The z position of this Game Object. Default 0.
   * @param w The w position of this Game Object. Default 0.
   */
  public setPosition(x?: number | undefined, y?: number | undefined, z?: number | undefined, w?: number | undefined): this {
    x = (x === undefined) ? 0 : x;
    y = (y === undefined) ? x : y;
    const offsetX = (this.originOffsetX === undefined) ? 0 : this.originOffsetX;
    const offsetY = (this.originOffsetY === undefined) ? 0 : this.originOffsetY;
    super.setPosition(x - offsetX, y - offsetY, z, w);
    return this;
  }

  /**
   * Makes the sprite behave like a `Phaser.GameObjects.Sprite`.
   */
  public disablePhysics() {
    this.setStatic(true);
    this.setIgnoreGravity(true);
    this.setCollisionCategory(0);
  }

  /**
   * Makes the sprite behave like a `Phaser.Physics.Matter.Sprite`.
   */
  public enablePhysics() {
    this.setStatic(false);
    this.setIgnoreGravity(false);
    this.setCollisionCategory(1);
  }

  /**
   * Creates graphics objects for the debug visuals.
   */
  private setupDebugGraphics() {
    // Draw the origin point of this sprite.
    this.debugOrigin = this.scene.add.graphics();
    this.debugOrigin.setDepth(CONST.DEBUG_DEPTH);
    this.debugOrigin.fillStyle(CONST.DEBUG_COLOR.SPRITE, 1);
    this.debugOrigin.fillCircle(0, 0, 0.5 * CONST.SCALE);
    this.debugOrigin.setPosition(this.x, this.y);

    // Draw the origin point of the matter body attached to this sprite.
    this.debugPhysicsOrigin = this.scene.add.graphics();
    this.debugPhysicsOrigin.setDepth(CONST.DEBUG_DEPTH);
    this.debugPhysicsOrigin.fillStyle(CONST.DEBUG_COLOR.PHYSICS, 1);
    this.debugPhysicsOrigin.fillCircle(0, 0, 0.5 * CONST.SCALE);
    this.debugPhysicsOrigin.setPosition(this.x, this.y);

    // Draw the border of the sprite.
    this.debugBorder = this.scene.add.graphics();
    this.debugBorder.setDepth(CONST.DEBUG_DEPTH);
    this.debugBorder.lineStyle(1, CONST.DEBUG_COLOR.SPRITE, 1);
    this.debugBorder.strokeRect(0 - (this.textureWidth * CONST.HALF), 0 - (this.textureHeight * CONST.HALF), this.textureWidth, this.textureHeight);
    this.debugBorder.setPosition(this.x, this.y);
  }
}
