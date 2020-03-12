import { CutsceneAction } from './CutsceneAction';
import { Player } from '../../sprites/Player';

export class PlayerRunToAction extends CutsceneAction {
  private player!: Player;
  private xTarget: number = 0;
  private resolve!: any;
  private direction: string = 'none';

  constructor (scene: Phaser.Scene, data: any) {
    super(scene);
    this.player = data.player;
    this.xTarget = data.xTarget;
  }

  public do (): Promise<void> {
    return new Promise(resolve => {
      // Find direction.
      this.direction = (this.player.getSprite().x < this.xTarget) ? 'right' : 'left';

      // Save resolution for later.
      this.resolve = resolve;
    });
  }

  public preUpdate () {
    if (this.direction === 'none') {
      return;
    }

    // Move.
    if (this.direction === 'right') {
      this.player.moveRight();
    } else {
      this.player.moveLeft();
    }


    // If we hit the target, stop moving.
    if ((this.direction === 'right' && this.xTarget < this.player.getSprite().x) ||
    (this.direction === 'left' && this.xTarget > this.player.getSprite().x)) {
      this.resolve();
      this.direction = 'none';
    }
  }
}
