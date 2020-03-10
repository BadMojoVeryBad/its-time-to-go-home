import { WaitAction } from "./WaitAction";
import { CutsceneAction } from "./CutsceneAction";
import { MovePlayerAction } from "./MovePlayerAction";

export class ActionFactory {
  private static actions: object = {
    'wait': WaitAction,
    'movePlayer': MovePlayerAction
  }

  public static create(scene: Phaser.Scene, key: string, data: object):CutsceneAction {
    return new this.actions[key](scene, data);
  }
}
