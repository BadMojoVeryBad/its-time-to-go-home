import 'phaser';

export class Player extends Phaser.GameObjects.Container {
  private player!: Phaser.Physics.Matter.Sprite;
  private cursors!: Phaser.Input.Keyboard.CursorKeys;
  private onFloor:boolean = false;

  private compoundBody!: any;
  private playerBody!: any;
  private floorSensor!: any;
  private isGrounded: boolean = false;
  private position:any = { x: 0, y:0 };

  constructor(scene: Phaser.Scene, ground:Phaser.Tilemaps.DynamicTilemapLayer) {
    super(scene);
    this.scene = scene;

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
      friction: 0.01,
      restitution: 0.05, // Prevent body from sticking against a wall
      render: {
        sprite: {
          yOffset: 0.25
        }
      }
    });

    this.player.setExistingBody(this.compoundBody)
    this.player.setPosition(100, 550);
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
      if (!this.cursors.left!.isDown && !this.cursors.right!.isDown && this.isGrounded) {
        this.player.setPosition(this.position.x, this.position.y);
      }
    });
  }

  public updatePlayer() {
    if (this.cursors.left!.isDown) // if the left arrow key is down
    {
      this.player.setVelocityX(-2); // move left
      this.player.body
      this.player.anims.play('walk', true); // play walk animation
      this.player.flipX = false; // flip the sprite to the left
    }
    else if (this.cursors.right!.isDown) // if the right arrow key is down
    {
      this.player.setVelocityX(2); // move right
      this.player.anims.play('walk', true); // play walk animation
      this.player.flipX = true; // flip the sprite to the left
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }

    if ((this.cursors.space!.isDown || this.cursors.up!.isDown) && this.isGrounded)
    {
      this.player.setVelocityY(-7); // jump up
      this.player.anims.play('idle', true);
      this.onFloor = false;
    }

    // If the player is on the ground and no input is given, it should not be moving.
    if (!this.cursors.left!.isDown && !this.cursors.right!.isDown && this.isGrounded) {
      this.player.setVelocityX(0);
      this.player.setVelocityY(0);
    }
  }

  public getSprite() {
    return this.player;
  }
}
