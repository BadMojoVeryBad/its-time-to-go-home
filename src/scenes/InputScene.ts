import { Controls } from '../managers/input/Controls';
import { InputManager } from '../managers/input/InputManager';
import { Gamepad, GamepadButton, GamepadInput } from '../managers/input/inputs/GamepadInput';
import { KeyboardInput } from '../managers/input/inputs/KeyboardInput';
import { SceneBase } from './base/SceneBase';

export class InputScene extends SceneBase {
  constructor() {
    super({
      key: 'InputScene',
    });
  }

  public create() {
    super.create();

    this.game.inputManager = new InputManager(this);
    this.inputManager = this.game.inputManager;

    // Up.
    this.inputManager.registerControl(Controls.Up);
    this.inputManager.registerInputs(Controls.Up, [
      new KeyboardInput(this, 87),
      new KeyboardInput(this, 38),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.UP),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.STICK_LEFT_UP),
    ]);

    // Down.
    this.inputManager.registerControl(Controls.Down);
    this.inputManager.registerInputs(Controls.Down, [
      new KeyboardInput(this, 83),
      new KeyboardInput(this, 40),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.DOWN),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.STICK_LEFT_DOWN),
    ]);

    // Left.
    this.inputManager.registerControl(Controls.Left);
    this.inputManager.registerInputs(Controls.Left, [
      new KeyboardInput(this, 65),
      new KeyboardInput(this, 37),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.LEFT),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.STICK_LEFT_LEFT),
    ]);

    // Right.
    this.inputManager.registerControl(Controls.Right);
    this.inputManager.registerInputs(Controls.Right, [
      new KeyboardInput(this, 68),
      new KeyboardInput(this, 39),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.RIGHT),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.STICK_LEFT_RIGHT),
    ]);

    // Jump.
    this.inputManager.registerControl(Controls.Jump);
    this.inputManager.registerInputs(Controls.Jump, [
      new KeyboardInput(this, 87),
      new KeyboardInput(this, 38),
      new KeyboardInput(this, 32),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.A),
    ]);

    // Activate.
    this.inputManager.registerControl(Controls.Activate);
    this.inputManager.registerInputs(Controls.Activate, [
      new KeyboardInput(this, 90),
      new KeyboardInput(this, 70),
      new KeyboardInput(this, 13),
      new GamepadInput(this, Gamepad.ONE, GamepadButton.X),
    ]);
  }
}
