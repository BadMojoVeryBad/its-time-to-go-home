import { AudioManager } from '../managers/audio/AudioManager';
import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase.ts';
import { CONST } from '../util/CONST.ts';
import { SpriteBase } from './base/SpriteBase.ts';

export class Tank extends SpriteBase {
  protected scene!: GameplaySceneBase;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    super(scene, x, y, 'player', 'fuel-tank0000');
    this.setupSprite();
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  public startTank() {
    this.anims.play('fuel-tank');
    AudioManager.play('machine_spatial');
  }

  private setupSprite() {
    // Set up physics.
    this.setIgnoreGravity(true);
    this.setStatic(true);

    // The x and y coordinates we get from the constructor are
    // for the top left, but Phaser works with center origin.
    // Translate the sprite to account for this.
    this.setPosition(this.x + this.textureWidth / 2, this.y - this.textureHeight / 2);

    // Mask itself? I guess.
    this.setMask(this.createBitmapMask());

    AudioManager.addSpatialSound(this.scene, 'machine_spatial', 'machine_mp3', this.scene.player.getSprite(), {
      loop: true,
      volume: 0.25,
    }, this.x, this.y, 800);
  }
}
