import { SceneBase } from './SceneBase';

import bigStarsBgPng from '../assets/big-stars-bg-sm.png';
import cratersFgPng from '../assets/craters-fg.png';
import cratersSmallFgPng from '../assets/craters-small-fg.png';
import homePng from '../assets/home.png';
import mountainsBgPng from '../assets/mountains-bg-sm.png';
import smallStarsBgPng from '../assets/small-stars-bg-sm.png';
import spaceBgPng from '../assets/space-bg-sm.png';
import tilesheetPng from '../assets/tileset.png';
import playerPng from '../assets/ttgh-spritesheet.png';
import dogPng from '../assets/dog.png';

import fontFnt from '../assets/font.fnt';
import fontPng from '../assets/font.png';

import mapJson from '../assets/map.json';
import playerJson from '../assets/ttgh-spritesheet.xml';

import shader from '../assets/outline.fnt';

export class LoadScene extends SceneBase {
  private loader: any;

  constructor() {
    super({
      key: 'LoadScene',
    });
  }

  public preload() {
    // Asset atlas.
    this.load.atlasXML('player', playerPng, playerJson);

    this.load.glsl('blur', shader);

    // Images.
    this.load.image('stars1', spaceBgPng);
    this.load.image('stars3', bigStarsBgPng);
    this.load.image('stars2', smallStarsBgPng);
    this.load.image('mountains', mountainsBgPng);
    this.load.image('craters-fg', cratersFgPng);
    this.load.image('craters-small-fg', cratersSmallFgPng);
    this.load.image('home', homePng);
    this.load.image('dog', homePng);

    // for (let i = 0; i < 1000; i++) {
    //   this.load.image('craters-fg' + i, cratersFgPng);
    // }

    // this.load.plugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');

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

    this.loader = this.add.image(this.gameWidth / 2, this.gameHeight / 1.25, 'loader');
    this.loader.setScrollFactor(0);
    this.loader.setScale(4);
    this.loader.alpha = 1;

    const logo = this.add.image(this.gameWidth / 2, this.gameHeight / 3, 'logo');
    logo.setScrollFactor(0);
    logo.setScale(8);

    // Progress bar.
    this.load.on('progress', (percent: number) => {
      graphics.fillRect(this.loader.x - (this.loader.displayWidth / 2) + 22, this.loader.y - (this.loader.displayHeight / 2), (this.loader.displayWidth - 44) * percent, this.loader.displayHeight);
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
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'info-highlighted',
      frames: this.anims.generateFrameNames('player', { prefix: 'info-marker-highlighted', start: 0, end: 15, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', { prefix: 'Untitled-1', start: 0, end: 5, zeroPad: 4 }),
      frameRate: 12,
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
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'crawl',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-crawl', start: 0, end: 7, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1,
    });
  }
}
