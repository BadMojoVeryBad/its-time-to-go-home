export abstract class SceneBase extends Phaser.Scene {
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
    this.events.on('create', (fromScene:Phaser.Scene) => {
      let graphics = this.add.graphics();
      graphics.fillStyle(0x000000, 1);
      graphics.setScrollFactor(0);
      graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
      this.tweens.add({
        targets: graphics,
        duration: 600,
        alpha: 0
      })
    }, this);
  }
}
