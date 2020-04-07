import { AudioManager } from '../managers/audio/AudioManager.ts';
import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase.ts';
import { SpriteBase } from './base/SpriteBase.ts';

export class Button extends SpriteBase {
  protected scene!: GameplaySceneBase;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    super(scene, x, y, 'player', 'button0000');
    this.setupSprite();
  }

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  public pressButton() {
    this.anims.play('button-active');
    this.scene.time.delayedCall(800, () => {
      AudioManager.play('beep');
    });
  }

  private setupSprite() {
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
  }
}
