import { CONST } from '../util/CONST';
import { SceneBase } from './base/SceneBase';

export class CreditScene extends SceneBase {
  private logo: any;
  private verticalOffsetPercentage: number = 0.125;

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
    this.logo = this.add.image(this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) - this.gameHeight * this.verticalOffsetPercentage, 'logo');
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
