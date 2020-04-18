import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase';
import { CONST } from '../util/CONST';
import { SpriteBase } from './base/SpriteBase.ts';

export class Rocks {
  private scene: GameplaySceneBase;
  private sprite: SpriteBase;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    this.scene = scene;

    const width = this.scene.textures.get('player').get('rocks0000').width * CONST.SCALE;
    const height = this.scene.textures.get('player').get('rocks0000').height * CONST.SCALE;
    this.sprite = new SpriteBase(scene, (x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (height * CONST.HALF), 'player', 'rocks0000');
    this.sprite.setDepth(51);
    this.sprite.setScale(CONST.SCALE);
    this.sprite.disablePhysics();
  }

  public playAnimation() {
    this.sprite.play('rocks');
  }

  public playEndAnimation() {
    this.sprite.play('rocks_end_start');
    this.scene.time.delayedCall(3000, () => {
      this.sprite.play('rocks_end_loop');
    });
  }
}
