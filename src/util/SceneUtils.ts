import { CreditScene } from '../scenes/CreditScene';
import { LoadScene } from '../scenes/LoadScene';
import { MainScene } from '../scenes/MainScene';
import { MenuScene } from '../scenes/MenuScene';
import { PreloadScene } from '../scenes/PreloadScene';

export abstract class SceneUtils {
  public static getScenes (): any[] {
    return [
      PreloadScene,
      CreditScene,
      LoadScene,
      MainScene,
      MenuScene
    ];
  }
}
