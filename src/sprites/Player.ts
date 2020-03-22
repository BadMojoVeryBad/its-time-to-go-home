import { CutsceneController } from '../controllers/CutsceneController';
import { Control } from '../controllers/InputController';
import { SceneBase } from '../scenes/SceneBase';

export class Player extends Phaser.GameObjects.Container {
  protected scene: SceneBase;
  private player!: Phaser.Physics.Matter.Sprite;
  private compoundBody!: any;
  private playerBody!: any;
  private floorSensor!: any;
  private isGrounded: boolean = false;
  private position: any = { x: 0, y: 0 };
  private actions: string[] = [];

  constructor(scene: SceneBase) {
    super(scene);
    this.scene = scene;
    scene.sys.updateList.add(this);

    // create the player sprite
    this.player = this.scene.matter.add.sprite(0, 0, 'player');
    this.player.setDepth(55);
    this.player.setBounce(0);
    this.player.name = 'player';

    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;

    this.floorSensor = M.Bodies.rectangle(0, 9, 4, 1, { isSensor: true, label: 'astronaut-floor' });
    this.playerBody = M.Bodies.rectangle(0, 0, 8, 16, { chamfer: { radius: 2 }, label: 'astronaut' });
    this.compoundBody =  M.Body.create({
      parts: [
        this.playerBody, this.floorSensor,
      ],
      friction: 0,
      restitution: 0.05 // Prevent body from sticking against a wall
    });

    this.player.setExistingBody(this.compoundBody);
    this.player.setOrigin(0.5, 0.75);
    this.player.setPosition(551, 1889);
    this.player.flipX = true;
    this.player.setScale(4);
    this.player.setFixedRotation();

    // Collisions.
    this.scene.matter.world.on('beforeupdate', (event: any) => {
      this.isGrounded = false;
      this.position.x = this.player.x;
      this.position.y = this.player.y;
    });

    this.scene.matter.world.on('collisionactive', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;

        // Can't be grounded on sensors.
        const isRelevantCollision = (bodyA.label === this.floorSensor.label) ? !bodyB.isSensor : !bodyA.isSensor;

        // Is the player colliding with something below it?
        if ((bodyA.label === this.floorSensor.label || bodyB.label === this.floorSensor.label) && isRelevantCollision) {
          this.isGrounded = true;
        }
      }
    });

    this.scene.matter.world.on('afterupdate', (event: any) => {
      if (!this.isDoingAction('left') && !this.isDoingAction('right') && !this.isDoingAction('jump')) {
        this.player.setPosition(this.position.x, this.player.y);
        this.player.setVelocityX(0);
        if (this.isGrounded) {
          this.player.setVelocityY(0);
          this.player.setPosition(this.position.x, this.position.y);
        }
      }

      // Figure out animation.
      let anim = 'idle';
      if (this.isGrounded && Math.abs(this.player.body.velocity.x) > 0.05 && this.isDoingAction('crawl')) {
        anim = 'crawl';
      } else if (this.isGrounded && Math.abs(this.player.body.velocity.x) > 0.05) {
        anim = 'walk';
      } else if (!this.isGrounded) {
        anim = 'jump';
      }
      this.player.anims.play(anim, true);

      // Reset actions.
      this.actions = [];
    });
  }

  public preUpdate() {
    // Do input.
    if (!CutsceneController.isInCutscene()) {
      // Left and right input.
      if (this.scene.inputController.isPressed(Control.Left)) {
        this.moveLeft();
      } else if (this.scene.inputController.isPressed(Control.Right)) {
        this.moveRight();
      }

      // Jump input.
      if (this.scene.inputController.isPressed(Control.Jump) && this.isGrounded) {
        this.jump();
      }
    }
  }

  public jump() {
    this.actions.push('jump');
    this.player.setVelocityY(-7);
  }

  public moveLeft() {
    this.actions.push('left');
    this.player.setVelocityX(-2);
    this.player.flipX = false;
  }

  public moveRight() {
    this.actions.push('right');
    this.player.setVelocityX(2);
    this.player.flipX = true;
  }

  public crawlLeft() {
    this.actions.push('left');
    this.actions.push('crawl');
    this.player.setVelocityX(-1);
    this.player.flipX = false;
  }

  public crawlRight() {
    this.actions.push('right');
    this.actions.push('crawl');
    this.player.setVelocityX(1);
    this.player.flipX = true;
  }

  public getSprite() {
    return this.player;
  }

  private isDoingAction(action: string) {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i] === action) {
        return true;
      }
    }

    return false;
  }
}
