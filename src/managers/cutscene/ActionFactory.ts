import { ClimbLadder } from './actions/ClimbLadder';
import { CloseLetterboxAction } from './actions/CloseLetterboxAction';
import { CustomAction } from './actions/CustomAction';
import { CutsceneAction } from './actions/CutsceneAction';
import { DrawTextAction } from './actions/DrawTextAction';
import { FadeInLayerAction } from './actions/FadeInLayerAction';
import { FadeOutLayerAction } from './actions/FadeOutLayerAction';
import { MoveCameraToAction } from './actions/MoveCameraToAction';
import { OpenLetterboxAction } from './actions/OpenLetterboxAction';
import { PlayerCrawlToAction } from './actions/PlayerCrawlToAction';
import { PlayerJumpAction } from './actions/PlayerJumpAction';
import { PlayerRunToAction } from './actions/PlayerRunToAction';
import { PlaySoundAction } from './actions/PlaySoundAction';
import { RemoveObjectAction } from './actions/RemoveObjectAction';
import { SetDepthAction } from './actions/SetDepthAction';
import { SoundVolumeAction } from './actions/SoundVolumeAction';
import { WaitAction } from './actions/WaitAction';

/**
 * This class is used to generate cutscene actions based on the action's
 * key. It's used internally in the `CutsceneManager`.
 */
export abstract class ActionFactory {

  /**
   * Creates a new instance of a `CutsceneAction`.
   *
   * @param scene The scene this cutscene belongs to.
   * @param key The identifier for the cutscene action. This tells
   *            us what action to create and return.
   * @param data An object that is passed to the action's constructor.
   */
  public static create(scene: Phaser.Scene, key: string, data: object): CutsceneAction {
    return new this.actions[key](scene, data);
  }

  /**
   * A map of all the cutscene actions.
   */
  private static actions: { [index: string]: any } = {
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
    closeLetterbox: CloseLetterboxAction,
    playSound: PlaySoundAction,
    soundVolume: SoundVolumeAction,
    playerClimbLadder: ClimbLadder,
    fadeOutLayer: FadeOutLayerAction,
    fadeInLayer: FadeInLayerAction,
  };
}
