import { CutsceneAction } from './CutsceneAction';
import { Player } from '../../sprites/Player';
import { ActionFactory } from './ActionFactory';
import { Ladder } from '../../sprites/Ladder';

export class ClimbLadder extends CutsceneAction {
  private player!: Player;
  private ladder!: Ladder;
  private resolve!: () => void;
  private isClimbing: boolean = false;

  private g: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, data: any) {
    super(scene);
    this.player = data.player;
    this.ladder = data.ladder;
  }

  public do(): Promise<void> {
    return new Promise(async (resolve) => {
      // walk to ladder.
      let action = ActionFactory.create(this.scene, 'playerRunTo', { player: this.player, xTarget: this.ladder.x });
      await action.do();

      this.g = this.scene.add.graphics();
      this.g.fillStyle(0xffffff, 1);
      this.g.setDepth(999);

      this.isClimbing = true;
      this.resolve = resolve;
    });
  }

  public preUpdate() {
    if (this.isClimbing) {
      this.player.climb();

      if (this.player.getSprite().y + 32 < this.ladder.y - (this.ladder.displayHeight / 2) + 62) {
        this.player.stopClimb();
        this.isClimbing = false;
      }
    } else if (this.resolve) {
      this.resolve();
    }
  }
}
