import { CutsceneAction } from './CutsceneAction';
import { PlayerJumpAction } from './PlayerJumpAction';
import { PlayerRunToAction } from './PlayerRunToAction';
import { PlayerCrawlToAction } from './PlayerCrawlToAction';
import { WaitAction } from './WaitAction';
import { SetDepthAction } from './SetDepthAction';
import { MoveCameraToAction } from './MoveCameraToAction';
import { DrawTextAction } from './DrawTextAction';

export class ActionFactory {

  public static create(scene: Phaser.Scene, key: string, data: object): CutsceneAction {
    return new this.actions[key](scene, data);
  }
  private static actions: object = {
    wait: WaitAction,
    playerJump: PlayerJumpAction,
    playerRunTo: PlayerRunToAction,
    playerCrawlTo: PlayerCrawlToAction,
    setDepth: SetDepthAction,
    moveCameraTo: MoveCameraToAction,
    drawText: DrawTextAction
  };
}
