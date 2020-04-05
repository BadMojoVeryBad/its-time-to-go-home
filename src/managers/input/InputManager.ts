import { Controls } from './Controls';
import { InputInterface } from './inputs/InputInterface';

/**
 * Allows a control (e.g. 'Left' or 'Activate') to be mapped to
 * inputs (e.g. 'Left arrow key', 'A key').
 *
 * An instance of the manager should be created for each scene,
 * preferably in its `create()` method.
 */
export class InputManager {
  private controlMap: { [index: number]: InputInterface[] } = {};

  /**
   * Creates a map for the given control, which allows you to add inputs
   * to it using `registerInputs()`. If the control is already exists,
   * this method will do nothing.
   *
   * @param control The control to add to the input manager.
   */
  public registerControl(control: Controls) {
    this.controlMap[control] = [];
  }

  /**
   * Add an input to a control. Using this, you can add many inputs
   * to the same control.
   *
   * @param control The control to add the inputs to.
   * @param inputs The inputs to add.
   */
  public registerInputs(control: Controls, inputs: InputInterface[]) {
    this.controlMap[control] = inputs;
  }

  /**
   * Returns true if any input for the control is pressed.
   *
   * @param control The control to check.
   */
  public isPressed(control: Controls) {
    const inputs = this.controlMap[control.valueOf()];

    // For each input in this control.
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        // If one key is pressed, return true.
        if (inputs[i].isPressed() && inputs[i].isEnabled()) {
          return true;
        }
      }
    }

    // Fall through and return false
    return false;
  }

  /**
   * Adds a function to a control's 'pressed' event listener. This function
   * returns a reference. You will need to pass this reference to
   * `removeOnPress()` to remove the listener.
   *
   * @param control The control to add a press function to.
   * @param fn The function to run when the control is pressed.
   */
  public onPress(control: Controls, fn: () => void) {
    const inputs = this.controlMap[control.valueOf()];
    const reference = 'control.' + control.toString() + '.' + new Date().valueOf() + '.' + Math.floor(Math.random() * 1000000);

    // For each input in this control.
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].onPress(reference, fn);
      }
    }

    return reference;
  }

  /**
   * Removes a previously added press listener.
   *
   * @param control The control to remove a listener for.
   * @param reference The reference to the function, as returned by `onPress()`
   */
  public removeOnPress(control: Controls, reference: string) {
    const inputs = this.controlMap[control.valueOf()];

    // For each input in this control.
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].removeOnPress(reference);
      }
    }
  }

  /**
   * Disable all inputs for a control.
   *
   * @param control The control to disable.
   */
  public disableControl(control: Controls) {
    const inputs = this.controlMap[control.valueOf()];

    // For each input in this control.
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].setEnabled(false);
      }
    }
  }

  /**
   * Enable all inputs for a control.
   *
   * @param control The control to enable.
   */
  public enableControl(control: Controls) {
    const inputs = this.controlMap[control.valueOf()];

    // For each input in this control.
    if (inputs) {
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].setEnabled(true);
      }
    }
  }

  /**
   * Disables all controls.
   */
  public disableAllControls() {
    for (const control in this.controlMap) {
      this.disableControl(+control);
    }
  }

  /**
   * Enables all controls.
   */
  public enableAllControls() {
    for (const control in this.controlMap) {
      this.enableControl(+control);
    }
  }
}
