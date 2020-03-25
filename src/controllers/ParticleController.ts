import { SceneBase } from "../scenes/SceneBase";

export class ParticleController {
  private scene: SceneBase;
  private particles: { [index:string] : Phaser.GameObjects.Particles.ParticleEmitterManager } = {};
  private static emitterConfigs: { [index:string] : {} } = {};
  private playing: { [index:string] : number } = {}

  constructor(scene: SceneBase) {
    this.scene = scene;
  }

  public static addEmitter(key:string, config: {}) {
    ParticleController.emitterConfigs[key] = config;
  }

  public createParticleEmitter(key: string, emitters: string[], depth = 200) {
    this.particles[key] = this.scene.add.particles('player');
    this.particles[key].setDepth(depth);

    for (const emitter of emitters) {
      this.particles[key].createEmitter(ParticleController.emitterConfigs[emitter]);
    }

    // Don't play on init.
    this.playing[key] = 1;
    this.stop(key);

    return this.particles[key];
  }

  public getParticleEmitter(key: string) {
    return this.particles[key];
  }

  public start(key: string) {
    if (!this.playing[key]) {
      this.playing[key] = 1;
      this.particles[key].emitters.each(emitter => {
        emitter.start();
      });
    }
  }

  public stop(key: string) {
    if (this.playing[key]) {
      this.playing[key] = 0;
      this.particles[key].emitters.each(emitter => {
        emitter.stop();
      });
    }
  }
}
