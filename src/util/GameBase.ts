import { InputManager } from '../managers/input/InputManager.ts';
import { GameFlags } from './GameFlags';

export class GameBase extends Phaser.Game {
  public flags: GameFlags;
  public inputManager!: InputManager;

  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);

    this.flags = new GameFlags();

    this.scene.start('InputScene', {});

    this.scene.start('PreloadScene', {});

    this.scene.start('VignetteScene', {});
  }
}
