export abstract class CutsceneAction extends Phaser.GameObjects.Container {
  constructor (scene: Phaser.Scene) {
    super(scene);
    scene.sys.updateList.add(this);
  }

  /**
   * Stub.
   */
  public do (): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }

  public preUpdate () {

  }
}
