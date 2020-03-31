import { SceneBase } from '../scenes/SceneBase';
import { Marker } from '../sprites/Marker';
import { TextPlate } from '../sprites/TextPlate';

export class MarkerController {
  public markers: Marker[] = [];
  protected scene: SceneBase;

  constructor(scene: SceneBase) {
    this.scene = scene;

    this.scene.matter.world.on('collisionstart', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          const markerSprite = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          const marker = this.getMarkerBySprite(markerSprite);
          if (marker === undefined || !marker.isEnabled()) {
            return;
          }

          marker.setIsActive(true);

          const frame = markerSprite.anims.currentFrame.index;
          const newFrame = scene.anims.get('info-highlighted').frames[frame];
          markerSprite.play('info-highlighted');
          if (newFrame !== undefined) {
            markerSprite.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);

    this.scene.matter.world.on('collisionend', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          const markerSprite: Phaser.Physics.Matter.Sprite = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          const marker = this.getMarkerBySprite(markerSprite);
          if (marker === undefined || !marker.isEnabled()) {
            return;
          }

          marker.setIsActive(false);

          const frame = markerSprite.anims.currentFrame.index;
          const newFrame = this.scene.anims.get('info').frames[frame];
          markerSprite.play('info');
          if (newFrame !== undefined) {
            markerSprite.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);
  }

  public addMarker(x: number, y: number, event: (done: () => void) => any): Marker {
    const marker = new Marker(this.scene, event);
    marker.setPos(x, y);
    this.markers.push(marker);
    return marker;
  }

  public addMarkerWithTextPlate(x: number, y: number, message: string, emitOnClose: string | undefined): Marker {
    const marker = new Marker(this.scene, (done: any) => {
      const plate = new TextPlate(this.scene, message, () => {
        if (emitOnClose) {
          this.scene.events.emit(emitOnClose);
        }
        done();
      });
      plate.openPlate();
    });
    marker.setPos(x, y);
    this.markers.push(marker);
    return marker;
  }

  public removeMarkerById(tiledId: number): void {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].getMarkerId() === tiledId) {
        this.markers[i].getSprite().destroy();
        this.markers.splice(i, 1);
      }
    }
  }

  public getMarkerById(tiledId: number): Marker | undefined {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].getMarkerId() === tiledId) {
        return this.markers[i];
      }
    }
  }

  private getMarkerBySprite(sprite: Phaser.Physics.Matter.Sprite): Marker | undefined {
    for (let i = 0; i < this.markers.length; i++) {
      if (this.markers[i].getSprite() === sprite) {
        return this.markers[i];
      }
    }
  }
}
