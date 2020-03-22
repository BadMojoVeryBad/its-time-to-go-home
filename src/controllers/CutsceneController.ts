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
  private static inCutscene: boolean = false;
  private queue: CutsceneAction[] = [];
  protected scene!: SceneBase;

  constructor(scene: SceneBase) {
    super(scene);
  }

  public addAction(key: string, data: object) {
    this.queue.push(ActionFactory.create(this.scene, key, data));
  }

  public static isInCutscene() {
    return this.inCutscene;
  }

  public async play() {
    // Set flag so the rest of the game knows what's up.
    CutsceneController.inCutscene = true;

    // Disable inputs. The player can't do anything during a cutscene.
    this.scene.inputController.disableAllControls();

    // Play each queued action in order.
    for (let i = 0; i < this.queue.length; i++) {
      await this.queue[i].do();
    }

    // Reenable inputs.
    this.scene.inputController.enableAllControls();

    // Reset flag.
    CutsceneController.inCutscene = false;
  }
}
