import { CutsceneAction } from './CutsceneAction';
import { Player } from '../../sprites/Player';

export class MovePlayerAction extends CutsceneAction {
  private player!: Player;
  private yMovement: number = 0;

  constructor (scene: Phaser.Scene, data: any) {
    super(scene);
    this.player = data.obj;
    this.yMovement = data.y;
  }

  public do (): Promise<void> {
    return new Promise(resolve => {
      this.player.getSprite().setVelocityY(this.yMovement);
      resolve();
    });
  }
}
