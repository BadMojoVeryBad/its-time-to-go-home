import { SceneBase } from './SceneBase';

export class CreditScene extends SceneBase {
  private logo: any;

  constructor() {
    super({
      key: 'CreditScene',
    });
  }

  public preload() {
    // Basic graphics and loading bar.
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);

    // Load the next scene after two seconds.
    this.time.delayedCall(2000, () => {
      this.scene.start('LoadScene', {});
    });
  }

  public create() {
    this.logo = this.add.image(this.gameWidth / 2, this.gameHeight / 3, 'logo');
    this.logo.setScrollFactor(0);
    this.logo.setScale(8);
    this.logo.alpha = 0;
  }

  public update() {
    // The worst fade in ever.
    if (this.logo.alpha < 1) {
      this.logo.alpha += 0.03;
    }
  }
}
