import { Marker } from '../sprites/Marker';
import { Player } from '../sprites/Player';
import { SceneBase } from '../scenes/SceneBase';

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

  public addMarker(x: number, y: number, event: (done: () => void) => any) {
    const marker = new Marker(this.scene, this.player, event);
    marker.setPos(x, y);
    this.markers.push(marker);
  }
}
