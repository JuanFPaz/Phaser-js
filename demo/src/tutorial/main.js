import Phaser from "phaser";

const config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'app'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
    roundPixels: true,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let bombs
let platforms
let player
let cursors
let stars
let score = 0
let scoreTxt
let gameOver = false

function preload() {
    this.load.image('background', '/assets/sky.png')
    this.load.image('ground', '/assets/platform.png')
    this.load.image('star', '/assets/star.png')
    this.load.image('bomb', '/assets/bomb.png')
    this.load.spritesheet('dude', '/assets/dude.png', { frameWidth: 32, frameHeight: 48 })
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0)
    platforms = this.physics.add.staticGroup(); // Fisicas Estaticas

    // platforms.create(0, config.height, 'ground').setOrigin(0, 1).setScale(2).refreshBody();
    // console.log(this.physics.world.eventNames())

    player = this.physics.add.sprite(100, 0, 'dude').refreshBody()//Fisicas Dinamicas
    player.setBounce(0.2);
    player.setGravityY(300)
    player.setCollideWorldBounds(true);
    player.body.onWorldBounds = true
    this.physics.world.on('worldbounds', (body, up, down, left, right) => {
        if (left) {
            body.setCollideWorldBounds(false);
            return
        }

        if (right) {
            body.setCollideWorldBounds(false);
            return
        }

        body.setCollideWorldBounds(true)
    })

    console.log(this.physics.world.eventNames())
    // Example: set the hitbox to be 14 pixels wide and 3 pixels high
    player.body.setSize(16, 40, false);
    // Example: offset the hitbox by 1 pixel horizontally and 2 pixels vertically
    player.body.setOffset(8, 8);
    this.anims.create({
        key: 'left',
        frames: [{ key: 'dude', frame: 0 }, { key: 'dude', frame: 1 }, { key: 'dude', frame: 2 }, { key: 'dude', frame: 3 }],
        // frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    console.log(player instanceof Phaser.Physics.Arcade.Sprite)
    console.log(player instanceof Phaser.Physics.Arcade.Body)

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    cursors = this.input.keyboard.createCursorKeys()
    stars = this.physics.add.group({
        key: 'star',
        repeat: 8,
        setXY: { x: 8, y: 0, stepX: 16 }
    }) // Fisicas Dinamicas
    console.log('plataforms:');

    console.log(platforms.children.entries)

    console.log('starsssss:');

    console.log(stars.getChildren())

    stars.children.entries.forEach((child) => {
        child.setBounceY(0.5)
    })

    stars.children.iterate((child) => {
        child.setBounceY(0.5)
    })
    // this.physics.add.collider(player, plataformaMovil,(player,plataformaMovil)=>{
    //     if(player.body.touching.down && plataformaMovil.body.touching.up){

    //     setTimeout(()=>{
    //         plataformaMovil.disableBody(true,true)
    //     },9000)
    //     }

    // },null,this);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    scoreTxt = this.add.text(16, 16, `Position = ${player.body.position.x}`, { fontSize: 16, fill: '#6d1010' })

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    // this.add.grid(0, 0, 4000, 2000, 32, 32, 0x000000, 0, 0xffffff, 0.5).setOrigin(0, 0);
}

function update() {
    this.physics.world.wrap(player, 8)


    if (gameOver) {
        if (cursors.left.isDown) {
            score = 0
            gameOver = false
            this.scene.restart()
        }
        return
    }

    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.body.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.body.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.body.setVelocityY(-330);
    }
    scoreTxt.setText(`Score = ${player.body.position.x}`)

}


function collectStar(player, star) {
    // star.disableBody(true, true)
    star.destroy()
    score += 10
    console.log(stars.getChildren());

    // if (stars.countActive(true) === 0) {
    //     stars.children.iterate(function (child) {

    //         child.enableBody(true, child.x, 0, true, true);

    //     });

    //     var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    //     var bomb = bombs.create(x, 16, 'bomb');
    //     bomb.setBounce(1);
    //     bomb.setCollideWorldBounds(true);
    //     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    // }
}

function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

export default function startGame() {
    return new Phaser.Game({ ...config, })
}