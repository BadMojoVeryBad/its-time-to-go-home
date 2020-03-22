import { SceneBase } from '../scenes/SceneBase';
import { ActionFactory } from './cutscene/ActionFactory';
import { CutsceneAction } from './cutscene/CutsceneAction';

export class CutsceneController extends Phaser.GameObjects.Container {

  public static isInCutscene() {
    return this.inCutscene;
  }
  private static inCutscene: boolean = false;
  protected scene!: SceneBase;
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
