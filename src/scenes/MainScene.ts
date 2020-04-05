import { GameplayCamera } from '../cameras/GameplayCamera';
import { AudioManager } from '../managers/audio/AudioManager.ts';
import { CutsceneManager } from '../managers/cutscene/CutsceneManager';
import { Rocket } from '../sprites/Rocket';
import { CONST } from '../util/CONST';
import { GameFlag } from '../util/GameFlags';
import { GameplaySceneBase } from './GameplaySceneBase';

export class MainScene extends GameplaySceneBase {
  private rocket!: Rocket;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    super.preload();
  }

  public create() {
    super.create();

    // Setup the map.
    this.setupTiles();
    this.setupImages();
    this.setupMarkers();
    this.setupEvents();

    // Setup the events/cutscenes this scene has.
    this.setupCutscenes();

    // Earth.
    const earth: Phaser.GameObjects.Sprite = this.add.sprite(150, 650, 'player', 'earth0001');
    earth.setOrigin(0.5, 0.5);
    earth.setPosition(150 + 550, 600 + 300);
    earth.play('earth');
    earth.setScale(CONST.SCALE);
    earth.setDepth(31);

    // Create a new main camera that we can control.
    new GameplayCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);

    // Add rocket.
    const rockets = this.map.getObjectLayer('rocket').objects;
    rockets.forEach((obj) => {
      this.rocket = new Rocket(this, obj.x, obj.y);
    });

    // Set up the opening cutscene.
    if (this.game.flags.flag(GameFlag.OPENING_CUTSCENE_PLAYED)) {
    // if (true) {
      this.setupTransitionEvents();
    } else {
      this.setupTransitionEvents(6000, 4000);
      this.events.emit('cutscene_opening');
      this.time.delayedCall(500, () => {
        AudioManager.play('music_2');
        AudioManager.fadeIn('music_2', 1000, 0.75);
      });
    }

    // If the rocket cutscene has already played, remove it and
    // replace it with a new marker.
    if (this.game.flags.flag(GameFlag.ROCKET_NOFUEL_CUTSCENE_PLAYED)) {
      this.markerController.removeMarkerById(11);
      this.markerController.addMarkerWithTextPlate((33 * CONST.SCALE) + 32, (462 * CONST.SCALE) - 64, 'This rocket needs to be\nrefueled. How annoying.', undefined);
    }
  }

  private setupCutscenes() {
    this.events.on('cutscene_opening', () => {
      this.game.flags.setFlag(GameFlag.OPENING_CUTSCENE_PLAYED);
      const cutscene = new CutsceneManager(this);
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 150, yTarget: 600, duration: 0 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('wait', { duration: 11000 });
      cutscene.addAction('setDepth',  { object: this.mapLayers.background2, depth: 59 });
      cutscene.addAction('wait', { duration: 2000 });
      cutscene.addAction('drawText', { text: 'It\'s Time', x: 150 + 200, y: 600 + 240 });
      cutscene.addAction('wait', { duration: 400 });
      cutscene.addAction('drawText', { text: 'To Go', x: 150 + 200, y: 600 + 280 });
      cutscene.addAction('wait', { duration: 1400 });
      cutscene.addAction('drawText', { text: 'Home.', x: 150 + 200, y: 600 + 320 });
      cutscene.addAction('wait', { duration: 3000 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 5000 });
      cutscene.addAction('wait', { duration: 2000 });
      cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 691 });
      cutscene.addAction('setDepth',  { object: this.mapLayers.background2, depth: 50 });
      cutscene.addAction('wait', { duration: 500 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 291 });
      cutscene.addAction('wait', { duration: 2000 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });

    this.events.on('change_scene_scene2', () => {
      this.game.flags.setFlag(GameFlag.SCENE_1_TRAVERSED);
      this.events.removeListener('change_scene_scene2');
      const cutscene = new CutsceneManager(this);
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 9999 });
      cutscene.play();
      this.changeScene('Scene2', 300, { playerX: 32, playerY: 1864, playerDir: 'right' });
    });

    this.events.on('cutscene_rocket_1', () => {
      if (!this.game.flags.flag(GameFlag.ROCKET_NOFUEL_CUTSCENE_PLAYED)) {
        this.game.flags.setFlag(GameFlag.ROCKET_NOFUEL_CUTSCENE_PLAYED);
        const cutscene = new CutsceneManager(this);
        cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.25 });
        cutscene.addAction('openLetterbox', {});
        cutscene.addAction('wait', { duration: 1000 });
        cutscene.addAction('playerRunTo', { player: this.player, xTarget: 160 });
        cutscene.addAction('wait', { duration: 200 });
        cutscene.addAction('setDepth',  { object: this.rocket.getRocketBackSprite(), depth: 50 });
        cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 100 });
        cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: - 400, yTarget: 2048 - 550, duration: 800 });
        cutscene.addAction('playSound', { key: 'rocket_nofuel' });
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.rocket.getRocketSprite().anims.play('rocket_starting');
          this.rocket.getRocketBackSprite().visible = false;
          resolve();
        }});
        cutscene.addAction('wait', { duration: 1000 });
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.rocket.getSmokeParticles().emitters.each((emitter) => {
            emitter.setSpeed({ min: 100, max: 200 });
            emitter.setGravity(0, 500);
            emitter.setFrequency(250);
          });
          resolve();
        }});
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.rocket.getRocketSprite().anims.play('rocket_going');
          resolve();
        }});
        cutscene.addAction('wait', { duration: 2500 });
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.rocket.getSmokeParticles().emitters.each((emitter) => {
            emitter.setSpeed({ min: 10, max: 20 });
            emitter.setGravity(0, 100);
            emitter.setFrequency(500);
          });
          resolve();
        }});
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.rocket.getRocketSprite().anims.stop();
          this.rocket.getRocketBackSprite().visible = true;
          resolve();
        }});
        cutscene.addAction('wait', { duration: 1500 });
        cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 800 });
        cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 152 });
        cutscene.addAction('wait', { duration: 400 });
        cutscene.addAction('playerRunTo', { player: this.player, xTarget: 291 });
        cutscene.addAction('setDepth',  { object: this.rocket.getRocketBackSprite(), depth: 70 });
        cutscene.addAction('wait', { duration: 1000 });
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.markerController.removeMarkerById(11);
          resolve();
        }});
        cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
          this.markerController.addMarkerWithTextPlate((33 * CONST.SCALE) + 32, (462 * CONST.SCALE) - 64, 'This rocket needs to be\nrefueled. How annoying.', undefined);
          resolve();
        }});
        cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.75 });
        cutscene.addAction('closeLetterbox', {});
        cutscene.play();
      }
    });
  }
}
