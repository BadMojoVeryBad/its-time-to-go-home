import { resolve } from '../../node_modules/bluebird-lst/index';
import { GameplayCamera } from '../cameras/GameplayCamera';
import { CutsceneController } from '../controllers/CutsceneController';
import { Player } from '../sprites/Player';
import { Rocks } from '../sprites/Rocks';
import { GameplaySceneBase } from './GameplaySceneBase';

export class Scene2 extends GameplaySceneBase {
  private rocks?: Rocks;

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

    // Setup the events/cutscenes this scene has.
    this.setupCutscenes();

    // Create a new main camera that we can control.
    new GameplayCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);

    // Rock.
    const rocks = this.map.getObjectLayer('rocks').objects;
    rocks.forEach((rock: Phaser.Types.Tilemaps.TiledObject) => {
      this.rocks = new Rocks(this, rock.x, rock.y);
    });
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
      cutscene.addAction('soundVolume', { key: 'audio_music_2', volume: 0.25 });
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
      cutscene.addAction('soundVolume', { key: 'audio_music_2', volume: 0.75 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });
  }
}
