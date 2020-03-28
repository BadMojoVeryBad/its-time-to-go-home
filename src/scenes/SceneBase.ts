import { InputController } from '../controllers/InputController';
import { GameBase } from '../util/GameBase';
const dat: any = require('dat.gui');

export abstract class SceneBase extends Phaser.Scene {

  public get gameWidth(): number {
    return this.sys.game.config.width as number;
  }

  public get gameHeight(): number {
    return this.sys.game.config.height as number;
  }
  // This property is set in the super constructor.
  // @ts-ignore
  public game: GameBase;
  public inputController!: InputController;
  protected gui!: any;

  private transitionEventFn?: any;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public create() {
    this.events.once('shutdown', () => {
      if (this.transitionEventFn !== undefined) {
        this.events.removeListener('create', this.transitionEventFn);
      }
    });
  }

  public addDebugNumber(obj: any, prop: string, min: number, max: number) {
    this.gui.add(obj, prop, min, max).listen();
  }

  public addDebugButton(obj: any, functionName: string) {
    this.gui.add(obj, functionName);
  }

  public addDebugBoolean(obj: any, prop: string) {
    this.gui.add(obj, prop).listen();
  }

  protected setView(): void {
    // Focus on center.
    this.cameras.main.centerOn(0, 0);
  }

  protected setupTransitionEvents(wait: number = 0, duration: number = 600): void {
    // Fade in the scene.
    this.transitionEventFn = () => {
      const graphics = this.add.graphics();
      graphics.setDepth(9999);
      graphics.fillStyle(0x000000, 1);
      graphics.setScrollFactor(0);
      graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
      this.tweens.add({
        targets: graphics,
        duration,
        alpha: 0,
        delay: wait,
      });
    };

    this.events.on('create', this.transitionEventFn);
  }

  protected changeScene(scene: string, duration: number = 300, data: {} = {}) {
    // Fade out the scene.
    const graphics = this.add.graphics();
    graphics.setDepth(9999);
    graphics.fillStyle(0x000000, 1);
    graphics.setScrollFactor(0);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
    graphics.setAlpha(0);
    this.tweens.add({
      targets: graphics,
      duration,
      alpha: 1,
      onComplete: () => {
        this.scene.start(scene, data);
      },
    });
  }

  protected setupInputs(): void {
    this.inputController = new InputController(this);
  }

  protected setupDebug() {
    this.gui = new dat.GUI({ name: 'Debug Values' });
    this.events.once('destroy', () => {
        this.gui.destroy();
    });
  }
}
