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
import fontRedPng from '../assets/font_red.png';

import Music3Mp3 from '../assets/stargazing.mp3';
import ActivateMp3 from '../assets/ttgh_activate.mp3';
import CrawlMp3 from '../assets/ttgh_crawl.mp3';
import DeactivateMp3 from '../assets/ttgh_deactivate.mp3';
import JumpMp3 from '../assets/ttgh_jump.mp3';
import Music1Mp3 from '../assets/ttgh_music.mp3';
import Music2Mp3 from '../assets/ttgh_music_2.mp3';
import RocketNoFuelMp3 from '../assets/ttgh_rocket_nofuel.mp3';
import WalkMp3 from '../assets/ttgh_walk.mp3';

import mapJson from '../assets/map.json';
import map2Json from '../assets/map2.json';
import playerJson from '../assets/spritesheet.xml';
import { AudioManager } from '../controllers/audio/AudioManager.ts';
import { ParticleController } from '../controllers/ParticleController';
import { SoundController } from '../controllers/SoundController';
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

    // Audio.
    this.load.audio('audio_activate', ActivateMp3);
    this.load.audio('audio_deactivate', DeactivateMp3);
    this.load.audio('audio_music', Music1Mp3);
    this.load.audio('audio_music_2', Music2Mp3);
    this.load.audio('audio_music_3', Music3Mp3);
    this.load.audio('audio_walk', WalkMp3);
    this.load.audio('audio_crawl', CrawlMp3);
    this.load.audio('audio_jump', JumpMp3);
    this.load.audio('audio_rocket_nofuel', RocketNoFuelMp3);

    // Fonts.
    this.load.bitmapFont('font', fontPng, fontFnt);
    this.load.bitmapFont('font_red', fontRedPng, fontFnt);

    // Level map.
    this.load.tilemapTiledJSON('map', mapJson);
    this.load.tilemapTiledJSON('map2', map2Json);
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
    this.anims.create({
      key: 'climb',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-climb', start: 0, end: 3, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'sit',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-sit', start: 0, end: 8, zeroPad: 4 }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: 'stand',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-sit', start: 8, end: 0, zeroPad: 4 }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: 'button',
      frames: this.anims.generateFrameNames('player', { prefix: 'astronaut-button', start: 0, end: 14, zeroPad: 4 }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: 'rocket_starting',
      frames: this.anims.generateFrameNames('player', { prefix: 'rocket', start: 0, end: 1, zeroPad: 4 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: 'rocket_going',
      frames: this.anims.generateFrameNames('player', { prefix: 'rocket', start: 0, end: 1, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'rocks',
      frames: this.anims.generateFrameNames('player', { prefix: 'rocks', start: 0, end: 21, zeroPad: 4 }),
      frameRate: 6,
      repeat: 0,
    });
    this.anims.create({
      key: 'fuel-tank',
      frames: this.anims.generateFrameNames('player', { prefix: 'fuel-tank', start: 0, end: 2, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'button-active',
      frames: this.anims.generateFrameNames('player', { prefix: 'button', start: 0, end: 1, zeroPad: 4 }),
      frameRate: 3,
      repeat: 0,
      delay: 350,
      yoyo: true,
    });

    ParticleController.addEmitter('rocket_smoke_1', {
      frame: 'rocket_particle_big',
      angle: { min: 180, max: 360 },
      speed: { min: 10, max: 20 },
      gravityY: 100,
      lifespan: 600,
      quantity: 8,
      scale: 4,
      maxParticles: 0,
      frequency: 500,
    });
    ParticleController.addEmitter('rocket_smoke_2', {
      frame: 'walking_particle',
      angle: { min: 180, max: 360 },
      speed: { min: 10, max: 20 },
      gravityY: 100,
      lifespan: 600,
      quantity: 8,
      scale: 4,
      maxParticles: 0,
      frequency: 500,
    });
    ParticleController.addEmitter('walking', {
      frame: 'walking_particle',
      angle: { min: 180, max: 360 },
      speed: { min: 30, max: 50 },
      gravityY: 100,
      lifespan: 600,
      quantity: 8,
      scale: 4,
      maxParticles: 0,
      frequency: 490,
    });
    ParticleController.addEmitter('crawling', {
      frame: 'walking_particle',
      angle: { min: 180, max: 360 },
      speed: { min: 30, max: 50 },
      gravityY: 100,
      lifespan: 600,
      quantity: 8,
      scale: 4,
      maxParticles: 0,
      frequency: 250,
    });
    ParticleController.addEmitter('jumping', {
      frame: 'walking_particle',
      angle: { min: 180, max: 360 },
      speed: { min: 40, max: 80 },
      gravityY: 100,
      lifespan: 600,
      quantity: 8,
      scale: 4,
      maxParticles: 0,
      frequency: 9999,
    });
    const geom = new Phaser.Geom.Rectangle(0, 0, this.gameWidth * 4, this.gameHeight * 4);
    ParticleController.addEmitter('falling_stars', {
      frame: 'star_particle',
      angle: 45,
      speed: { min: 400, max: 600 },
      alpha: { start: 1, end: 1 },
      lifespan: 5000,
      quantity: 8,
      scale: 3,
      maxParticles: 0,
      frequency: 2500,
      emitZone: {
        type: 'random',
        source: geom,
      },
    });

    AudioManager.addSound('activate', ActivateMp3, {
      loop: false,
      volume: 0.5,
    });
    AudioManager.addSound('deactivate', DeactivateMp3, {
      loop: false,
      volume: 0.5,
    });
    AudioManager.addSound('rocket_nofuel', RocketNoFuelMp3);
    AudioManager.addSound('player_walk', WalkMp3, {
      loop: true,
      volume: 0.15,
    });
    AudioManager.addSound('player_crawl', CrawlMp3, {
      loop: true,
      volume: 0.15,
    });
    AudioManager.addSound('player_jump', JumpMp3, {
      loop: false,
      volume: 0.15,
    });
    AudioManager.addSound('music_1', Music1Mp3, {
      loop: true,
      volume: 0.75,
    });
    AudioManager.addSound('music_2', Music2Mp3, {
      loop: true,
      volume: 0.75,
    });
    AudioManager.addSound('music_3', Music3Mp3, {
      loop: false,
      volume: 0.75,
    });
  }
}
