import { SceneBase } from './base/SceneBase';
import vignettePng from '../assets/vignette.png';

export class VignetteScene extends SceneBase {
  constructor() {
    super({
      key: 'VignetteScene',
    });
  }

  public preload() {
    this.load.image('vignette', vignettePng);
  }

  public create() {
    super.create();

    // Game-wide filters.
    const vignette = this.add.image(0, 0, 'vignette');
    vignette.setOrigin(0);
    vignette.setScale(1);
    vignette.alpha = 0.3;
    vignette.setScrollFactor(0);
    vignette.setDepth(360);

    const g = this.add.graphics();
    g.fillStyle(0x88e4ff, 1);
    g.fillRect(0, 0, this.gameWidth, this.gameHeight);
    g.setScrollFactor(0);
    g.setDepth(350);
    g.setBlendMode(Phaser.BlendModes.MULTIPLY);
    g.alpha = 0.5;
  }
}
