import { SceneBase } from '../../scenes/base/SceneBase';
import { ActionFactory } from './ActionFactory';
import { CutsceneAction } from './actions/CutsceneAction';

/**
 * This manager is responsible for a single cutscene in a scene.
 */
export class CutsceneManager extends Phaser.GameObjects.Container {
  /**
   * Returns `true` if the game is currently in a cutscene.
   */
  public static isInCutscene() {
    return this.inCutscene;
  }

  /**
   * Is the game in a cutscene?
   */
  private static inCutscene: boolean = false;

  /**
   * The scene this cutscene instance belongs to.
   */
  protected scene!: SceneBase;

  /**
   * A queue of all the cutscene actions to take. When the cutscene
   * is player, they will be run one after the other.
   */
  private queue: CutsceneAction[] = [];

  /**
   * This manager is responsible for a single cutscene in a scene.
   *
   * Use like this:
   * ```
   * const cutscene = new CutsceneManager(this);
   * cutscene.addAction('openLetterbox', {});
   * cutscene.addAction('wait', { duration: 1000 });
   * cutscene.addAction('closeLetterbox', {});
   * cutscene.play();
   * ```
   *
   * @param scene The scene this cutscene shall run in.
   */
  constructor(scene: SceneBase) {
    super(scene);
  }

  /**
   * Add a cutscene action to the queue.
   *
   * @param key The key of the action to add.
   * @param data Any data that should be passed to the constructor of the action.
   */
  public addAction(key: string, data: object) {
    this.queue.push(ActionFactory.create(this.scene, key, data));
  }

  /**
   * Play the cutscene in the scene.
   */
  public async play() {
    // Set flag so the rest of the game knows what's up.
    CutsceneManager.inCutscene = true;

    // Disable inputs. The player can't do anything during a cutscene.
    this.scene.inputManager.disableAllControls();

    // Play each queued action in order.
    for (let i = 0; i < this.queue.length; i++) {
      await this.queue[i].do();
    }

    // Reenable inputs.
    this.scene.inputManager.enableAllControls();

    // Reset flag.
    CutsceneManager.inCutscene = false;
  }
}
