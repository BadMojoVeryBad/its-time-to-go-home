import { GameplayCamera } from '../cameras/GameplayCamera';
import { CutsceneController } from '../controllers/CutsceneController';
import { Player } from '../sprites/Player';
import { Rocket } from '../sprites/Rocket';
import { CONST } from '../util/CONST';
import { GameplaySceneBase } from './GameplaySceneBase';
import { BlurShader } from '../shaders/BlurShader';

export class MainScene extends GameplaySceneBase {
  private player!: Player;
  private rocket!: Rocket;
  private customPipeline: any;

  constructor() {
    super({ key: 'MainScene' });
  }

  public preload() {
    super.preload();

    // @ts-ignore
    this.customPipeline = this.game.renderer.addPipeline('CustomPipeline', new BlurShader(this));
    this.customPipeline.setFloat1('resolution', this.gameWidth);
    this.customPipeline.setFloat1('radius', 0);
    this.customPipeline.setFloat2('dir', 1, 1);
  }

  public create() {
    super.create();

    // Set up some stuff the base scene gives us.
    this.setupTransitionEvents();
    this.setupInputs();

    // Setup the map.
    this.setupTiles();
    this.setupImages();
    this.setupMarkers();

    // Setup the events/cutscenes this scene has.
    this.setupCutscenes();

    // Earth.
    const earth: Phaser.GameObjects.Sprite = this.add.sprite(150, 650, 'player', 'earth0001');
    earth.setOrigin(0.5, 0.5);
    earth.setPosition(150 + 550, 600 + 300);
    earth.play('earth');
    earth.setScale(CONST.SCALE);
    earth.setDepth(31);

    // Make the player object.
    this.player = new Player(this);

    // Create a new main camera that we can control.
    let cam = new GameplayCamera(this, this.player.getSprite(), 0, 0, this.gameWidth, this.gameHeight);

    // Add rocket.
    const rockets = this.map.getObjectLayer('rocket').objects;
    rockets.forEach((obj) => {
      this.rocket = new Rocket(this, obj.x, obj.y);
    });

    // Start the opening cutscene as soon as the scene loads.
    this.events.emit('cutscene_opening');
  }

  private setupCutscenes() {
    this.events.on('cutscene_opening', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 150, yTarget: 600, duration: 0 });
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('setDepth',  { object: this.mapLayers.background2, depth: 59 });
      cutscene.addAction('wait', { duration: 1600 });
      cutscene.addAction('drawText', { text: 'It\'s Time', x: 150 + 200, y: 600 + 240 });
      cutscene.addAction('drawText', { text: 'To Go', x: 150 + 200, y: 600 + 280 });
      cutscene.addAction('drawText', { text: 'Home.', x: 150 + 200, y: 600 + 320 });
      cutscene.addAction('wait', { duration: 3200 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 3200 });
      cutscene.addAction('wait', { duration: 1600 });
      cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 691 });
      cutscene.addAction('setDepth',  { object: this.mapLayers.background2, depth: 50 });
      cutscene.addAction('wait', { duration: 400 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 291 });
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });

    this.events.on('cutscene_rocket_1', () => {
      const cutscene = new CutsceneController(this);
      cutscene.addAction('openLetterbox', {});
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 160 });
      cutscene.addAction('wait', { duration: 200 });
      cutscene.addAction('setDepth',  { object: this.rocket.getRocketBackSprite(), depth: 50 });
      cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 100 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: - 400, yTarget: 2048 - 550, duration: 800 });
      cutscene.addAction('wait', { duration: 5000 });
      cutscene.addAction('moveCameraTo', { camera: this.cameras.main, xTarget: 0, yTarget: 0, follow: this.player.getSprite(), duration: 800 });
      cutscene.addAction('playerCrawlTo',  { player: this.player, xTarget: 152 });
      cutscene.addAction('wait', { duration: 400 });
      cutscene.addAction('playerRunTo', { player: this.player, xTarget: 291 });
      cutscene.addAction('setDepth',  { object: this.rocket.getRocketBackSprite(), depth: 70 });
      cutscene.addAction('wait', { duration: 1000 });
      cutscene.addAction('removeObject', { object: this.markerController.getMarkerById(11)?.getSprite() });
      cutscene.addAction('customFunction', { fn: (resolve: () => void) => {
        this.markerController.addMarkerWithTextPlate((33 * CONST.SCALE) + 32, (462 * CONST.SCALE) - 64, 'This rocket needs to be\nrefueled. How annoying.', undefined);
        resolve();
      }});
      cutscene.addAction('closeLetterbox', {});
      cutscene.play();
    });
  }
}
