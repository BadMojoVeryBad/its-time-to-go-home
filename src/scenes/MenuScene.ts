import { Control } from '../controllers/InputController';
import { SoundController } from '../controllers/SoundController';
import { CONST } from '../util/CONST';
import { SceneBase } from './SceneBase';

export class MenuScene extends SceneBase {
  constructor() {
    super({
      key: 'MenuScene',
    });
  }

  public preload() {

  }

  public create() {
    this.setupTransitionEvents();
    this.setupInputs();

    const spaceBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'stars1');
    spaceBg.setScale(CONST.SCALE);
    spaceBg.setScrollFactor(0.1);

    const smallStarsBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'stars2');
    smallStarsBg.setScale(CONST.SCALE);
    smallStarsBg.setScrollFactor(0.125);

    const bigStarsBg: Phaser.GameObjects.TileSprite = this.add.tileSprite(this.gameWidth / 2, this.gameHeight / 2, this.gameWidth * 4, this.gameHeight, 'stars3');
    bigStarsBg.setScale(CONST.SCALE);
    bigStarsBg.setScrollFactor(0.15);

    const text = this.add.bitmapText(this.gameWidth * CONST.HALF, this.gameHeight * CONST.HALF, 'font', 'Press ' + this.inputController.getControlString(Control.Activate) + ' to start.');
    text.setOrigin(1, 1);
    text.setScale(0.5);
    text.setScrollFactor(0);

    this.inputController.onPress(Control.Activate, () => {
      SoundController.getSound('audio_activate').play();
      this.cameras.main.fadeOut(600, 0, 0, 0, (camera: any, progress: number) => {
        if (progress === 1) {
          this.scene.start('MainScene', {});
        }
      });
    });

    SoundController.getSound('audio_music').play();
  }

  public update() {
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
