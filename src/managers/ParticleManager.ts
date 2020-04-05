import { SceneBase } from '../scenes/SceneBase';

/**
 * A wrapper around Phaser's particle system to make things easier for me :P
 *
 * In this manager, an 'Emitter' can be created, which is used as a
 * template to create 'Particle Emitters' in scenes.
 */
export class ParticleManager {

  /**
   * Add an emitter to the manager. This is static, so the emitters
   * are available globally.
   *
   * @param key A unique string to reference this emitter by.
   * @param config The Phaser emitter config.
   */
  public static addEmitter(key: string, config: {}) {
    ParticleManager.emitterConfigs[key] = config;
  }

  private static emitterConfigs: { [index: string]: {} } = {};
  private scene: SceneBase;
  private particles: { [index: string]: Phaser.GameObjects.Particles.ParticleEmitterManager } = {};
  private playing: { [index: string]: number } = {};

  constructor(scene: SceneBase) {
    this.scene = scene;
  }

  /**
   * Creates and returns a particle emitter that has been added to the scene.
   *
   * @param key A unique string to refer to this particle emitter by.
   * @param emitters A list of emitter configs to use for this particle emitter.
   * @param depth The depth in the scene to set the particle emitter at.
   */
  public createParticleEmitter(key: string, emitters: string[], depth = 200) {
    this.particles[key] = this.scene.add.particles('player');
    this.particles[key].setDepth(depth);

    for (const emitter of emitters) {
      this.particles[key].createEmitter(ParticleManager.emitterConfigs[emitter]);
    }

    // Don't play on init.
    this.playing[key] = 1;
    this.stop(key);

    return this.particles[key];
  }

  /**
   * Return a particle emitter that has been previously added to the scene.
   *
   * @param key Unique string to reference a particle emitter by.
   */
  public getParticleEmitter(key: string) {
    return this.particles[key];
  }

  /**
   * Start a particle emitter.
   *
   * @param key Unique string to reference a particle emitter by.
   */
  public start(key: string) {
    if (!this.playing[key]) {
      this.playing[key] = 1;
      this.particles[key].emitters.each((emitter) => {
        emitter.start();
      });
    }
  }

  /**
   * Stop a particle emitter.
   *
   * @param key Unique string to reference a particle emitter by.
   */
  public stop(key: string) {
    if (this.playing[key]) {
      this.playing[key] = 0;
      this.particles[key].emitters.each((emitter) => {
        emitter.stop();
      });
    }
  }
}
