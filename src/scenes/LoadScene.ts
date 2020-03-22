import { SceneBase } from './SceneBase';

import bigStarsBgPng from '../assets/big-stars-bg-sm.png';
import cratersFgPng from '../assets/craters-lg.png';
import cratersSmallFgPng from '../assets/craters-sm.png';
import mountainsBgPng from '../assets/mountains-bg-sm.png';
import smallStarsBgPng from '../assets/small-stars-bg-sm.png';
import spaceBgPng from '../assets/space-bg-sm.png';
import playerPng from '../assets/spritesheet.png';
import tilesheetPng from '../assets/tileset.png';

import fontFnt from '../assets/font.fnt';
import fontPng from '../assets/font.png';

import mapJson from '../assets/map.json';
import playerJson from '../assets/spritesheet.xml';
import { CONST } from '../util/CONST';

export class LoadScene extends SceneBase {
  private loader: any;
  private verticalOffsetPercentage: number = 0.125;

  constructor() {
    super({
      key: 'LoadScene',
    });
  }

  public preload() {
    // Asset atlas.
    this.load.atlasXML('player', playerPng, playerJson);

    // Images.
    this.load.image('stars1', spaceBgPng);
    this.load.image('stars3', bigStarsBgPng);
    this.load.image('stars2', smallStarsBgPng);
    this.load.image('mountains', mountainsBgPng);
    this.load.image('craters-lg', cratersFgPng);
    this.load.image('craters-sm', cratersSmallFgPng);

    // Load something 1000 times to simulate a long load.
    // This is obviously for debugging only.
    // for (let i = 0; i < 1000; i++) {
    //   this.load.image('craters-fg' + i, cratersFgPng);
    // }

    // Fonts.
    this.load.bitmapFont('font', fontPng, fontFnt);

    // Level map.
    this.load.tilemapTiledJSON('map', mapJson);
    this.load.spritesheet('tilesheet', tilesheetPng, {frameWidth: 16, frameHeight: 16});

    // Basic graphics and loading bar.
    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
    graphics.fillStyle(0xffffff, 1);

    this.loader = this.add.image(this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage, 'loader');
    this.loader.setScrollFactor(0);
    this.loader.setScale(8);
    this.loader.alpha = 1;

    const logo = this.add.image(this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) - this.gameHeight * this.verticalOffsetPercentage, 'logo');
    logo.setScrollFactor(0);
    logo.setScale(8);

    // Progress bar.
    this.load.on('progress', (percent: number) => {
      const x = this.loader.x - (this.loader.displayWidth / 2) + 8;
      const y = this.loader.y - (this.loader.displayHeight / 2) + 8;
      const height = 16;
      const width = (this.loader.displayWidth - 16) * percent;
      graphics.fillRect(x, y, width, height);
    });

    // Go to next scene when loading is done.
    this.load.on('complete', () => {
      this.cameras.main.fadeOut(600, 0, 0, 0, (camera: any, progress: number) => {
        if (progress === 1) {
          this.scene.start('MenuScene', {});
        }
      });
    });
  }

  public create() {
    this.anims.create({
      key: 'earth',
      frames: this.anims.generateFrameNames('player', { prefix: 'earth', start: 0, end: 26, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'info',
      frames: this.anims.generateFrameNames('player', { prefix: 'info-marker', start: 0, end: 15, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'info-highlighted',
      frames: this.anims.generateFrameNames('player', { prefix: 'info-marker-highlighted', start: 0, end: 15, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', { prefix: 'Untitled-1', start: 0, end: 5, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNames('player', { prefix: 'Untitled-1', start: 0, end: 0, zeroPad: 4 }),
      frameRate: 1,
      repeat: -1,
    });
    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-jump', start: 0, end: 2, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'crawl',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-crawl', start: 0, end: 7, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
  }
}
