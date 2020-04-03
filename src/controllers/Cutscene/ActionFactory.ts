import { CloseLetterboxAction } from './CloseLetterboxAction';
import { CustomAction } from './CustomAction';
import { CutsceneAction } from './CutsceneAction';
import { DrawTextAction } from './DrawTextAction';
import { MoveCameraToAction } from './MoveCameraToAction';
import { OpenLetterboxAction } from './OpenLetterboxAction';
import { PlayerCrawlToAction } from './PlayerCrawlToAction';
import { PlayerJumpAction } from './PlayerJumpAction';
import { PlayerRunToAction } from './PlayerRunToAction';
import { PlaySoundAction } from './PlaySoundAction';
import { RemoveObjectAction } from './RemoveObjectAction';
import { SetDepthAction } from './SetDepthAction';
import { SoundVolumeAction } from './SoundVolumeAction';
import { WaitAction } from './WaitAction';
import { ClimbLadder } from './ClimbLadder';
import { FadeOutLayerAction } from './FadeOutLayerAction';
import { FadeInLayerAction } from './FadeInLayerAction';

export class ActionFactory {

  public static create(scene: Phaser.Scene, key: string, data: object): CutsceneAction {
    return new this.actions[key](scene, data);
  }
  private static actions: {} = {
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
