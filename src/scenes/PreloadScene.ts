import { SceneBase } from './base/SceneBase';

import loaderPng from '../assets/loading-bar.png';
import logoPng from '../assets/studio-logo.png';

export class PreloadScene extends SceneBase {
  constructor() {
    super({
      key: 'PreloadScene',
    });
  }

  public preload() {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);

    // Images.
    this.load.image('loader', loaderPng);
    this.load.image('logo', logoPng);

    // Go to next scene when loading is done.
    this.load.on('complete', () => {
      this.scene.start('CreditScene', {});
    });
  }
}
