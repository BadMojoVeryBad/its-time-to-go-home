import { Control } from '../controllers/InputController';
import { SoundController } from '../controllers/SoundController';
import { SceneBase } from '../scenes/SceneBase';

export class Marker {
  private scene: SceneBase;
  private onActivate: (done: () => void) => void;
  private isActive: boolean = false;
  private isActivated: boolean = false;
  private marker!: Phaser.Physics.Matter.Sprite;
  private markerId: number = 0;

  constructor(scene: SceneBase, onActivate: (done: () => void) => any) {
    this.scene = scene;
    this.onActivate = onActivate;

    // Create the marker sprite.
    this.marker = this.scene.matter.add.sprite(0, 0, 'player');
    scene.add.existing(this.marker);

    // Collision.
    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;
    const sensor = M.Bodies.rectangle(0, 0, 16, 64, { isSensor: true, label: 'marker' });
    this.marker.setExistingBody(sensor);
    this.marker.setScale(4).setDepth(100);
    this.marker.setIgnoreGravity(true);
    this.marker.play('info');

    // What to do when the marker is activated.
    this.scene.inputController.onPress(Control.Activate, () => {
      // If the marker is 'active' and it isn't already activated,
      // then run its 'onActivate' function.
      if (this.isActive && !this.isActivated) {
        SoundController.getSound('audio_activate').play();
        this.isActivated = true;
        this.onActivate(() => {
          // When the 'done()' callback is called, we know the marker's
          // 'onActivate' function is complete, so we deactivate the
          // marker.
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

  public setMarkerId(id: number) {
    this.markerId = id;
  }

  public getSprite() {
    return this.marker;
  }
}
