import 'phaser';

import { SceneBase } from "./SceneBase";
import { Player } from "../sprites/Player";
import { FollowCamera } from "../cameras/FollowCamera";

import { MarkerController } from "../controllers/MarkerController";

import coinGoldPng from '../assets/coinGold.png';
import tilesPng from '../assets/tiles.png';
import playerPng from '../assets/ttgh-spritesheet.png';

import tilesheetPng from '../assets/tilesheet.png';
import spaceBgPng from '../assets/space-bg.png';
import bigStarsBgPng from '../assets/big-stars-bg.png';
import smallStarsBgPng from '../assets/small-stars-bg.png';
import mountainsBgPng from '../assets/mountains-bg.png';
import cratersFgPng from '../assets/craters-fg.png';
import cratersSmallFgPng from '../assets/craters-small-fg.png';
import homePng from '../assets/home.png';

import fontFnt from '../assets/font.fnt';
import fontPng from '../assets/font.png';

import mapJson from '../assets/test-level.json';
import playerJson from '../assets/ttgh-spritesheet.xml';
import { TextPlate } from '../sprites/TextPlate';
import { moveSyntheticComments } from '../../node_modules/typescript/lib/typescript';

export class MainScene extends SceneBase {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Player;
  private coinLayer!: Phaser.Tilemaps.DynamicTilemapLayer;
  private score:integer = 0;
  private text!:Phaser.GameObjects.Text;
  private camera!: FollowCamera;
  private plate!: TextPlate;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    // map made with Tiled in JSON format
    // this.load.tilemapTiledJSON('map', mapJson);
    // tiles in spritesheet
    this.load.spritesheet('tiles', tilesPng, {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', coinGoldPng);
    // player animations
    this.load.atlasXML('player', playerPng, playerJson);

    // Images.
    this.load.image('space-bg', spaceBgPng);
    this.load.image('big-stars-bg', bigStarsBgPng);
    this.load.image('small-stars-bg', smallStarsBgPng);
    this.load.image('mountains-bg', mountainsBgPng);
    this.load.image('craters-fg', cratersFgPng);
    this.load.image('craters-small-fg', cratersSmallFgPng);
    this.load.image('home', homePng);

    this.load.bitmapFont('font', fontPng, fontFnt);

    // Level map.
    this.load.tilemapTiledJSON('map', mapJson);
    this.load.spritesheet('tilesheet', tilesheetPng, {frameWidth: 64, frameHeight: 64});
  }

  public create() {
    // Make map for scene out of tiles.
    this.map = this.make.tilemap({key: 'map'});

    // Space.
    let spaceBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, this.map.widthInPixels, this.map.heightInPixels, 'space-bg');
    spaceBg.setScale(1);
    spaceBg.setScrollFactor(0.1);

    // Small stars.
    let smallStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, this.map.widthInPixels, this.map.heightInPixels, 'small-stars-bg');
    smallStarsBg.setScale(1);
    smallStarsBg.setScrollFactor(0.125);

    // Big stars.
    let bigStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, this.map.heightInPixels / 2, this.map.widthInPixels, this.map.heightInPixels, 'big-stars-bg');
    bigStarsBg.setScale(1);
    bigStarsBg.setScrollFactor(0.15);

    // Mountains.
    let mountainsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, (this.map.heightInPixels / 2) + this.gameHeight / 2.4, this.map.widthInPixels, this.map.heightInPixels, 'mountains-bg');
    mountainsBg.setScale(1);
    mountainsBg.setScrollFactor(0.2, 0.9);

    // Load spritesheet for tilemap.
    let tilesheet:Phaser.Tilemaps.Tileset = this.map.addTilesetImage('tilesheet', 'tilesheet', 64, 64, 1, 2);

    // Map objects.
    const mapObjects = this.map.getObjectLayer('home')['objects'];
    mapObjects.forEach(mapObject => {
      this.add.image(mapObject.x, mapObject.y - 128, 'home');
    });

    // Make the player object.
    this.player = new Player(this, ground);

    // Display the tiles on the 'ground' tile layer.
    let ground:Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('ground', tilesheet, 0, 0);
    ground.setScale(1, 1);

    // All tiles in this layer have collision.
    ground.setCollisionByExclusion([ -1, 0 ]);

    this.matter.world.convertTilemapLayer(ground);

    // Set the boundaries of our game world
    this.matter.world.setBounds(ground.width, ground.height);

    // Info thing.
    let markerController = new MarkerController(this, this.player);
    markerController.addMarker(150, 580, () => {
      let plate = new TextPlate(this, 'There\'s not much to this\ngame at the moment.');
      plate.openPlate();
    });
    markerController.addMarker(480, 540, () => {
      let plate = new TextPlate(this, 'This isn\'t your home.\nYour home is Earth.');
      plate.openPlate();
    });

    // Create a new main camera that we can control.
    this.camera = new FollowCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);

    // Small craters.
    let cratersSmallFg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, (this.map.heightInPixels / 2) + this.gameHeight * 1.1, this.map.widthInPixels * 2, this.map.heightInPixels, 'craters-small-fg');
    cratersSmallFg.setScale(1);
    cratersSmallFg.setScrollFactor(1.4, 1.15);

    // Craters.
    let cratersFg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels / 2, (this.map.heightInPixels / 2) + this.gameHeight * 1.25, this.map.widthInPixels * 2, this.map.heightInPixels, 'craters-fg');
    cratersFg.setScale(1);
    cratersFg.setScrollFactor(1.8, 1.2);

    // Basic HUD.

    // Text plate.

  }

  public update() {
    // Update objects.
    this.player.updatePlayer();
    this.camera.updateCamera();
  }

  public collectCoin(sprite: any, tile: any) {
    this.coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    this.score ++; // increment the score
    this.text.setText(this.score.toString()); // set the text to show the current score
    return false;
  }
}
