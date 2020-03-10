import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';

import { SceneBase } from "./SceneBase";
import { Player } from "../sprites/Player";
import { FollowCamera } from "../cameras/FollowCamera";

import { MarkerController } from "../controllers/MarkerController";
import { TextPlate } from '../sprites/TextPlate';
import { CutsceneController } from '../controllers/CutsceneController';

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
    // Phaser 3 plugins.
    this.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  public create() {
    this.setupTransitionEvents();

    // Make map for scene out of tiles.
    this.map = this.make.tilemap({key: 'map'});

    // Space.
    let spaceBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'space-bg');
    spaceBg.setScale(1);
    spaceBg.setScrollFactor(0.1);

    // Small stars.
    let smallStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'small-stars-bg');
    smallStarsBg.setScale(1);
    smallStarsBg.setScrollFactor(0.125);

    // Big stars.
    let bigStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, this.map.heightInPixels * 2, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'big-stars-bg');
    bigStarsBg.setScale(1);
    bigStarsBg.setScrollFactor(0.15);

    // Mountains.
    let mountainsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, (this.map.heightInPixels * 2) + this.gameHeight / 2.6, this.map.widthInPixels * 4, this.map.heightInPixels * 4, 'mountains-bg');
    mountainsBg.setScale(1);
    mountainsBg.setScrollFactor(0.2, 0.9);

    // Load spritesheet for tilemap.
    let tilesheet:Phaser.Tilemaps.Tileset = this.map.addTilesetImage('Tiles', 'tilesheet', 16, 16, 0, 0);

    let background:Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('background', tilesheet, 0, 0);
    background.setScale(4, 4);

    // Make the player object.
    this.player = new Player(this, ground);

    // Display the tiles on the 'ground' tile layer.
    let ground:Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('ground', tilesheet, 0, 0);
    ground.setScale(4, 4);

    let foreground:Phaser.Tilemaps.DynamicTilemapLayer = this.map.createDynamicLayer('foreground', tilesheet, 0, 0);
    foreground.setScale(4, 4);

    this.sys.animatedTiles.init(this.map);

    // All tiles in this layer have collision.
    ground.setCollisionByExclusion([ -1, 0 ]);
    this.matter.world.convertTilemapLayer(ground);

    // Set the boundaries of our game world
    this.matter.world.setBounds(0, 0, ground.displayWidth, ground.displayHeight);

    // Tilemap markers.
    let markerController = new MarkerController(this, this.player);
    const markers = this.map.getObjectLayer('markers')['objects'];
    markers.forEach(marker => {
      let props = marker.properties;
      let message = '';
      props.forEach((prop:any) => {
        if (prop.name = 'message') {
          message = prop.value;
        }
      })

      markerController.addMarker((marker.x * 4) + 32, (marker.y * 4) - 64, (done:any) => {
        let plate = new TextPlate(this, message);
        plate.openPlate();
        plate.setOnClose(done);
      });
    });


    // Create a new main camera that we can control.
    this.camera = new FollowCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);
    this.cameras.main.fadeIn(400);

    // Small craters.
    let cratersSmallFg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, (this.map.heightInPixels * 2) + this.gameHeight * 1.1, this.map.widthInPixels * 12, this.map.heightInPixels * 4, 'craters-small-fg');
    cratersSmallFg.setScale(1);
    cratersSmallFg.setScrollFactor(1.4, 1.15);

    // Craters.
    let cratersFg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.map.widthInPixels * 2, (this.map.heightInPixels * 2) + this.gameHeight * 1.25, this.map.widthInPixels * 12, this.map.heightInPixels * 4, 'craters-fg');
    cratersFg.setScale(1);
    cratersFg.setScrollFactor(1.8, 1.2);

    // Start a cutscene.
    this.time.delayedCall(1000, () => {
      // How is a cutscene gonna work you ask? WELL:
      // 1. Create a controller object.
      let cutscene = new CutsceneController(this);

      // 2. Add a bunch of actions for it to queue up.
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('movePlayer', { obj: this.player, y: -7 });
      cutscene.addAction('wait', { duration: 1000 });

      // 3. When you're ready, start it and watch the
      //    actions play out!
      cutscene.play();

    })
  }

  public update() {
    // All this stuff should be delegated to other classes.
  }
}
