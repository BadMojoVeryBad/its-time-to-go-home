import { CutsceneAction } from './CutsceneAction';
import { GameplaySceneBase } from '../../scenes/GameplaySceneBase';

export class FadeInLayerAction extends CutsceneAction {
  private key: string = '';
  private duration: number = 0;
  private wait = true;
  protected scene!: GameplaySceneBase;

  constructor(scene: GameplaySceneBase, data: any) {
    super(scene);
    this.key = data.key;
    this.duration = data.duration;

    if (data.wait !== undefined) {
      this.wait = data.wait;
    }
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {

      const layer: any = this.scene.mapLayers[this.key];

      this.scene.tweens.add({
        targets: [ layer ],
        alpha: { from: 0, to: 1 },
        duration: this.duration,
        repeat: 0,
        onComplete: () => {
          if (this.wait) {
            resolve();
          }
        },
      });

      if (!this.wait) {
        resolve();
      }
    });
  }
}
