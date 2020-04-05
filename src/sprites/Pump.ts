import { AudioManager } from '../controllers/audio/AudioManager.ts';
import { GameplaySceneBase } from '../scenes/GameplaySceneBase.ts';
import { CONST } from '../util/CONST.ts';

export class Pump extends Phaser.GameObjects.Container {
  protected scene!: GameplaySceneBase;

  private pumpBase: Phaser.GameObjects.Sprite;
  private pumpTop: Phaser.GameObjects.Sprite;
  private pumpMask: Phaser.GameObjects.Image;
  private physicsContainer: any;

  private initPosition: {};

  constructor(scene: GameplaySceneBase, x: number, y: number) {
    super(scene);
    scene.add.existing(this);

    const widthHalf = this.scene.textures.get('player').get('fuel-pump-base').width * CONST.SCALE / 2;
    this.pumpBase = new Phaser.GameObjects.Sprite(this.scene, x * CONST.SCALE + widthHalf, y * CONST.SCALE - widthHalf, 'player', 'fuel-pump-base');
    this.pumpTop = new Phaser.GameObjects.Sprite(this.scene, x * CONST.SCALE + widthHalf, y * CONST.SCALE - widthHalf + 48, 'player', 'fuel-pump-top');

    this.initPosition = {
      x: x * CONST.SCALE + widthHalf,
      y: y * CONST.SCALE - widthHalf,
    };

    this.add(this.pumpTop);
    this.add(this.pumpBase);

    this.pumpBase.setDepth(1);
    this.pumpBase.setScale(CONST.SCALE);
    this.pumpTop.setDepth(2);
    this.pumpTop.setScale(CONST.SCALE);

    this.setPosition(0, 0);

    this.pumpMask = this.scene.add.image(x * CONST.SCALE + widthHalf, y * CONST.SCALE - widthHalf, 'player', 'fuel-pump-mask');
    this.pumpMask.setScale(CONST.SCALE);

    const g = this.scene.add.graphics();
    g.setVisible(false);
    g.fillStyle(0xffffff, 1);
    g.fillRect(x * CONST.SCALE, y * CONST.SCALE - 64, 64, 64);
    g.setDepth(999);
    this.setMask(g.createGeometryMask());

    const obj = new Phaser.Physics.Matter.Sprite(this.scene.matter.world, x * CONST.SCALE + widthHalf, y * CONST.SCALE - widthHalf, 'player', 'fuel-pump-top').setVisible(false);
    obj.setOrigin(0, 1);
    obj.setStatic(true);
    obj.setDepth(3);
    this.add(obj);

    obj.setScale(4);
    obj.body.position.x += 0;
    obj.body.position.y += widthHalf;
    obj.body.positionPrev.x += 0;
    obj.body.positionPrev.y += widthHalf;
    obj.setScale(4, 1);

    this.physicsContainer = obj;

    AudioManager.addSpatialSound(this.scene, 'fuel_pump_spatial', 'fuel_pump_mp3', this.scene.player.getSprite(), {
      loop: true,
      volume: 0.25,
    }, x * CONST.SCALE + widthHalf, y * CONST.SCALE - widthHalf, 400);
  }

  public preUpdate(time: number, delta: number) {
  }

  public startPump() {
    const timeline = this.scene.tweens.timeline();
    timeline.add({
      targets: this.pumpTop,
      y: { from: this.initPosition.y + 48, to: this.initPosition.y },
      yoyo: false,
      duration: 400,
      repeat: 0,
      delay: 400,
    });
    timeline.add({
      targets: this.pumpTop,
      y: { from: this.initPosition.y, to: this.initPosition.y + 48 },
      yoyo: false,
      duration: 400,
      repeat: 0,
      delay: 400,
    });
    timeline.loop = -1;
    timeline.play();

    const timeline2 = this.scene.tweens.timeline();
    timeline2.add({
      targets: this.physicsContainer,
      scaleY: { from: 1, to: 4 },
      yoyo: false,
      duration: 400,
      repeat: 0,
      delay: 400,
    });
    timeline2.add({
      targets: this.physicsContainer,
      scaleY: { from: 4, to: 1 },
      yoyo: false,
      duration: 400,
      repeat: 0,
      delay: 400,
    });
    timeline2.loop = -1;
    timeline2.play();

    this.scene.time.delayedCall(400, () => {
      AudioManager.play('fuel_pump_spatial');
    });
  }

  public stopPump() {

  }
}
