import { InputScene } from '../scenes/InputScene';
import { LoadScene } from '../scenes/LoadScene';
import { MenuScene } from '../scenes/MenuScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { Scene1 } from '../scenes/Scene1';
import { Scene2 } from '../scenes/Scene2';
import { VignetteScene } from '../scenes/VignetteScene.ts';

export abstract class SceneUtils {
  public static getScenes(): any[] {
    return [
      InputScene,
      PreloadScene,
      LoadScene,
      MenuScene,
      Scene1,
      Scene2,
      VignetteScene,
    ];
  }
}
