import { AudioManager } from '../managers/audio/AudioManager.ts';
import { Controls } from '../managers/input/Controls';
import { ParticleManager } from '../managers/ParticleManager';
import { SpriteBase } from '../sprites/base/SpriteBase.ts';
import { CONST } from '../util/CONST';
import { SceneBase } from './base/SceneBase';

export class MenuScene extends SceneBase {
  public particleManager!: ParticleManager;
  private verticalOffsetPercentage: number = 0.25;
  private verticalOffsetPercentage2: number = 0;
  private selected: number = 0;
  private marker!: SpriteBase;
  private texts: Phaser.GameObjects.BitmapText[] = [];
  private currentScreen: string = 'menu';
  private controls!: SpriteBase;
  private back!: Phaser.GameObjects.BitmapText;
  private credits!: SpriteBase;

  private upPressed = false;
  private downPressed = false;

  constructor() {
    super({
      key: 'MenuScene',
    });
  }

  public preload() {
    this.particleManager = new ParticleManager(this);
  }

  public create() {
    super.create();

    const graphics = this.add.graphics();
    graphics.fillStyle(0x292929, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);

    const logo = this.add.image(this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) - this.gameHeight * this.verticalOffsetPercentage, 'logo');
    logo.setScrollFactor(0);
    logo.setScale(4);

    this.texts.push(this.add.bitmapText(this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2, 'font', 'Start Game.'));
    this.texts[0].setOrigin(0.125, 0.125);
    this.texts[0].setScale(4);
    this.texts[0].setScrollFactor(0);

    this.texts.push(this.add.bitmapText(this.gameWidth * CONST.HALF, ((this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2) + 48, 'font_grey', 'How to Play.'));
    this.texts[1].setOrigin(0.125, 0.125);
    this.texts[1].setScale(4);
    this.texts[1].setScrollFactor(0);

    this.texts.push(this.add.bitmapText(this.gameWidth * CONST.HALF, ((this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2) + 96, 'font_grey', 'Credits.'));
    this.texts[2].setOrigin(0.125, 0.125);
    this.texts[2].setScale(4);
    this.texts[2].setScrollFactor(0);

    this.controls = new SpriteBase(this, this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) + this.gameHeight * 0.075, 'player', 'controls');
    this.controls.disablePhysics();
    this.controls.alpha = 0;

    this.credits = new SpriteBase(this, this.gameWidth * CONST.HALF, (this.gameHeight * CONST.HALF) + this.gameHeight * 0.075, 'player', 'credits');
    this.credits.disablePhysics();
    this.credits.alpha = 0;

    this.back = this.add.bitmapText(this.gameWidth * CONST.HALF, ((this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2) + 180, 'font', 'Back.');
    this.back.setOrigin(0.125, 0.125);
    this.back.setScale(4);
    this.back.setScrollFactor(0);
    this.back.alpha = 0;

    this.marker = new SpriteBase(this, 0, 0, 'player', 'arrow0000');
    this.marker.disablePhysics();
    this.marker.play('arrow');
    this.marker.setOrigin(1, 0.5);
    this.marker.setPosition(this.texts[0].x - 100, this.texts[0].y - 28);
    this.marker.setScale(4);

    const ref = this.inputManager.onPress(Controls.Activate, () => {
      AudioManager.play('activate');

      if (this.currentScreen === 'menu') {
        if (this.selected === 0) {
          this.inputManager.removeOnPress(Controls.Activate, ref);
          this.cameras.main.fadeOut(600, 0, 0, 0, (camera: any, progress: number) => {
            if (progress === 1) {
              this.scene.start('Scene2', {});
            }
          });
        } else if (this.selected === 1) {
          // Hide marker.
          this.tweens.add({
            targets: this.marker,
            alpha: 0,
            duration: 400,
          });

          // Hide menu.
          this.tweens.add({
            targets: this.texts,
            alpha: 0,
            duration: 400,
            onComplete: () => {
              // Show controls.
              this.marker.setPosition(this.back.x - 60, ((this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2) + 200);
              this.currentScreen = 'controls';
              this.tweens.add({
                targets: [ this.controls, this.back, this.marker ],
                alpha: 1,
                duration: 400,
              });
            },
          });
        } else {
          // Hide marker.
          this.tweens.add({
            targets: this.marker,
            alpha: 0,
            duration: 400,
          });

          // Hide menu.
          this.tweens.add({
            targets: this.texts,
            alpha: 0,
            duration: 400,
            onComplete: () => {
              // Show controls.
              this.marker.setPosition(this.back.x - 60, ((this.gameHeight * CONST.HALF) + this.gameHeight * this.verticalOffsetPercentage2) + 200);
              this.currentScreen = 'credits';
              this.tweens.add({
                targets: [ this.credits, this.back, this.marker ],
                alpha: 1,
                duration: 400,
              });
            },
          });
        }
      } else if (this.currentScreen === 'controls') {
        // Hide controls.
        this.tweens.add({
          targets: [ this.controls, this.marker, this.back ],
          alpha: 0,
          duration: 400,
          onComplete: () => {
            this.currentScreen = 'menu';
            this.marker.setPosition(this.texts[1].x - 120, this.texts[1].y + 20);
            this.selected = 1;

            // Show controls.
            this.tweens.add({
              targets: this.texts,
              alpha: 1,
              duration: 400,
            });

            this.tweens.add({
              targets: this.marker,
              alpha: 1,
              duration: 400,
            });
          },
        });
      } else if (this.currentScreen === 'credits') {
        // Hide controls.
        this.tweens.add({
          targets: [ this.credits, this.marker, this.back ],
          alpha: 0,
          duration: 400,
          onComplete: () => {
            this.currentScreen = 'menu';
            this.marker.setPosition(this.texts[2].x - 80, this.texts[2].y + 20);
            this.selected = 2;

            // Show controls.
            this.tweens.add({
              targets: this.texts,
              alpha: 1,
              duration: 400,
            });

            this.tweens.add({
              targets: this.marker,
              alpha: 1,
              duration: 400,
            });
          },
        });
      }
    });
  }

  public update() {
    // Update menu items.
    if (this.currentScreen === 'menu') {
      if (this.selected === 0) {
        this.marker.setPosition(this.texts[0].x - 100, this.texts[0].y + 20);
        this.texts[0].setFont('font');
        this.texts[1].setFont('font_grey');
        this.texts[2].setFont('font_grey');
      } else if (this.selected === 1) {
        this.marker.setPosition(this.texts[1].x - 120, this.texts[1].y + 20);
        this.texts[0].setFont('font_grey');
        this.texts[1].setFont('font');
        this.texts[2].setFont('font_grey');
      } else if (this.selected === 2) {
        this.marker.setPosition(this.texts[2].x - 80, this.texts[2].y + 20);
        this.texts[0].setFont('font_grey');
        this.texts[1].setFont('font_grey');
        this.texts[2].setFont('font');
      }
    }

    // Joystick menu support.
    if (this.inputManager.isPressed(Controls.Up) && !this.upPressed) {
      this.upPressed = true;
      if (this.currentScreen === 'menu') {
        this.selected = (this.selected <= 0) ? 2 : this.selected - 1;
      }
      this.time.delayedCall(200, () => {
        this.upPressed = false;
      });
    }

    if (this.inputManager.isPressed(Controls.Down) && !this.downPressed) {
      this.downPressed = true;
      if (this.currentScreen === 'menu') {
        this.selected = (this.selected >= 2) ? 0 : this.selected + 1;
      }
      this.time.delayedCall(200, () => {
        this.downPressed = false;
      });
    }
  }
}
