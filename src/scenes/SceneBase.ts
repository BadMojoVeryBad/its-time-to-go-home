import { InputController } from '../controllers/InputController';

const dat: any = require('dat.gui');

export abstract class SceneBase extends Phaser.Scene {
  public inputController!: InputController;
  protected gui!: any;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public get gameWidth(): number {
    return this.sys.game.config.width as number;
  }

  public get gameHeight(): number {
    return this.sys.game.config.height as number;
  }

  protected setView(): void {
    // Focus on center.
    this.cameras.main.centerOn(0, 0);
  }

  protected setupTransitionEvents(): void {
    // Fade in the scene.
    this.events.on('create', (fromScene: Phaser.Scene) => {
      const graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 1);
      graphics.setScrollFactor(0);
      graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
      this.tweens.add({
        targets: graphics,
        duration: 600,
        alpha: 0,
      });
    }, this);
  }

  protected setupInputs(): void {
    this.inputController = new InputController(this);
  }

  public debug () {
    this.gui = new dat.GUI({ name: 'Debug Values' });
  }

  public addDebugNumber (obj: any, prop: string, min: number, max: number) {
    this.gui.add(obj, prop, min, max).listen();
  }

  public addDebugButton (obj: any, functionName: string) {
    this.gui.add(obj,functionName);
  }
}
