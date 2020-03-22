/**
 * This class contains all the constants the game uses.
 */
export abstract class CONST {
  /**
   * Wether or not the game is in debug mode.
   */
  public static readonly DEBUG = false;

  /**
   * The scale of the pixel art in the game. To be used
   * with the setScale() method of game objects.
   */
  public static readonly SCALE = 4;

  /**
   * A value representing zero.
   */
  public static readonly ZERO = 0;

  /**
   * Used for when a factor of half or something is needed.
   * e.g.
   *     let halfValue = value * CONST.HALF;
   */
  public static readonly HALF = 0.5;

  /**
   * Used for when a number needs to be converted to negative.
   * e.g.
   *     let negativeValue = value * CONST.NEGATIVE;
   */
  public static readonly NEGATIVE = -1;
}
