import { Marker } from  '../sprites/Marker';
import { Player } from  '../sprites/Player';

export class MarkerController {
  private scene!: Phaser.Scene;
  private player!: Player;
  private markers: Marker[] = [];

  constructor (scene: Phaser.Scene, player: Player) {
    this.scene = scene;

    this.scene.matter.world.on('collisionstart', (event:any) => {
      for (var i = 0; i < event.pairs.length; i++) {
        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          let marker = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          marker.parentContainer.setIsActive(true);

          let frame = marker.anims.currentFrame.index;
          let newFrame = scene.anims.get('info-highlighted').frames[frame];
          marker.play('info-highlighted');
          if (newFrame !== undefined) {
            marker.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);

    this.scene.matter.world.on('collisionend', (event:any) => {
      for (var i = 0; i < event.pairs.length; i++) {
        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;
        if ((bodyA.label === 'astronaut' && bodyB.label === 'marker') || (bodyB.label === 'astronaut' && bodyA.label === 'marker')) {
          let marker:Phaser.Physics.Matter.Sprite = (bodyA.label === 'astronaut') ? bodyB.gameObject : bodyA.gameObject;

          marker.parentContainer.setIsActive(false);

          let frame = marker.anims.currentFrame.index;
          let newFrame = this.scene.anims.get('info').frames[frame];
          marker.play('info');
          if (newFrame !== undefined) {
            marker.anims.setCurrentFrame(newFrame);
          }
        }
      }
    }, this);
  }

  addMarker (x:number, y:number, event:(done:() => void) => any) {
    let marker = new Marker(this.scene, this.player, event);
    marker.setPos(x, y);
    this.markers.push(marker);
  }
}
