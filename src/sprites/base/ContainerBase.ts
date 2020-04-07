import { SceneBase } from '../../scenes/base/SceneBase.ts';

/**
 * A base class to use containers in this game.
 *
 * @extends Phaser.GameObjects.Container
 */
export class ContainerBase extends Phaser.GameObjects.Container {
  /**
   * Creates a container game object and adds it to the scene.
   *
   * @param scene The scene.
   */
  constructor(scene: SceneBase) {
    super(scene);
    scene.add.existing(this);
  }
}
