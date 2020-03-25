// @ts-nocheck

import 'phaser';
import SoundFadePlugin from 'phaser3-rex-plugins/plugins/soundfade-plugin.js';
import { CONST } from './util/CONST';
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
      debug: CONST.DEBUG,
    },
  },
  plugins: {
    global: [{
      key: 'rexSoundFade',
      plugin: SoundFadePlugin,
      start: true
    }]
  },
  scene: SceneUtils.getScenes(),
};

const game = new Phaser.Game(config);
