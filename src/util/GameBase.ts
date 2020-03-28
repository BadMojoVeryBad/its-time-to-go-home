import { GameFlags } from './GameFlags';

export class GameBase extends Phaser.Game {
  public flags: GameFlags;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.flags = new GameFlags();
  }
}
