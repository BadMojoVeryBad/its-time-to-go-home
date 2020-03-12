import { SceneBase } from '../scenes/SceneBase';
import { Control } from '../controllers/InputController';

export class TextPlate extends Phaser.GameObjects.Container {
  private message!:string;
  private currentMessage!:string = '';
  private plateState:string = "closed";
  private key!:Phaser.Input.Keyboard.Key;
  private hasCursor:boolean = true;
  private background!:Phaser.GameObjects.Image;
  private foreground!:Phaser.GameObjects.BitmapText;
  private timer!:any;
  private timer2!:any;
  private onClose:() => any = () => {};
  private keyEvent!:Phaser.Input.Keyboard.KeyboardPlugin;
  protected scene: SceneBase;
  constructor(scene: SceneBase, message: string) {
    super(scene)
    this.scene = scene
    this.message = message
    this.key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    // On any keypress, close the plate.
    let pressReference = this.scene.inputController.onPress(Control.Activate, () => {
      if (this.plateState === 'open') {
        if (this.timer) {
          this.timer.remove();
        }

        if (this.timer2) {
          this.timer2.remove();
        }

        this.onClose();

        this.scene.inputController.removeOnPress(pressReference);
        this.background.destroy();
        this.foreground.destroy();
        this.destroy();
      }
    })

    this.timer2 = scene.time.addEvent({
      delay: 10,
      callback: () => {
        this.currentMessage += this.message[this.currentMessage.length];
        let suffix = '_';
        this.foreground.destroy();
        this.foreground = this.scene.add.bitmapText(70, this.scene.gameHeight - 145, 'font', this.currentMessage + suffix);
        this.foreground.setScale(0.5);
        this.foreground.setScrollFactor(0);


        if (this.currentMessage === this.message) {
          this.plateState = 'open';
          this.timer2.remove();
          this.timer = scene.time.addEvent({
            delay: 500,
            callback: () => {
              let suffix = (!this.hasCursor) ? '_' : ''
              this.foreground.destroy();
              this.foreground = this.scene.add.bitmapText(70, this.scene.gameHeight - 145, 'font', this.currentMessage + suffix);
              this.foreground.setScale(0.5);
              this.foreground.setScrollFactor(0);
              this.hasCursor = !this.hasCursor;
            },
            loop: true
          });
        }
      },
      loop: true
    });
  }

  openPlate() {
    this.plateState = "opening";

    this.background = this.scene.add.image(this.scene.gameWidth / 2, this.scene.gameHeight - 104, 'player', 'text-plate');
    this.background.setScrollFactor(0);
    this.background.setScale(4);

    this.foreground = this.scene.add.bitmapText(70, this.scene.gameHeight - 145, 'font', this.currentMessage);
    this.foreground.setScale(0.5);
    this.foreground.setScrollFactor(0);
  }

  setOnClose(closeFn:() => any) {
    this.onClose = closeFn;
  }
}
