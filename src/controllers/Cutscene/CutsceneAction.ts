export abstract class CutsceneAction extends Phaser.GameObjects.Container {
  constructor (scene: Phaser.Scene) {
    super(scene);
  }

  /**
   * Stub.
   */
  public do (): Promise<void> {
    return new Promise(resolve => {
      resolve();
    });
  }
}
