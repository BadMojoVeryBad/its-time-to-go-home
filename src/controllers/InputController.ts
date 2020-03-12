import { ControlMap } from './input/ControlMap';

export enum Control {
  Left,
  Right,
  Jump,
  Activate
};

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

  public isPressed (control: Control) {
    // For each input in this control.
    let inputs = this.controls[control].getInputs();

    for (let i = 0; i < inputs.length; i++) {
      // If one key is pressed, return true.
      if (inputs[i].isDown) {
        return true;
      }
    }

    // Fall through and return false
    return false;
  }

  public onPress (control: Control, fn: () => void) {
    // Get control object.
    let inputs = this.controls[control].getInputs();

    // For each key in this control.
    for (let i = 0; i < inputs.length; i++) {
      // Add function to event.
      let input = inputs[i];
      input.on('down', fn);
    }

    // Return a reference to the event listeners
    let reference = 'control.' + control.toString() + '.' + fn.toString();
    this.customListeners[reference] = {
      control: control,
      function: fn
    };
    return reference;
  }

  public removeOnPress (reference: string) {
    // Get control object.
    let listener = this.customListeners[reference];
    let inputs = this.controls[listener.control].getInputs();

    // For each key in this control.
    for (let i = 0; i < inputs.length; i++) {
      let input = inputs[i];

      // Remove listener.
      input.removeListener('down', listener.function);
    }
  }

  public getControlString(control: Control) {
    // Get control/input map.
    let controlMap = this.controls[control];

    // Get the primary input used for this control.
    let primaryInput = controlMap.getPrimaryInput();
    return (primaryInput) ? String.fromCharCode(primaryInput.keyCode) : '[No Input]';
  }
}
