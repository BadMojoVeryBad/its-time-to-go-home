import { WaitAction } from "./WaitAction";
import { CutsceneAction } from "./CutsceneAction";
import { PlayerJumpAction } from "./PlayerJumpAction";
import { PlayerRunToAction } from "./PlayerRunToAction";

export class ActionFactory {
  private static actions: object = {
    'wait': WaitAction,
    'playerJump': PlayerJumpAction,
    'playerRunTo': PlayerRunToAction
  }

  public static create(scene: Phaser.Scene, key: string, data: object):CutsceneAction {
    return new this.actions[key](scene, data);
  }
}
