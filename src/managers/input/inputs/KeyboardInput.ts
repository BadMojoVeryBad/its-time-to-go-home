import { SceneBase } from '../../../scenes/base/SceneBase';
import { InputBase } from './InputBase.ts';

/**
 * A keyboard button press.
 */
export class KeyboardInput extends InputBase {
  private scene!: SceneBase;
  private keyCode!: number;
  private key: Phaser.Input.Keyboard.Key;
  private listeners: any = {};

  constructor(scene: SceneBase, keyCode: number) {
    super();
    this.scene = scene;
    this.keyCode = keyCode;
    this.key = this.scene.input.keyboard.addKey(this.keyCode);
  }

  public isPressed(): number {
    return (this.isEnabled() && this.key.isDown) ? 1 : 0;
  }

  public onPress(reference: string, fn: () => void) {
    // The function to add to the keypress.
    const onPressFn = () => {
      // Don't do anything if the control is disabled.
      if (!this.isEnabled()) {
        return;
      }

      // Run function.
      fn();
    };

    // Listen for press.
    this.key.on('down', onPressFn);

    // Save a reference to the listener so we can remove it later.
    this.listeners[reference] = onPressFn;
  }

  public removeOnPress(reference: string) {
    this.key.removeListener('down', this.listeners[reference]);
  }
}
