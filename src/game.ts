import { MainScene } from './scenes/MainScene';

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
      debug: false
    }
  },
  scene: [ MainScene ]
};

const game = new Phaser.Game(config);
