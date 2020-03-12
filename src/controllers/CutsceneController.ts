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
  private topBar!: Phaser.GameObjects.Graphics;
  private bottomBar!: Phaser.GameObjects.Graphics;

  constructor(scene: SceneBase) {
    super(scene);
  }

  public addAction(key: string, data: object) {
    this.queue.push(ActionFactory.create(this.scene, key, data));
  }

  public async play() {
    // Set flag so the rest of the game knows what's up.
    CutsceneController.inCutscene = true;

    // Start 'cutscene mode'.
    await this.openLetterbox();

    // Play each queued action in order.
    for (let i = 0; i < this.queue.length; i++) {
      await this.queue[i].do();
    }

    // End 'cutscene mode'.
    await this.closeLetterbox();

    // Reset flag.
    CutsceneController.inCutscene = false;
  }

  private closeLetterbox() {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.topBar,
        duration: 800,
        ease: 'Quart.easeInOut',
        y: 0 - this.scene.gameHeight / 4,
      });

      this.scene.tweens.add({
        targets: this.bottomBar,
        duration: 800,
        ease: 'Quart.easeInOut',
        y: this.scene.gameHeight / 4,
        onComplete: () => {
          resolve();
        },
      });

      this.scene.cameras.main.zoomTo(1, 800, 'Quart.easeInOut');
    });
  }

  private openLetterbox() {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;

      this.topBar = this.scene.add.graphics();
      this.topBar.setScrollFactor(0);
      this.topBar.fillStyle(0x000000, 1);
      this.topBar.fillRect(0, 0 - (this.scene.gameHeight / 4), this.scene.gameWidth, this.scene.gameHeight / 4);

      this.bottomBar = this.scene.add.graphics();
      this.bottomBar.setScrollFactor(0);
      this.bottomBar.fillStyle(0x000000, 1);
      this.bottomBar.fillRect(0, this.scene.gameHeight, this.scene.gameWidth, this.scene.gameHeight / 4);

      this.scene.tweens.add({
        targets: this.topBar,
        duration: 800,
        ease: 'Quart.easeInOut',
        y: this.scene.gameHeight / 4,
      });

      this.scene.tweens.add({
        targets: this.bottomBar,
        duration: 800,
        ease: 'Quart.easeInOut',
        y: 0 - (this.scene.gameHeight / 4),
        onComplete: () => {
          resolve();
        },
      });

      cam.zoomTo(1.4, 800, 'Quart.easeInOut');
    });
  }
}
