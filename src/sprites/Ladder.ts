import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase';
import { SpriteBase } from './base/SpriteBase.ts';

export class Ladder extends SpriteBase {
  protected scene!: GameplaySceneBase;

  constructor(scene: GameplaySceneBase, x: number, y: number, texture: string, frame: string) {
    super(scene, x, y, texture, frame);

    this.setIgnoreGravity(true);
    this.setSensor(true);
}

  public preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}
