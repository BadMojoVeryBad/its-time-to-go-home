import { SceneBase } from '../../../scenes/base/SceneBase';
import { InputBase } from './InputBase.ts';

export enum Gamepad {
  ONE,
  TWO,
  THREE,
  FOUR,
}

export enum GamepadButton {
  A,
  B,
  X,
  Y,
  L1,
  R1,
  L2,
  R2,
  SELECT,
  START,
  STICK_LEFT,
  STICK_RIGHT,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  VENDOR_1, // The 'PS Button' or 'Xbox Home' button.
  VENDOR_2, // The Dualshock4's touch panel thing.
  STICK_LEFT_UP,
  STICK_LEFT_DOWN,
  STICK_LEFT_LEFT,
  STICK_LEFT_RIGHT,
  STICK_RIGHT_UP,
  STICK_RIGHT_DOWN,
  STICK_RIGHT_LEFT,
  STICK_RIGHT_RIGHT,
}

export enum GamepadStick {
  LEFT,
  RIGHT,
}

export enum GamepadStickAxis {
  LEFT_X,
  LEFT_Y,
  RIGHT_X,
  RIGHT_Y,
}

export class GamepadInput extends InputBase {

  /**
   * Returns the x and y coordinates for the designated gamepad and stick.
   * The gamepad sticks don't work like normal buttons, so they don't work
   * with functions like `isPressed()` and `onPress()`. Instead, you can get
   * The stick axis data here and do with it what you like.
   *
   * @param pad The gamepad.
   * @param stick The stick to get the x and y coordinates for.
   */
  public static getGamepadStickVector(scene: SceneBase, pad: Gamepad, stick: GamepadStick): { x: number, y: number } {
    // Get gamepad.
    const gamepad = GamepadInput.getGamepad(scene, pad);

    // Default.
    const vector = {
      x: 0,
      y: 0,
    };

    // Get the current stick vector.
    if (gamepad !== undefined && stick === GamepadStick.LEFT) {
      vector.x = gamepad.getAxisValue(GamepadStickAxis.LEFT_X);
      vector.y = gamepad.getAxisValue(GamepadStickAxis.LEFT_Y);
    } else if (gamepad !== undefined && stick === GamepadStick.RIGHT) {
      vector.x = gamepad.getAxisValue(GamepadStickAxis.RIGHT_X);
      vector.y = gamepad.getAxisValue(GamepadStickAxis.RIGHT_Y);
    }

    // Return the values.
    return vector;
  }

  private static getGamepad(scene: SceneBase, pad: Gamepad): Phaser.Input.Gamepad.Gamepad | undefined {
    if (pad === Gamepad.ONE) {
      return scene.input.gamepad.pad1;
    } else if (pad === Gamepad.TWO) {
      return scene.input.gamepad.pad2;
    } else if (pad === Gamepad.THREE) {
      return scene.input.gamepad.pad3;
    } else if (pad === Gamepad.FOUR) {
      return scene.input.gamepad.pad4;
    }

    // Fallthrough return nothing.
    return undefined;
  }
  private scene!: SceneBase;
  private pad: Gamepad;
  private button: GamepadButton;
  private listeners: any = {};

  constructor(scene: SceneBase, pad: Gamepad, button: GamepadButton) {
    super();
    this.scene = scene;
    this.pad = pad;
    this.button = button;
  }

  public isPressed(): number {
    // What gamepad?
    const gamepad = GamepadInput.getGamepad(this.scene, this.pad);

    // if there's no gamepad, the button is not pressed.
    if (gamepad === undefined) {
      return 0;
    }

    // Get the relevant button press and decide how much it's pressed.
    if (this.button === GamepadButton.L1) {
      return gamepad.L1;
    } else if (this.button === GamepadButton.R1) {
      return gamepad.R1;
    } else if (this.button === GamepadButton.L2) {
      return gamepad.L2;
    } else if (this.button === GamepadButton.R2) {
      return gamepad.R2;
    } else if (this.button === GamepadButton.STICK_LEFT_UP) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.LEFT);
      return (vec.y >= 0) ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.STICK_LEFT_DOWN) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.LEFT);
      return (vec.y <= 0) ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.STICK_LEFT_LEFT) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.LEFT);
      return (vec.x >= 0) ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.STICK_LEFT_RIGHT) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.LEFT);
      return (vec.x <= 0) ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.STICK_RIGHT_UP) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.RIGHT);
      return (vec.y >= 0) ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.STICK_RIGHT_DOWN) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.RIGHT);
      return (vec.y <= 0) ? 0 : Math.abs(vec.y);
    } else if (this.button === GamepadButton.STICK_RIGHT_LEFT) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.RIGHT);
      return (vec.x >= 0) ? 0 : Math.abs(vec.x);
    } else if (this.button === GamepadButton.STICK_RIGHT_RIGHT) {
      const vec = GamepadInput.getGamepadStickVector(this.scene, this.pad, GamepadStick.RIGHT);
      return (vec.x <= 0) ? 0 : Math.abs(vec.x);
    } else {
      return (gamepad.isButtonDown(this.button)) ? 1 : 0;
    }
  }

  public onPress(reference: string, fn: () => void) {
    // The function to add to the keypress.
    const onPressFn = (pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button, value: number) => {
      // Don't do anything if the control is disabled.
      if (!this.isEnabled()) {
        return;
      }

      // Is it the right button?
      const gamepad = GamepadInput.getGamepad(this.scene, this.pad);
      const isRightButton = (gamepad === pad && button.index === this.button);
      if (isRightButton) {
        // Run function.
        fn();
      }
    };

    this.scene.input.gamepad.on('down', onPressFn);

    // Save a reference to the listener so we can remove it later.
    this.listeners[reference] = onPressFn;
  }

  public removeOnPress(reference: string) {
    this.scene.input.gamepad.removeListener('down', this.listeners[reference]);
  }
}
