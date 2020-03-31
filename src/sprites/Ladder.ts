import { GameplaySceneBase } from "../scenes/GameplaySceneBase";

export class Ladder extends Phaser.Physics.Matter.Sprite {
  protected scene!: GameplaySceneBase;

  constructor(scene: GameplaySceneBase, x: number, y: number, texture: string, frame: string) {
    super(scene.matter.world, x, y, texture, frame);

    this.setIgnoreGravity(true);
    this.setSensor(true);

    scene.add.existing(this);
}

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}
