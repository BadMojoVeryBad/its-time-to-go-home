import { GameplayCamera } from '../cameras/GameplayCamera';
import { Player } from '../sprites/Player';
import { GameplaySceneBase } from './GameplaySceneBase';

export class Scene2 extends GameplaySceneBase {
  private player!: Player;

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
    this.setupInputs();

    // Setup the map.
    this.setupTiles('map2');
    this.setupImages();
    this.setupMarkers();
    this.setupEvents();

    // Setup the events/cutscenes this scene has.
    this.setupCutscenes();

    // Make the player object.
    this.player = new Player(this);

    // Create a new main camera that we can control.
    new GameplayCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);
  }

  private setupCutscenes() {
    this.events.on('change_scene_scene1', () => {
      this.events.removeListener('change_scene_scene1');
      this.changeScene('MainScene', 300);
    });
  }
}
