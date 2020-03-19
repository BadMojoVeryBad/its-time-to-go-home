import { TiledUtils } from "../util/TiledUtils";
import { CONST } from "../util/CONST";
import { AnimatedTilesController } from "../controllers/AnimatedTilesController";
import { TileSprite } from "../sprites/TileSprite";
import { SceneBase } from "./SceneBase";

export abstract class GameplaySceneBase extends SceneBase {
  protected map!: Phaser.Tilemaps.Tilemap;
  protected tilesheet!: Phaser.Tilemaps.Tileset;
  protected mapLayers: any = {};
  private animatedTilesController!: AnimatedTilesController;

  constructor(config: Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public preload () {
    this.animatedTilesController = new AnimatedTilesController(this);
  }

  public create () {
    // ...
  }

  public setupTiles () {
    this.map = this.make.tilemap({key: 'map'});
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

  public setupImages () {
    for (let i = 0; i < this.map.images.length; i++) {
      const layer = this.map.images[i];

      let tileSprite = new TileSprite(this, layer.x, layer.y, this.map.widthInPixels * CONST.SCALE, this.map.widthInPixels * CONST.SCALE, layer.name, undefined);
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
}
