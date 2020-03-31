import { AnimatedTilesController } from '../controllers/AnimatedTilesController';
import { CutsceneController } from '../controllers/CutsceneController';
import { MarkerController } from '../controllers/MarkerController';
import { GameplayEvent } from '../sprites/GameplayEvent';
import { Player } from '../sprites/Player';
import { TileSprite } from '../sprites/TileSprite';
import { CONST } from '../util/CONST';
import { TiledUtils } from '../util/TiledUtils';
import { SceneBase } from './SceneBase';
import { ParticleController } from '../controllers/ParticleController';
import { Ladder } from '../sprites/Ladder';

export abstract class GameplaySceneBase extends SceneBase {
  public map!: Phaser.Tilemaps.Tilemap;
  protected tilesheet!: Phaser.Tilemaps.Tileset;
  protected mapLayers: any = {};
  protected markerController!: MarkerController;
  protected player!: Player;
  private animatedTilesController!: AnimatedTilesController;
  private sceneData: {} = {};
  private particleController!: ParticleController;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public init(data: {}) {
    this.sceneData = data;
  }

  public preload() {
    this.animatedTilesController = new AnimatedTilesController(this);
    this.markerController = new MarkerController(this);
    this.particleController = new ParticleController(this);

    if (CONST.DEBUG) {
      this.setupDebug();
    }
  }

  public create() {
    super.create();

    // Make the player object.
    this.setupInputs();
    this.player = new Player(this);
    if (this.sceneData.playerX) {
      const startX = (this.sceneData.playerDir === 'left') ? -64 : 64;
      this.player.setPlayerPosition(this.sceneData.playerX, this.sceneData.playerY);
      this.player.setPlayerDirection(this.sceneData.playerDir);
      const cutscene = new CutsceneController(this);
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: this.sceneData.playerX + startX });
      cutscene.play();
    }

    // Falling stars.
    this.particleController.createParticleEmitter('falling_stars', [ 'falling_stars' ], 31);
    this.particleController.start('falling_stars');
  }

  public update() {
    // console.log(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
  }

  public setupTiles(map: string = 'map') {
    this.map = this.make.tilemap({key: map});
    this.tilesheet = this.map.addTilesetImage('Tiles', 'tilesheet', 16, 16, 0, 0);
    for (let i = 0; i < this.map.layers.length; i++) {
      const layer = this.map.layers[i];
      this.mapLayers[layer.name] = this.map.createDynamicLayer(layer.name, this.tilesheet, CONST.ZERO, CONST.ZERO);
      this.mapLayers[layer.name].setDepth(TiledUtils.getProperty(layer, 'depth')).setScale(CONST.SCALE);

      if (TiledUtils.getProperty(layer, 'collide')) {
        this.mapLayers[layer.name].setCollisionByExclusion([ -1, 0 ]);
        this.matter.world.convertTilemapLayer(this.mapLayers[layer.name]);
      }
    }

    // Set world bounds and start animated tiles.
    this.matter.world.setBounds(CONST.ZERO, CONST.ZERO, this.map.widthInPixels * CONST.SCALE, this.map.heightInPixels * CONST.SCALE);
    this.animatedTilesController.init(this.map);
  }

  public setupImages() {
    for (let i = 0; i < this.map.images.length; i++) {
      const layer = this.map.images[i];

      const tileSprite = new TileSprite(this, layer.x, layer.y, this.map.widthInPixels * CONST.SCALE, this.map.widthInPixels * CONST.SCALE, layer.name, undefined);
      tileSprite.setDepth(TiledUtils.getProperty(layer, 'depth'))
        .setScale(CONST.SCALE)
        .setScrollFactor(TiledUtils.getProperty(layer, 'parallaxX'), TiledUtils.getProperty(layer, 'parallaxY'));

      if (!TiledUtils.getProperty(layer, 'repeatY')) {
        tileSprite.dontRepeatY();
      }

      if (!TiledUtils.getProperty(layer, 'repeatX')) {
        tileSprite.dontRepeatX();
      }

      this.mapLayers[layer.name] = tileSprite;
    }
  }

  public setupMarkers() {
    const markers = this.map.getObjectLayer('markers').objects;
    markers.forEach((marker: Phaser.Types.Tilemaps.TiledObject) => {
      const message = TiledUtils.getProperty(marker, 'message');
      const event = TiledUtils.getProperty(marker, 'event');
      const disabled = TiledUtils.getProperty(marker, 'disabled');
      const m = this.markerController.addMarkerWithTextPlate((marker.x * CONST.SCALE) + 32, (marker.y * CONST.SCALE) - 64, message, event);
      m.setMarkerId(marker.id);
      m.setEnabled(!disabled);
    });
  }

  public setupEvents() {
    this.time.delayedCall(600, () => {
      const events = this.map.getObjectLayer('events').objects;
      events.forEach((event: Phaser.Types.Tilemaps.TiledObject) => {
        const w = event.width * CONST.SCALE;
        const h = event.height * CONST.SCALE;
        const x = (event.x * CONST.SCALE) + (w * CONST.HALF);
        const y = (event.y * CONST.SCALE) - (h * CONST.HALF);
        new GameplayEvent(this, x, y, w, h, TiledUtils.getProperty(event, 'event'));
      });
    });
  }

  public setupLadders() {
    const ladders = this.map.getObjectLayer('ladders').objects;
    ladders.forEach((ladder: Phaser.Types.Tilemaps.TiledObject) => {
      const w = ladder.width * CONST.SCALE;
      const h = ladder.height * CONST.SCALE;
      const x = (ladder.x * CONST.SCALE) + (w * CONST.HALF);
      const y = (ladder.y * CONST.SCALE) - (h * CONST.HALF);
      let sprite = new Ladder(this, x, y, 'player', 'ladder');
      sprite.setDepth(51);
      sprite.setScale(CONST.SCALE);
    });
  }

  protected changeScene(scene: string, duration: number = 600, data: {} = {}) {
    this.inputController.disableAllControls();
    super.changeScene(scene, duration, data);
  }
}
