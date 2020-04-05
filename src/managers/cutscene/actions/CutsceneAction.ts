import { SceneBase } from '../../../scenes/SceneBase';

/**
 * A Phaser game container that holds an action a cutscene can run.
 * The action can be modified by overriding the `do()` function.
 */
export abstract class CutsceneAction extends Phaser.GameObjects.Container {
  constructor(scene: SceneBase) {
    super(scene);
    scene.sys.updateList.add(this);
  }

  /**
   * Stub.
   */
  public do(): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  public preUpdate() {
    // ...
  }
}
