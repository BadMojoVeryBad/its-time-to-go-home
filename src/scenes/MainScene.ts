import 'phaser';

import { SceneBase } from "./SceneBase";
import { Player } from "../sprites/Player";
import { FollowCamera } from "../cameras/FollowCamera";

import coinGoldPng from '../assets/coinGold.png';
import tilesPng from '../assets/tiles.png';
import playerPng from '../assets/player.png';

import mapJson from '../assets/map.json';
import playerJson from '../assets/player.json';

export class MainScene extends SceneBase {
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Player;
  private coinLayer!: Phaser.Tilemaps.DynamicTilemapLayer;
  private score:integer = 0;
  private text!:Phaser.GameObjects.Text;
  private camera!: FollowCamera;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', mapJson);
    // tiles in spritesheet 
    this.load.spritesheet('tiles', tilesPng, {frameWidth: 70, frameHeight: 70});
    // simple coin image
    this.load.image('coin', coinGoldPng);
    // player animations
    this.load.atlas('player', playerPng, playerJson);
  }

  public create() {
    // Make map for scene out of tiles.
    this.map = this.make.tilemap({key: 'map'});

    // Set the background color because sometimes the camera background is glitchy.
    this.add.rectangle(this.map.widthInPixels / 2, this.map.heightInPixels / 2, this.map.widthInPixels, this.map.heightInPixels, 0xccccff);

    // Load spritesheet for tilemap.
    let groundTiles:Phaser.Tilemaps.Tileset = this.map.addTilesetImage('tiles');

    // Display the tiles on the 'World' tile layer.
    let groundLayer:Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);

    // All tiles in this layer have collision.
    groundLayer.setCollisionByExclusion([-1]);







    // Load image used for coin layer in tilemap.
    let coinTiles:Phaser.Tilemaps.Tileset = this.map.addTilesetImage('coin');

    // Display the tiles on the 'Coins' tile layer.
    this.coinLayer = this.map.createDynamicLayer('Coins', coinTiles, 0, 0);

    // What to do when the coins collide with something. In this case, the player.
    this.coinLayer.setTileIndexCallback(17, this.collectCoin, this); 

    // Set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // Make the player object.
    this.player = new Player(this, groundLayer, this.coinLayer);

    // Create a new main camera that we can control.
    this.cameras.remove(this.cameras.main);
    this.camera = new FollowCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);
    this.cameras.addExisting(this.camera, true);

    // Set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Basic HUD.
    this.text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    this.text.setScrollFactor(0);
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
