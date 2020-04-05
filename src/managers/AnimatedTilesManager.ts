// @ts-nocheck
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

export class AnimatedTilesManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.scene.load.scenePlugin('animatedTiles', AnimatedTiles, 'animatedTiles', 'animatedTiles');
  }

  public init(map: Phaser.Tilemaps.Tilemap) {
    this.scene.sys.animatedTiles.init(map);
  }
}
