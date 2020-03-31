// @ts-nocheck

import 'phaser';
import { CONST } from './util/CONST';
import { GameBase } from './util/GameBase';
import { SceneUtils } from './util/SceneUtils';
import SoundFadePlugin from 'phaser3-rex-plugins/plugins/soundfade-plugin.js';

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
      debug: CONST.DEBUG,
    },
  },
  plugins: {
    global: [{
      key: 'rexSoundFade',
      plugin: SoundFadePlugin,
      start: true,
    }],
  },
  scene: SceneUtils.getScenes(),
};

const game = new GameBase(config);
