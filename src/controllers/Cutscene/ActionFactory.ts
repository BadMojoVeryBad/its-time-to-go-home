import { CutsceneAction } from './CutsceneAction';
import { PlayerJumpAction } from './PlayerJumpAction';
import { PlayerRunToAction } from './PlayerRunToAction';
import { WaitAction } from './WaitAction';

export class ActionFactory {

  public static create(scene: Phaser.Scene, key: string, data: object): CutsceneAction {
    return new this.actions[key](scene, data);
  }
  private static actions: object = {
    wait: WaitAction,
    playerJump: PlayerJumpAction,
    playerRunTo: PlayerRunToAction,
  };
}
