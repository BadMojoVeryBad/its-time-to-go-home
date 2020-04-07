// @ts-nocheck
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

/**
 * Makes animated tiles from Tiled work.
 */
export class AnimatedTilesManager {
  private scene: Phaser.Scene;

  /**
   * Makes animated tiles from Tiled work.
   *
   * To start the animated tiles:
   * ```
   * const animatedTilesmanager = new AnimatedTilesManager();
   * animatedTilesmanager.init(tileMap);
   * ```
   *
   * @param scene The scene to create this manager in.
   */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.scene.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  public init(map: Phaser.Tilemaps.Tilemap) {
    this.scene.sys.animatedTiles.init(map);
  }
}
