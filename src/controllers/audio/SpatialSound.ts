import { Howl } from 'howler';
import { GameplaySceneBase } from '../../scenes/GameplaySceneBase.ts';
import { CONST } from '../../util/CONST.ts';
import { MathUtils } from '../../util/MathUtils.ts';
import { AudioManager } from './AudioManager.ts';
import { SoundInterface } from './SoundInterface';

export class SpatialSound extends Phaser.GameObjects.Container implements SoundInterface {
  protected scene!: GameplaySceneBase;
  private sound: Howl;
  private radius: number;
  private target: Phaser.GameObjects.Sprite;
  private key: string;
  private debugOrigin!: Phaser.GameObjects.Graphics;

  constructor(scene: GameplaySceneBase, key: string, soundUrl: any, config: {}, x: number, y: number, radius: number, target: Phaser.GameObjects.Sprite) {
    super(scene, x, y);
    scene.add.existing(this);

    let howlConfig = {
      volume: 1,
      loop: false,
      src: [ soundUrl ],
    };

    howlConfig = Object.assign(howlConfig, config);

    this.sound = new Howl(howlConfig);
    this.radius = radius;
    this.target = target;
    this.key = key;

    // When this object is destroyed by Phaser, remove
    // any references to it in the audio manager.
    this.once('destroy', () => {
      this.sound.stop();
      AudioManager.removeSound(this.key);
    });

    // Setup debug graphics.
    if (CONST.DEBUG) {
      this.debugOrigin = this.scene.add.graphics();
      this.debugOrigin.setDepth(990);
      this.debugOrigin.fillStyle(0x000000, 1);
      this.debugOrigin.fillCircle(0, 0, 7);
      this.debugOrigin.setPosition(this.x, this.y);
    }
  }

  public preUpdate(time: number, delta: number) {
    // Set volume based on distance from target.
    const distance = Phaser.Math.Distance.Between(this.target.x, this.target.y, this.x, this.y);
    const volume = MathUtils.normalise(distance, 0, this.radius);
    this.sound.volume(volume);

    // Draw origin point for debugging.
    if (CONST.DEBUG && this.debugOrigin !== undefined) {
      this.debugOrigin.setPosition(this.x, this.y);
    }
  }

  public volume(): number {
    return this.sound.volume();
  }

  public play() {
    this.sound.play();
  }

  public stop() {
    this.sound.stop();
  }

  public fadeIn(volume: number = 1, duration: number = 400) {
    // Calculate appropriate volume to fade in to, and ignore the volume parameter.
    this.sound.fade(this.sound.volume(), volume, duration);
  }

  public fadeOut(volume: number = 0, duration: number = 400) {
    // Will only fade out to 0, as the volume is a computed value.
    this.sound.fade(this.sound.volume(), volume, duration);
  }

  public isPlaying(): boolean {
    return this.sound.playing();
  }
}
