import { GameplaySceneBase } from '../scenes/GameplaySceneBase';
import { CONST } from '../util/CONST';

export class Rocks {
  private scene: GameplaySceneBase;
  private sprite: Phaser.GameObjects.Sprite;

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    this.scene = scene;

    const width = this.scene.textures.get('player').get('rocks0000').width * CONST.SCALE;
    const height = this.scene.textures.get('player').get('rocks0000').height * CONST.SCALE;
    this.sprite = this.scene.add.sprite((x * CONST.SCALE) + (width * CONST.HALF), (y * CONST.SCALE) - (height * CONST.HALF), 'player', 'rocks0000');
    this.sprite.setDepth(51);
    this.sprite.setScale(CONST.SCALE);
  }

  public playAnimation() {
    this.sprite.play('rocks');
  }
}
