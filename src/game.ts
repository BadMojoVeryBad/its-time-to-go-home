// @ts-nocheck

import 'phaser';
import { SceneUtils } from './util/SceneUtils';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  antialias: false,
  pixelart: true,
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      gravity: true,
      debug: false,
    },
  },
  scene: SceneUtils.getScenes(),
};

const game = new Phaser.Game(config);
