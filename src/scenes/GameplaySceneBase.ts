import { AnimatedTilesController } from '../controllers/AnimatedTilesController';
import { MarkerController } from '../controllers/MarkerController';
import { GameplayEvent } from '../sprites/GameplayEvent';
import { Player } from '../sprites/Player';
import { TileSprite } from '../sprites/TileSprite';
import { CONST } from '../util/CONST';
import { TiledUtils } from '../util/TiledUtils';
import { SceneBase } from './SceneBase';

export abstract class GameplaySceneBase extends SceneBase {
  public map!: Phaser.Tilemaps.Tilemap;
  protected tilesheet!: Phaser.Tilemaps.Tileset;
  protected mapLayers: any = {};
  protected markerController!: MarkerController;
  private animatedTilesController!: AnimatedTilesController;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public preload() {
    this.animatedTilesController = new AnimatedTilesController(this);
    this.markerController = new MarkerController(this);

    if (CONST.DEBUG) {
      this.setupDebug();
    }
  }

  public create() {
    // ...
  }

  public update () {
    // ...
  }

  protected changeScene(scene: string, duration: number = 600) {
    this.inputController.disableAllControls();
    super.changeScene(scene, duration);
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
      const m = this.markerController.addMarkerWithTextPlate((marker.x * CONST.SCALE) + 32, (marker.y * CONST.SCALE) - 64, message, event);
      m.setMarkerId(marker.id);
    });
  }

  public setupEvents() {
    const events = this.map.getObjectLayer('events').objects;
    events.forEach((event: Phaser.Types.Tilemaps.TiledObject) => {
      const w = event.width * CONST.SCALE;
      const h = event.height * CONST.SCALE;
      const x = (event.x * CONST.SCALE) + (w * CONST.HALF);
      const y = (event.y * CONST.SCALE) - (h * CONST.HALF);
      new GameplayEvent(this, x, y, w, h, TiledUtils.getProperty(event, 'event'));
    });
  }
}
