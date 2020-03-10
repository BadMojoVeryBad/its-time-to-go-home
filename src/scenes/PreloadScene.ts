import { SceneBase } from "./SceneBase";

import loaderPng from '../assets/loader.png';
import logoPng from '../assets/studio-logo.png';

export class PreloadScene extends SceneBase {
  constructor () {
    super({
      key: 'PreloadScene'
    });
  }

  preload () {
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);

    // Images.
    this.load.image('loader', loaderPng);
    this.load.image('logo', logoPng);

    // Go to next scene when loading is done.
    this.load.on('complete', () => {
      this.scene.start('CreditScene', {});
    })
  }
}
