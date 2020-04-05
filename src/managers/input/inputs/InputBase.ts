import { InputInterface } from './InputInterface.ts';

/**
 * A base class to use when creating different input types.
 */
export abstract class InputBase implements InputInterface {
  private disabledCount: number = 0;

  constructor() {
    // ...
  }

  public isPressed(): number {
    return 0;
  }

  public onPress(reference: string, fn: () => void) {
    // ...
  }

  public removeOnPress(reference: string) {
    // ...
  }

  public setEnabled(enabled: boolean) {
    this.disabledCount = (enabled) ? this.disabledCount + 1 : this.disabledCount - 1;
  }

  public isEnabled(): boolean {
    return this.disabledCount === 0;
  }
}
