import Phaser from "phaser";

const configuracion =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

function preload() {
    this.load.spritesheet('pj', 'pj/pj.png', { frameWidth: 32, frameHeight: 42 })
}

function create() {
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('pj', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1 // Loop
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('pj', { start: 4, end: 7 }),
        frameRate: 6,
        repeat: -1 // Loop
    });
    const playerIdle = this.add.sprite(32, 42, 'pj').setScale(2);
    const playerWalk = this.add.sprite(300, 100, 'pj').setScale(2);

    playerIdle.play('idle')
    playerWalk.play('walk');
}

function update() { }


export default function startGame(parent) {
    return new Phaser.Game({ ...configuracion, parent })
}

    // Movimiento horizontal
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.flipX = true;
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.flipX = false;
    }
    else {
        player.setVelocityX(0);
    }

    // Salto
    if (cursors.up.isDown && player.body.onFloor()) {
        player.setVelocityY(-330);
    }

    // ---- ANIMACIONES ----

    if (!player.body.onFloor()) {
        player.anims.play('jump', true);
    }
    else if (player.body.velocity.x !== 0) {
        player.anims.play('walk', true);
    }
    else {
        player.anims.play('idle', true);
    }