import { GameplayCamera } from '../cameras/GameplayCamera';
import { CutsceneController } from '../controllers/CutsceneController';
import { Rocks } from '../sprites/Rocks';
import { GameplaySceneBase } from './GameplaySceneBase';
import { GameFlag } from '../util/GameFlags';
import { Pump } from '../sprites/Pump.ts';
import { Tank } from '../sprites/Tank';
import { CONST } from '../util/CONST.ts';
import { Button } from '../sprites/Button.ts';
import { AudioManager } from '../controllers/audio/AudioManager';

export class Scene2 extends GameplaySceneBase {
  private rocks?: Rocks;
  private pump?: Pump;
  private tank?: Tank;
  private button?: Button;

  constructor() {
    super({ key: 'Scene2' });
  }

  public preload() {
    super.preload();
  }

  public create() {
    super.create();

    // Set up some stuff the base scene gives us.
    this.setupTransitionEvents();

    // Setup the map.
    this.setupTiles('map2');
    this.setupImages();
    this.setupMarkers();
    this.setupEvents();
    this.setupLadders();

    // Setup the events/cutscenes this scene has.
    this.setupCutscenes();

    // Create a new main camera that we can control.
    new GameplayCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);

    // Rock.
    const rocks = this.map.getObjectLayer('rocks').objects;
    rocks.forEach((rock: Phaser.Types.Tilemaps.TiledObject) => {
      this.rocks = new Rocks(this, rock.x, rock.y);
    });

    // Pump.
    const pumps = this.map.getObjectLayer('pump').objects;
    pumps.forEach((pump: Phaser.Types.Tilemaps.TiledObject) => {
      this.pump = new Pump(this, pump.x, pump.y);
      this.pump.setDepth(60);
    });

    // Button.
    const buttons = this.map.getObjectLayer('button').objects;
    buttons.forEach((button: Phaser.Types.Tilemaps.TiledObject) => {
      this.button = new Button(this, button.x * CONST.SCALE, button.y * CONST.SCALE);
      this.button.setDepth(83);
    });

    // Tank.
    const tanks = this.map.getObjectLayer('tank').objects;
    tanks.forEach((tank: Phaser.Types.Tilemaps.TiledObject) => {
      this.tank = new Tank(this, tank.x * CONST.SCALE, tank.y * CONST.SCALE);
      this.tank.setDepth(84);
    });

    AudioManager.play('music_2');
  }

  private setupCutscenes() {
    this.events.on('change_scene_scene1', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: -9999 });
      cutscene.play();
      this.events.removeListener('change_scene_scene1');
      this.changeScene('MainScene', 300, { playerX: 1864, playerY: 1864, playerDir: 'left' });
    });

    this.events.on('cutscene_rocks', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.25 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 480 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 485 });
      cutscene.addAction('wait', { duration: 500 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.rocks.playAnimation();
        resolve();
      }});
      cutscene.addAction('wait', { duration: 3500 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.removeMarkerById(20);
        resolve();
      }});
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.addMarkerWithTextPlate(544, 1716, 'It seems these moon\nrocks are quite shy.', undefined);
        resolve();
      }});
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.75 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });

    this.events.on('climb_ladder', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.25 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('playerClimbLadder', { player: this.player, ladder: this.ladders[0] });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.removeMarkerById(23);
        resolve();
      }});
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.addMarkerWithTextPlate(1472 + 32, 1676 - 64, 'You\'ve already climbed\nthis ladder. Good work!', undefined);
        resolve();
      }});
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        let marker = this.markerController.getMarkerById(21);
        marker?.setEnabled(true);
        resolve();
      }});
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.75 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });

    this.events.on('press_button', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.25 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 1665 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 1670 });
      cutscene.addAction('wait', { duration: 500 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.button.pressButton();
        resolve();
      }});
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.player.button();
        resolve();
      }});
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.tank?.startTank();
        resolve();
      }});
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 1000, yTarget: 1300, duration: 4000 });
      cutscene.addAction('wait', { duration: 100 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.pump?.startPump();
        resolve();
      }});
      cutscene.addAction('wait', { duration: 2900 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, duration: 1400, follow: this.player.getSprite() });
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.removeMarkerById(21);
        this.markerController.addMarkerWithTextPlate(1656 + 32, 1648 - 64, 'The fuel is flowing.\nLook at it go!', undefined);
        resolve();
      }});
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.75 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });

    this.events.on('cutscene_stargaze', () => {
      this.game.flags.setFlag(GameFlag.STARGAZE_CUTSCENE_PLAYED);
      const cutscene = new CutsceneController(this);
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('wait', { duration: 400 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        AudioManager.play('music_3');
        resolve();
      }});
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 1166 });
      cutscene.addAction('wait', { duration: 1200 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.player.sit();
        resolve();
      }});
      cutscene.addAction('wait', { duration: 1800 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 550, yTarget: 1100, duration: 8000 });
      cutscene.addAction('wait', { duration: 1200 });
      cutscene.addAction('drawText', { text: 'It\'s time', x: 700, y: 1300, fadeAfter: 8700 });
      cutscene.addAction('wait', { duration: 900 });
      cutscene.addAction('drawText', { text: 'to go home.', x: 700, y: 1380, fadeAfter: 7500 });
      cutscene.addAction('wait', { duration: 1800 });
      cutscene.addAction('drawText', { text: 'Are you ready?', x: 700, y: 1460, duration: 1600, color: 'red', fadeAfter: 5500 });
      cutscene.addAction('wait', { duration: 5000 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 4000 });
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.player.stand();
        resolve();
      }});
      cutscene.addAction('wait', { duration: 2000 });
      cutscene.addAction('playerJump', { player: this.player });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 1000 });
      cutscene.addAction('wait', { duration: 800 });
      cutscene.addAction('soundVolume', { key: 'music_2', volume: 0.75 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });
  }
}
