import { CutsceneController } from '../controllers/CutsceneController';

export class Player extends Phaser.GameObjects.Container {
  private player!: Phaser.Physics.Matter.Sprite;
  private cursors!: Phaser.Input.Keyboard.CursorKeys;
  private compoundBody!: any;
  private playerBody!: any;
  private floorSensor!: any;
  private isGrounded: boolean = false;
  private position: any = { x: 0, y:0 };
  private actions: Array<string> = [];

  constructor(scene: Phaser.Scene, ground:Phaser.Tilemaps.DynamicTilemapLayer) {
    super(scene);
    this.scene = scene;
    scene.sys.updateList.add(this);

    // create the player sprite
    this.player = this.scene.matter.add.sprite(0, 0, 'player');
    this.player.setBounce(0);
    this.player.name = "player";

    // @ts-ignore
    let M = Phaser.Physics.Matter.Matter;

    this.floorSensor = M.Bodies.rectangle(0, 16.5, 4, 1, { isSensor: true, label: 'astronaut-floor' });
    this.playerBody = M.Bodies.rectangle(0, 8, 8, 16, { chamfer: { radius: 2 }, label: 'astronaut' });
    this.compoundBody =  M.Body.create({
      parts: [
        this.playerBody, this.floorSensor
      ],
      friction: 0,
      restitution: 0.05, // Prevent body from sticking against a wall
      render: {
        sprite: {
          yOffset: 0.25
        }
      }
    });

    this.player.setExistingBody(this.compoundBody)
    this.player.setPosition(300, 609);
    this.player.flipX = true;
    this.player.setScale(4);
    this.player.setFixedRotation();

    // Animations.
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'Untitled-1', start: 0, end: 5, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'Untitled-1', start: 0, end: 0, zeroPad: 4 }),
      frameRate: 1,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'jump',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'astronaut-jump', start: 0, end: 2, zeroPad: 4 }),
      frameRate: 12,
      repeat: -1
    });

    // Inputs.
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Collisions.
    this.scene.matter.world.on('beforeupdate', (event:any) => {
      this.isGrounded = false;
      this.position.x = this.player.x;
      this.position.y = this.player.y;
    });

    this.scene.matter.world.on('collisionactive', (event:any) =>
    {
      for (let i = 0; i < event.pairs.length; i++)
      {
        let bodyA = event.pairs[i].bodyA;
        let bodyB = event.pairs[i].bodyB;

        // Can't be grounded on sensors.
        let isRelevantCollision = (bodyA.label === this.floorSensor.label) ? !bodyB.isSensor : !bodyA.isSensor;

        // Is the player colliding with something below it?
        if ((bodyA.label === this.floorSensor.label || bodyB.label === this.floorSensor.label) && isRelevantCollision) {
          this.isGrounded = true;
        }
      }
    });

    this.scene.matter.world.on('afterupdate', (event:any) => {
      if (!this.isDoingAction('left') && !this.isDoingAction('right') && !this.isDoingAction('jump') && this.isGrounded) {
        this.player.setPosition(this.position.x, this.position.y);
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
      }

      // Reset actions.
      this.actions = [];
    });
  }

  public preUpdate () {
    // Do input.
    if (!CutsceneController.isInCutscene()) {
      // Left and right input.
      if (this.cursors.left.isDown) {
        this.moveLeft();
      } else if (this.cursors.right.isDown) {
        this.moveRight();
      }

      // Jump input.
      if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.isGrounded) {
        this.jump();
      }
    }

    // Figure out animation.
    let anim = 'idle';
    if (this.isGrounded && Math.abs(this.player.body.velocity.x) > 0.05) {
      anim = 'walk';
    } else if (!this.isGrounded) {
      anim = 'jump';
    }
    this.player.anims.play(anim, true);
  }

  private isDoingAction (action: string) {
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i] === action) {
        return true;
      }
    }

    return false;
  }

  public jump () {
    this.actions.push('jump');
    this.player.setVelocityY(-7);
  }

  public moveLeft () {
    this.actions.push('left');
    this.player.setVelocityX(-2);
    this.player.flipX = false;
  }

  public moveRight () {
    this.actions.push('right');
    this.player.setVelocityX(2);
    this.player.flipX = true;
  }

  public getSprite () {
    return this.player;
  }
}
