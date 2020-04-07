export abstract class MathUtils {
  public static normalise(val: number, max: number, min: number) {
    const norm = (val - min) / (max - min);
    return Phaser.Math.Clamp(norm, 0, 1);
  }

  public static valueOr(value: any, or: any): any {
    return (value !== undefined) ? value : or;
  }
}
