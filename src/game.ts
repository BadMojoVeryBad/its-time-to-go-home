import 'phaser';
import { CreditScene } from './scenes/CreditScene';
import { LoadScene } from './scenes/LoadScene';
import { MainScene } from './scenes/MainScene';
import { MenuScene } from './scenes/MenuScene';
import { PreloadScene } from './scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  antialias: false,
  pixelart: true,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      gravity: 1,
      debug: false,
    },
  },
  scene: [ PreloadScene, CreditScene, LoadScene, MenuScene, MainScene ],
};

const game = new Phaser.Game(config);
