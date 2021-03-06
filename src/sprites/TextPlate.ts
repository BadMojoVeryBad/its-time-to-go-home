import { AudioManager } from '../managers/audio/AudioManager';
import { Controls } from '../managers/input/Controls';
import { SceneBase } from '../scenes/base/SceneBase';

export class TextPlate extends Phaser.GameObjects.Container {
  protected scene!: SceneBase;
  private message: string;
  private backgroundImage!: Phaser.GameObjects.Image;
  private text!: Phaser.GameObjects.BitmapText;
  private currentMessage: string = '';
  private plateState: string = 'closed';
  private hasCursor: boolean = true;
  private timer!: any;
  private timer2!: any;

  constructor(scene: SceneBase, message: string, onClose: () => void) {
    super(scene);
    this.message = message;
    this.onClose = onClose;

    // Add timers. They will start running immediately.
    this.addTimers();

    // On any keypress, close the text plate.
    const pressReference = this.scene.inputManager.onPress(Controls.Activate, () => {
      if (this.plateState === 'open') {
        // Remove the timers running the cursor blink.
        this.removeTimers();

        // Run the onClose function. This can be set by the user.
        this.onClose();

        // Play the 'deactivate' sound.
        AudioManager.play('deactivate');

        // Remove input listeners.
        this.scene.inputManager.removeOnPress(Controls.Activate, pressReference);

        // Enable character movement.
        this.scene.inputManager.enableControl(Controls.Jump);
        this.scene.inputManager.enableControl(Controls.Left);
        this.scene.inputManager.enableControl(Controls.Right);

        // Destroy the container.
        this.destroy();
      }
    });
  }

  public openPlate() {
    // Disable character movement.
    this.scene.inputManager.disableControl(Controls.Jump);
    this.scene.inputManager.disableControl(Controls.Left);
    this.scene.inputManager.disableControl(Controls.Right);

    // Set state.
    this.plateState = 'opening';

    // Create background image.
    this.backgroundImage = this.scene.add.image(this.scene.gameWidth / 2, this.scene.gameHeight - 104, 'player', 'text-plate');
    this.backgroundImage.setScrollFactor(0);
    this.backgroundImage.setScale(4);
    this.backgroundImage.setDepth(310);

    // Create text using bitmap font.
    this.text = this.scene.add.bitmapText(70, this.scene.gameHeight - 195, 'font', this.currentMessage);
    this.text.setScale(6);
    this.text.setScrollFactor(0);
    this.text.setDepth(310);
  }

  public destroy() {
    this.backgroundImage.destroy();
    this.text.destroy();
    super.destroy();
  }
  private onClose: () => any = () => {};

  private addTimers() {
    this.timer2 = this.scene.time.addEvent({
      delay: 10,
      callback: () => {
        // Add a letter to the text on the text plate. This creates a
        // 'typing' effect.
        this.currentMessage += this.message[this.currentMessage.length];
        const suffix2 = '_';
        this.text.destroy();
        this.text = this.scene.add.bitmapText(70, this.scene.gameHeight - 195, 'font', this.currentMessage + suffix2);
        this.text.setDepth(310);
        this.text.setScale(6);
        this.text.setScrollFactor(0);

        // If the full message has been typed.
        if (this.currentMessage === this.message) {
          // Set the text plate's state.
          this.plateState = 'open';
          this.timer2.remove();

          // Blink the cursor.
          this.timer = this.scene.time.addEvent({
            delay: 500,
            callback: () => {
              // Adds and removes the cursor. This creates the
              // blinking effect for the cursor.
              const suffix = (!this.hasCursor) ? '_' : '';
              this.text.destroy();
              this.text = this.scene.add.bitmapText(70, this.scene.gameHeight - 195, 'font', this.currentMessage + suffix);
              this.text.setDepth(310);
              this.text.setScale(6);
              this.text.setScrollFactor(0);
              this.hasCursor = !this.hasCursor;
            },
            loop: true,
          });
        }
      },
      loop: true,
    });
  }

  private removeTimers() {
    if (this.timer) {
      this.timer.remove();
    }

    if (this.timer2) {
      this.timer2.remove();
    }
  }
}
