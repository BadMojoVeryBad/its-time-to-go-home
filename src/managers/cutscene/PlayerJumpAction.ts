import { Player } from '../../sprites/Player';
import { CutsceneAction } from './CutsceneAction';

export class PlayerJumpAction extends CutsceneAction {
  private player!: Player;
  private direction: string = 'up';

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.player = data.player;
    this.direction = data.direction;
  }

  public do(): Promise<void> {
    return new Promise((resolve) => {
      this.player.jump();
      resolve();
    });
  }
}
