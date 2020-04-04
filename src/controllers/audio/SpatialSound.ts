import { Howl, Howler } from 'howler';
import { GameplaySceneBase } from '../../scenes/GameplaySceneBase.ts';

export class SpatialSound extends Phaser.GameObjects.Container {
  private sound: Howl;
  private radius: number;
  protected scene!: GameplaySceneBase;

  constructor (scene: GameplaySceneBase, soundUrl: any, x: number, y: number, radius: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.sound = new Howl({
      src: [ soundUrl ],
      loop: true,
      volume: 0.5,
    });
  }

  public preUpdate(time: number, delta: number) {

  }
}
