import { CutsceneAction } from './CutsceneAction';
import { PlayerJumpAction } from './PlayerJumpAction';
import { PlayerRunToAction } from './PlayerRunToAction';
import { PlayerCrawlToAction } from './PlayerCrawlToAction';
import { WaitAction } from './WaitAction';
import { SetDepthAction } from './SetDepthAction';
import { MoveCameraToAction } from './MoveCameraToAction';
import { DrawTextAction } from './DrawTextAction';
import { RemoveObjectAction } from './RemoveObjectAction';
import { CustomAction } from './CustomAction';
import { OpenLetterboxAction } from './openLetterboxAction';
import { CloseLetterboxAction } from './CloseLetterboxAction';

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
    drawText: DrawTextAction,
    removeObject: RemoveObjectAction,
    customFunction: CustomAction,
    openLetterbox: OpenLetterboxAction,
    closeLetterbox: CloseLetterboxAction
  };
}
