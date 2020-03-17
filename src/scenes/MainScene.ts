import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import { InputController } from '../controllers/InputController';

import { FollowCamera } from '../cameras/FollowCamera';
import { Player } from '../sprites/Player';
import { SceneBase } from './SceneBase';

import { CutsceneController } from '../controllers/CutsceneController';
import { MarkerController } from '../controllers/MarkerController';
import { TextPlate } from '../sprites/TextPlate';

export class MainScene extends SceneBase {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Player;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    // Phaser 3 plugins.
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  public create() {
    this.setupTransitionEvents();
    this.setupInputs();

    // Make map for scene out of tiles.
    this.map = this.make.tilemap({key: 'map'});

    // Space.
    const spaceBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'space-bg');
    spaceBg.setScale(1);
    spaceBg.setScrollFactor(0.1);

    // Small stars.
    const smallStarsBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'small-stars-bg');
    smallStarsBg.setScale(1);
    smallStarsBg.setScrollFactor(0.125);

    // Big stars.
    const bigStarsBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'big-stars-bg');
    bigStarsBg.setScale(1);
    bigStarsBg.setScrollFactor(0.15);

    // Earth.
    this.anims.create({
      key: 'earth',
      frames: this.anims.generateFrameNames('player', { prefix: 'earth', start: 0, end: 26, zeroPad: 4 }),
      frameRate: 6,
      repeat: -1,
    });
    const earth: Phaser.GameObjects.Sprite = this.add.sprite(150, 650, 'player');
    earth.setOrigin(0.5, 0.5);
    earth.setPosition(150 + 550, 600 + 300);
    earth.play('earth');
    earth.setScale(4);


    // Mountains.
    const mountainsBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, 1690, this.map.widthInPixels * 4, this.gameHeight, 'mountains-bg');
    mountainsBg.setScale(1);
    mountainsBg.setScrollFactor(0.2, 0.9);

    // Load spritesheet for tilemap.
    const tilesheet: Phaser.Tilemaps.Tileset = this.map.addTilesetImage('Tiles', 'tilesheet', 16, 16, 0, 0);

    const background: Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('background', tilesheet, 0, 0);
    background.setScale(4, 4);

    // Make the player object.
    this.player = new Player(this);

    // pre background
    const prebackground: Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('prebackground', tilesheet, 0, 0);
    prebackground.setScale(4, 4);

    // Display the tiles on the 'ground' tile layer.
    const ground: Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('ground', tilesheet, 0, 0);
    ground.setScale(4, 4);

    const foreground: Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('foreground', tilesheet, 0, 0);
    foreground.setScale(4, 4);

    this.sys.animatedTiles.init(this.map);

    // All tiles in this layer have collision.
    ground.setCollisionByExclusion([ -1, 0 ]);
    this.matter.world.convertTilemapLayer(ground);

    // Set the boundaries of our game world
    this.matter.world.setBounds(0, 0, ground.displayWidth, ground.displayHeight);

    // Tilemap markers.
    const markerController = new MarkerController(this, this.player);
    const markers = this.map.getObjectLayer('markers').objects;
    markers.forEach((marker) => {
      const props = marker.properties;
      let message = '';
      props.forEach((prop: any) => {
        if (prop.name === 'message') {
          message = prop.value;
        }
      });

      markerController.addMarker((marker.x * 4) + 32, (marker.y * 4) - 64, (done: any) => {
        const plate = new TextPlate(this, message);
        plate.openPlate();
        plate.setOnClose(done);
      });
    });

    // Create a new main camera that we can control.
    this.camera = new FollowCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.scrollX = 150;
    this.cameras.main.scrollY = 600;

    // Small craters.
    const cratersSmallFg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, 2440, this.map.widthInPixels * 12, this.gameHeight, 'craters-small-fg');
    cratersSmallFg.setScale(1);
    cratersSmallFg.setScrollFactor(1.4, 1.15);

    // Craters.
    const cratersFg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, 2600, this.map.widthInPixels * 12, this.gameHeight, 'craters-fg');
    cratersFg.setScale(1);
    cratersFg.setScrollFactor(1.8, 1.2);

    // Start a cutscene.
    const cutscene = new CutsceneController(this);
    cutscene.addAction('wait', { duration: 1600 });
    cutscene.addAction('drawText', { text: 'It\'s Time', x: 150 + 200, y: 600 + 240 });
    cutscene.addAction('drawText', { text: 'To Go', x: 150 + 200, y: 600 + 280 });
    cutscene.addAction('drawText', { text: 'Home.', x: 150 + 200, y: 600 + 320 });
    cutscene.addAction('wait', { duration: 3200 });
    cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 3200 });
    cutscene.addAction('wait', { duration: 1600 });
    cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 691 });
    cutscene.addAction('setDepth',  { object: prebackground, depth: -1 });
    cutscene.addAction('wait', { duration: 400 });
    cutscene.addAction('playerRunTo', { player: this.player, xTarget: 291 });
    cutscene.addAction('wait', { duration: 1000 });
    cutscene.play();
  }

  public update() {
    // All this stuff should be delegated to other classes.
  }
}

