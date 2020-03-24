import { Control } from '../controllers/InputController';
import { SoundController } from '../controllers/SoundController';
import { GameplaySceneBase } from '../scenes/GameplaySceneBase';
import { CONST } from '../util/CONST';

export class Player extends Phaser.GameObjects.Container {
  protected scene!: GameplaySceneBase;
  private player!: Phaser.Physics.Matter.Sprite;
  private isGrounded: boolean = false;
  private actions: string[] = [];

  private readonly moveVelocity = 2;
  private readonly crawlVelocity = 1;
  private readonly jumpVelocity = 7;
  private readonly movementThreshold = 0.05;

  constructor(scene: GameplaySceneBase) {
    super(scene);

    // Create the player sprite
    this.player = this.scene.matter.add.sprite(CONST.ZERO, CONST.ZERO, 'player');
    this.player.setDepth(55);
    this.player.setBounce(CONST.ZERO);
    this.player.name = 'player';

    // @ts-ignore
    const M = Phaser.Physics.Matter.Matter;

    // Create the player's physics body.
    const floorSensor = M.Bodies.rectangle(0, 9, 4, 1, { isSensor: true, label: 'astronaut-floor' });
    const playerBody = M.Bodies.rectangle(0, 0, 8, 16, { chamfer: { radius: 2 }, label: 'astronaut' });
    const compoundBody =  M.Body.create({
      parts: [
        playerBody, floorSensor,
      ],
      friction: CONST.ZERO,
      restitution: 0.05, // Prevent body from sticking against a wall
    });

    // Add physics to the player.
    this.player.setExistingBody(compoundBody);
    this.player.setOrigin(0.5, 0.75);
    this.player.setPosition(551, 1889);
    this.player.flipX = true;
    this.player.setScale(CONST.SCALE);
    this.player.setFixedRotation();

    // Add player to scene.
    this.scene.add.existing(this.player);
    this.scene.add.existing(this);

    // This variable is used during collisions to occasionally
    // set the player's position manually.
    const position = { x: 0, y: 0 };

    // Collisions.
    this.scene.matter.world.on('beforeupdate', (event: any) => {
      this.isGrounded = false;
      position.x = this.player.x;
      position.y = this.player.y;
    });

    this.scene.matter.world.on('collisionactive', (event: any) => {
      for (let i = 0; i < event.pairs.length; i++) {
        const bodyA = event.pairs[i].bodyA;
        const bodyB = event.pairs[i].bodyB;

        // Can't be grounded on sensors.
        const isRelevantCollision = (bodyA.label === floorSensor.label) ? !bodyB.isSensor : !bodyA.isSensor;

        // Is the player colliding with something below it?
        if ((bodyA.label === floorSensor.label || bodyB.label === floorSensor.label) && isRelevantCollision) {
          this.isGrounded = true;
        }
      }
    });

    this.scene.matter.world.on('afterupdate', (event: any) => {
      if (!this.isDoingAction('left') && !this.isDoingAction('right') && !this.isDoingAction('jump')) {
        this.player.setPosition(position.x, this.player.y);
        this.player.setVelocityX(CONST.ZERO);
        if (this.isGrounded) {
          this.player.setVelocityY(CONST.ZERO);
          this.player.setPosition(position.x, position.y);
        }
      }

      // Figure out animation.
      let anim = 'idle';
      if (this.isGrounded && Math.abs(this.player.body.velocity.x) > this.movementThreshold && this.isDoingAction('crawl')) {
        SoundController.getSound('audio_walk').stop();
        SoundController.play('audio_crawl', true);
        anim = 'crawl';
      } else if (this.isGrounded && Math.abs(this.player.body.velocity.x) > this.movementThreshold) {
        SoundController.play('audio_walk', true);
        SoundController.getSound('audio_crawl').stop();
        anim = 'walk';
      } else if (!this.isGrounded) {
        SoundController.getSound('audio_walk').stop();
        SoundController.getSound('audio_crawl').stop();
        anim = 'jump';
      } else {
        SoundController.getSound('audio_walk').stop();
        SoundController.getSound('audio_crawl').stop();
      }
      this.player.anims.play(anim, true);

      // Reset actions.
      this.actions = [];
    });

    // Debug.
    if (CONST.DEBUG) {
      this.scene.addDebugBoolean(this, 'isGrounded');
    }
  }

  public preUpdate(time: number, delta: number) {
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

  public jump() {
    this.actions.push('jump');
    SoundController.getSound('audio_jump').play();
    this.player.setVelocityY(this.jumpVelocity * CONST.NEGATIVE);
  }

  public moveLeft() {
    this.actions.push('left');
    this.player.setVelocityX(this.moveVelocity * CONST.NEGATIVE);
    this.player.flipX = false;
  }

  public moveRight() {
    this.actions.push('right');
    this.player.setVelocityX(this.moveVelocity);
    this.player.flipX = true;
  }

  public crawlLeft() {
    this.actions.push('left');
    this.actions.push('crawl');
    this.player.setVelocityX(this.crawlVelocity * CONST.NEGATIVE);
    this.player.flipX = false;
  }

  public crawlRight() {
    this.actions.push('right');
    this.actions.push('crawl');
    this.player.setVelocityX(this.crawlVelocity);
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
