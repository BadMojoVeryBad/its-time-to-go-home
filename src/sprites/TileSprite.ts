import { CONST } from '../util/CONST';

export class TileSprite extends Phaser.GameObjects.TileSprite {
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, texture: string, frame: string | undefined) {
    const textureHeight = scene.textures.get(texture).get().height;
    const textureWidth = scene.textures.get(texture).get().width;

    super(
      scene,
      x * CONST.SCALE + (textureWidth * CONST.SCALE / 2),
      y * CONST.SCALE + (textureHeight * CONST.SCALE / 2),
      width,
      height,
      texture,
      frame,
    );

    scene.add.existing(this);
  }

  public dontRepeatX() {
    this.width = this.scene.textures.get(this.texture.key).get().width * CONST.SCALE;
  }

  public dontRepeatY() {
    this.height = this.scene.textures.get(this.texture.key).get().height * CONST.SCALE;
  }
}
