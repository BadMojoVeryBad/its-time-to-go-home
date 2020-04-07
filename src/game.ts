// @ts-nocheck

import 'phaser';
import { CONST } from './util/CONST';
import { GameBase } from './util/GameBase';
import { SceneUtils } from './util/SceneUtils';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  antialias: false,
  pixelart: true,
  width: 800,
  height: 600,
  input: {
    gamepad: true,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: true,
      debug: CONST.DEBUG,
    },
  },
  scene: SceneUtils.getScenes(),
};

new GameBase(config);
