import { Marker } from '../sprites/Marker';
import { Player } from '../sprites/Player';
import { SceneBase } from '../scenes/SceneBase';
import { TextPlate } from '../sprites/TextPlate';

export class MarkerController {
  private player!: Player;
  private markers: Marker[] = [];
  protected scene: SceneBase;

  constructor(scene: SceneBase, player: Player) {
    this.scene = scene;

    this.scene.matter.world.on('collisionstart', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          const marker = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          marker.parentContainer.setIsActive(true);

          const frame = marker.anims.currentFrame.index;
          const newFrame = scene.anims.get('info-highlighted').frames[frame];
          marker.play('info-highlighted');
          if (newFrame !== undefined) {
            marker.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);

    this.scene.matter.world.on('collisionend', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          const marker: Phaser.Physics.Matter.Sprite = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          (marker.parentContainer as Marker).setIsActive(false);

          const frame = marker.anims.currentFrame.index;
          const newFrame = this.scene.anims.get('info').frames[frame];
          marker.play('info');
          if (newFrame !== undefined) {
            marker.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);
  }

  public addMarker(x: number, y: number, event: (done: () => void) => any): Marker {
    const marker = new Marker(this.scene, this.player, event);
    marker.setPos(x, y);
    this.markers.push(marker);
    return marker;
  }

  public addMarkerWithTextPlate(x: number, y: number, message: string, emitOnClose: string | undefined): Marker {
    const marker = new Marker(this.scene, this.player, (done: any) => {
      const plate = new TextPlate(this.scene, message);
      plate.openPlate();
      plate.setOnClose(() => {
        if (emitOnClose) {
          this.scene.events.emit(emitOnClose);
        }
        done();
      });
    });
    marker.setPos(x, y);
    this.markers.push(marker);
    return marker;
  }

  public getMarker (tiledId: number): Marker | undefined {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].getMarkerId() === tiledId) {
        return this.markers[i];
      }
    }
  }
}
