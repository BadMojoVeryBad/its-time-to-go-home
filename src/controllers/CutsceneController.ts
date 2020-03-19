import { SceneBase } from '../scenes/SceneBase';
import { ActionFactory } from './cutscene/ActionFactory';
import { CutsceneAction } from './cutscene/CutsceneAction';

/**
 * TODO:
 *   Disable player controls when cutscene active.
 *   Clean up letterbox code a bit.
 *   Move player action.
 */
export class CutsceneController extends Phaser.GameObjects.Container {

  public static isInCutscene() {
    return this.inCutscene;
  }
  private static inCutscene: boolean = false;
  private queue: CutsceneAction[] = [];

  constructor(scene: SceneBase) {
    super(scene);
  }

  public addAction(key: string, data: object) {
    this.queue.push(ActionFactory.create(this.scene, key, data));
  }

  public async play() {
    // Set flag so the rest of the game knows what's up.
    CutsceneController.inCutscene = true;

    // Play each queued action in order.
    for (let i = 0; i < this.queue.length; i++) {
      await this.queue[i].do();
    }

    // Reset flag.
    CutsceneController.inCutscene = false;
  }
}
