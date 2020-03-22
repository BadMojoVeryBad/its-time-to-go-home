import { ControlMap } from './input/ControlMap';

export enum Control {
  Left,
  Right,
  Jump,
  Activate,
}

export class InputController extends Phaser.GameObjects.Container {
  private controls: ControlMap[] = [];
  private customListeners: any = {};

  constructor(scene: Phaser.Scene) {
    super(scene);

    // Add control maps in the order of the enum so
    // that we can access them by index.

    // Left - a (65) and left arrow (37)
    this.controls.push(new ControlMap(Control.Left, this.scene.input.keyboard.addKey(65), this.scene.input.keyboard.addKey(37)));

    // Right - d (68) and right arrow (39)
    this.controls.push(new ControlMap(Control.Right, this.scene.input.keyboard.addKey(68), this.scene.input.keyboard.addKey(39)));

    // Jump - w (87) and up (38) and spacebar (32)
    this.controls.push(new ControlMap(Control.Jump, this.scene.input.keyboard.addKey(87), this.scene.input.keyboard.addKey(38), this.scene.input.keyboard.addKey(32)));

    // Activate - z (90) and f (70)
    this.controls.push(new ControlMap(Control.Activate, this.scene.input.keyboard.addKey(90), this.scene.input.keyboard.addKey(70)));
  }

  public isPressed(control: Control) {
    // Don't do anything if the control is disabled.
    if (!this.controls[control].enabled) {
      return;
    }

    // For each input in this control.
    const inputs = this.controls[control].getInputs();

    for (let i = 0; i < inputs.length; i++) {
      // If one key is pressed, return true.
      if (inputs[i].isDown) {
        return true;
      }
    }

    // Fall through and return false
    return false;
  }

  public onPress(control: Control, fn: () => void) {
    // Get control object.
    const inputs = this.controls[control].getInputs();

    // The function to add to the keypress.
    const onPressFn = () => {
      // Don't do anything if the control is disabled.
      if (!this.controls[control].enabled) {
        return;
      }

      // Run function.
      fn();
    };

    // For each key in this control.
    for (let i = 0; i < inputs.length; i++) {
      // Add function to event.
      const input = inputs[i];
      input.on('down', onPressFn);
    }

    // Return a reference to the event listeners
    const reference = 'control.' + control.toString() + '.' + new Date().valueOf();
    this.customListeners[reference] = {
      control,
      function: onPressFn,
    };
    return reference;
  }

  public removeOnPress(reference: string) {
    // Get control object.
    const listener = this.customListeners[reference];
    const inputs = this.controls[listener.control].getInputs();

    // For each key in this control.
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];

      // Remove listener.
      input.removeListener('down', listener.function);
    }
  }

  public getControlString(control: Control) {
    // Get control/input map.
    const controlMap = this.controls[control];

    // Get the primary input used for this control.
    const primaryInput = controlMap.getPrimaryInput();
    return (primaryInput) ? String.fromCharCode(primaryInput.keyCode) : '[No Input]';
  }

  public disableControl(control: Control) {
    this.controls[control].enabled = false;
  }

  public enableControl(control: Control) {
    this.controls[control].enabled = true;
  }

  public enableAllControls() {
    for (const control of this.controls) {
      control.enabled = true;
    }
  }

  public disableAllControls() {
    for (const control of this.controls) {
      control.enabled = false;
    }
  }
}
