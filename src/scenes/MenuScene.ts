import { SceneBase } from "./SceneBase";
import { Control } from "../controllers/InputController";

export class MenuScene extends SceneBase {
  constructor () {
    super({
      key: 'MenuScene'
    })
  }

  create () {
    this.setupTransitionEvents();
    this.setupInputs();

    let spaceBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'space-bg');
    spaceBg.setScale(1);
    spaceBg.setScrollFactor(0.1);

    let smallStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'small-stars-bg');
    smallStarsBg.setScale(1);
    smallStarsBg.setScrollFactor(0.125);

    let bigStarsBg:Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'big-stars-bg');
    bigStarsBg.setScale(1);
    bigStarsBg.setScrollFactor(0.15);

    let text = this.add.bitmapText(this.gameWidth / 2, this.gameHeight / 2, 'font', 'Press ' + this.inputController.getControlString(Control.Activate) + ' to start.');
    text.setOrigin(0.5, 0.5);
    text.setScale(0.5);
    text.setScrollFactor(0);

    this.inputController.onPress(Control.Activate, () => {
      this.cameras.main.fadeOut(600, 0, 0, 0, (camera:any, progress:number) => {
        if (progress === 1) {
          this.scene.start('MainScene', {});
        }
      });
    });
  }


  update () {
    if (this.cameras.main.scrollX > this.gameWidth * 4) {
      this.data.set('camera_direction', 'left');
    }

    if (this.cameras.main.scrollX < 0) {
      this.data.set('camera_direction', 'right');
    }

    if (this.data.get('camera_direction') === 'left') {
      this.cameras.main.scrollX--;
    } else {
      this.cameras.main.scrollX++;
    }
  }

}
