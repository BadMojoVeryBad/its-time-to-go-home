import { Control } from '../controllers/InputController';
import { SceneBase } from '../scenes/SceneBase';
import { Player } from './Player';

export class Marker extends Phaser.GameObjects.Container {
  protected scene: SceneBase;
  private marker!: Phaser.Physics.Matter.Sprite;
  private eventFn!: (done: () => void) => any;
  private isActive!: boolean;
  private isActivated: boolean = false;
  protected markerId: number = 0;

  constructor(scene: SceneBase, player: Player, event: (done: () => void) => any) {
    super(scene);
    this.scene = scene;
    this.eventFn = event;
    this.marker = this.scene.matter.add.sprite(0, 0, 'player');
    this.setDepth(100);

    this.add(this.marker);
    scene.add.existing(this);

    this.once('destroy', () => {
      this.marker.destroy();
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

  public getMarkerId() {
    return this.markerId;
  }

  public setMarkerId (id:number) {
    this.markerId = id;
  }
}
