import { MainScene } from './scenes/MainScene';

const config: GameConfig = {
	type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
      	y: 500
      },
      debug: false
    }
  },
  scene: [ MainScene ]
};

const game = new Phaser.Game(config);
