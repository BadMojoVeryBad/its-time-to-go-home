import { Control } from '../controllers/InputController';
import { SceneBase } from '../scenes/SceneBase';
import { Player } from './Player';

export class Marker extends Phaser.GameObjects.Container {
  protected scene: SceneBase;
  private marker!: Phaser.Physics.Matter.Sprite;
  private player!: Player;
  private eventFn!: (done: () => void) => any;
  private keyEvent!: Phaser.Input.Keyboard.KeyboardPlugin;
  private isActive!: boolean;
  private isActivated: boolean = false;

  constructor(scene: SceneBase, player: Player, event: (done: () => void) => any) {
    super(scene);
    this.scene = scene;
    this.player = player;
    this.eventFn = event;
    this.marker = this.scene.matter.add.sprite(0, 0, 'player');
    this.marker.setDepth(100);

    this.add(this.marker);
    scene.add.existing(this);

    this.scene.anims.create({
      key: 'info',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'info-marker', start: 0, end: 15, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1,
    });

    this.scene.anims.create({
      key: 'info-highlighted',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'info-marker-highlighted', start: 0, end: 15, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1,
    });

    // Collision.
    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;
    const sensor = M.Bodies.rectangle(0, 0, 16, 64, { isSensor: true, label: 'marker' });
    this.marker.setExistingBody(sensor);
    this.marker.setScale(4);
    this.marker.setIgnoreGravity(true);
    this.marker.play('info');

    this.scene.inputController.onPress(Control.Activate, () => {
      if (this.isActive && !this.isActivated) {
        this.isActivated = true;
        this.eventFn(() => {
          this.isActivated = false;
        });
      }
    });
  }

  public setPos(x: number, y: number) {
    this.marker.setPosition(x, y);
  }

  public setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }
}
