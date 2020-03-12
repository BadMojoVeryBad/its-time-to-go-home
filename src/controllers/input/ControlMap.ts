import { Control } from '../InputController';

export class ControlMap {
  private control: Control;
  private inputs: Phaser.Input.Keyboard.Key[];

  constructor(control: Control, ...inputs: Phaser.Input.Keyboard.Key[]) {
    this.inputs = inputs;
    this.control = control;
  }

  public getInputs() {
    return this.inputs;
  }

  public getPrimaryInput() {
    return (this.inputs.length) ? this.inputs[0] : null;
  }
}
