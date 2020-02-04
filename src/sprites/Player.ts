import 'phaser';

export class Player extends Phaser.GameObjects.Container {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, ground:Phaser.Tilemaps.DynamicTilemapLayer, coins:Phaser.Tilemaps.DynamicTilemapLayer) {
    super(scene);
    this.scene = scene;
    
    // create the player sprite    
    this.player = this.scene.physics.add.sprite(200, 200, 'player'); 
    this.player.setBounce(0.2); // our player will bounce from items
    this.player.setCollideWorldBounds(true); // don't go out of the map

    // Animations.
    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2 }),
      frameRate: 10,
      repeat: -1
    });
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('player', { prefix: 'p1_walk', start: 1, end: 1, zeroPad: 2 }),
      frameRate: 1,
      repeat: -1
    });

    // Inputs.
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Collisions.
    this.scene.physics.add.collider(ground, this.player);
    this.scene.physics.add.overlap(coins, this.player);
  }

  public updatePlayer() {
    if (this.cursors.left!.isDown) // if the left arrow key is down
    {
      this.player.body.setVelocityX(-200); // move left
      this.player.anims.play('walk', true); // play walk animation
      this.player.flipX= true; // flip the sprite to the left
    }
    else if (this.cursors.right!.isDown) // if the right arrow key is down
    {
      this.player.body.setVelocityX(200); // move right
      this.player.anims.play('walk', true); // play walk animation
      this.player.flipX= false; // flip the sprite to the left
    } else {
      this.player.body.setVelocityX(0);
      this.player.anims.play('idle', true);
    }  

    if ((this.cursors.space!.isDown || this.cursors.up!.isDown) && this.player.body.onFloor())
    {
      this.player.body.setVelocityY(-500); // jump up
      this.player.anims.play('idle', true);
    }
  }

  public getSprite() {
    return this.player;
  }
}