import { GameplaySceneBase } from '../scenes/base/GameplaySceneBase';

export class GameplayEvent {
  private scene: GameplaySceneBase;
  private container: MatterJS.BodyType;

  constructor(scene: GameplaySceneBase, x: number, y: number, w: number, h: number, eventName: string) {
    this.scene = scene;

    const label = 'event_' + eventName;
    this.container = this.scene.matter.add.rectangle(x, y, w, h, { isSensor: true, label });
    this.container.ignoreGravity = true;

    this.scene.matter.world.on('collisionstart', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;

        if ((bodyA.label === 'astronaut' && bodyB.label === label) ||
          (bodyB.label === 'astronaut' && bodyA.label === label)) {
          this.scene.events.emit(eventName);
        }
      }
    });
  }
}
