import Phaser from "phaser";

class Personaje extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y){
        super(scene,x,y,'player')
        this.setCollideWorldBounds(true)
    }

    update(){

    }
}

class LevelUno extends Phaser.Scene {
    plataformas
    terrazas
    pilares
    moviles = []
    posCheck = [{ posInit: 1888, posEnd: 2112 }, { posInit: 2112, posEnd: 2336 }, { posInit: 2336, posEnd: 2560 }]
    player
    control
    clock
    timeTxt
    pos
    textoPosition
    timer
    checkIsDown = false

    animaciones
    constructor() {
        super('level1')

        this.animaciones = new Phaser.Animations.AnimationManager()
    }

    preload() {
        this.load.image('fondo', '/assets-2/fondo-2560x320.png')
        this.load.image('plataform-1', '/assets-2/plataforma-448x32.png')
        this.load.image('plataform-2', '/assets-2/plataforma-160x32.png')

        this.load.image('terraza-1', '/assets-2/terraza-320x32.png')
        this.load.image('terraza-2', '/assets-2/terraza-192x32.png')
        this.load.image('terraza-3', '/assets-2/terraza-64x32.png')

        this.load.image('pilar-1', '/assets-2/pilar-32x96.png')
        this.load.image('pilar-2', '/assets-2/pilar-32x160.png')
        this.load.image('pilar-3', '/assets-2/pilar-32x224.png')

        this.load.image('plat-movil', '/assets-2/movil-96x32.png')

        this.load.spritesheet('pj', '/assets-2/pj-128x84.png', { frameWidth: 32, frameHeight: 42 })
    }
    create() {
        this.physics.world.setBounds(0, 0, 2560, 320)
        this.cameras.main.setBounds(0, 0, 2560, 320)

        this.add.image(0, 0, 'fondo').setOrigin(0, 0)

        this.plataformas = this.physics.add.staticGroup()
        this.plataformas.create(0, 320, 'plataform-1').setOrigin(0, 1).refreshBody()
        this.plataformas.create(544, 320, 'plataform-1').setOrigin(0, 1).refreshBody()
        this.plataformas.create(1696, 320, 'plataform-2').setOrigin(0, 1).refreshBody()

        this.terrazas = this.physics.add.staticGroup()
        this.terrazas.create(608, 288, 'terraza-1').setOrigin(0, 1).refreshBody()
        this.terrazas.create(672, 256, 'terraza-2').setOrigin(0, 1).refreshBody()
        this.terrazas.create(736, 224, 'terraza-3').setOrigin(0, 1).refreshBody()

        this.pilares = this.physics.add.staticGroup()
        this.pilares.create(1088, 320, 'pilar-1').setOrigin(0, 1).refreshBody()
        this.pilares.create(1216, 320, 'pilar-2').setOrigin(0, 1).refreshBody()
        this.pilares.create(1344, 320, 'pilar-3').setOrigin(0, 1).refreshBody()
        this.pilares.create(1472, 320, 'pilar-2').setOrigin(0, 1).refreshBody()
        this.pilares.create(1568, 320, 'pilar-1').setOrigin(0, 1).refreshBody()


        this.pilares.children.iterate((child)=>{})
        //Ahoora
        this.moviles.push(this.physics.add.image(1888, 256, 'plat-movil').setOrigin(0, 1).setImmovable(true).setGravityY(0))
        this.moviles.push(this.physics.add.image(2336, 224, 'plat-movil').setOrigin(0, 1).setImmovable(true).setGravityY(0))
        this.moviles.push(this.physics.add.image(2560, 192, 'plat-movil').setOrigin(0, 1).setImmovable(true).setGravityY(0))

        this.moviles.forEach(mov => {
            mov.body.allowGravity = false
        })

        this.player = this.physics.add.sprite(1800, 96, 'pj').setOrigin(0, 0).refreshBody().setCol
        this.player.setGravityY(350)
        this.player.setCollideWorldBounds(true, null, null, true)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers("pj", { start: 0, end: 3 }),
            frameRate: 6,
            repeate: -1
        })

        this.animaciones.create(

        )
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers("pj", { start: 4, end: 7 }),
            frameRate: 10,
            repeate: -1
        })


        this.miau = this.physics.add.group()
        this.cameras.main.startFollow(this.player)

        this.physics.add.collider(this.player, this.plataformas)
        this.physics.add.collider(this.player, this.pilares)
        this.physics.add.collider(this.player, this.moviles)
        this.physics.world.addListener('miau',()=>{})
        this.physics.world.on('worldbounds', () => {
            console.log(body);
            console.log(down);

            if (down) {
                body.position.x = 1800
                body.position.y = 96
            }
        })
        this.control = this.input.keyboard.createCursorKeys()

        this.clock = 10
        this.timeTxt = this.add.text(0, 0, `Time = ${this.clock}`, { fontSize: 16, fill: '#f7f7f7' }).setOrigin(0, 0).setScrollFactor(0)
        this.textoPosition = this.add.text(20, 40, `posicion = `, { fontSize: 16, fill: '#f7f7f7' }).setOrigin(0, 0).setScrollFactor(0)

        /**
         * Timer del juego que se activa al crearse todos los componentes del juego.
         */
        this.timer = this.time.addEvent({
            delay: 1000, // ms
            callback: () => { this.clock -= 1 },
            loop: true,
            timeScale: 1,
        })
    }

    update() {
        /**
         * Control basico de movimiento de izquierda a derecha, y cuando dejamos de movernos.
         */
        if (this.control.left.isDown) {
            this.player.setVelocityX(-150)
            this.player.play('walk', true)
            this.player.flipX = true
        } else if (this.control.right.isDown) {
            this.player.setVelocityX(150)
            this.player.play('walk', true)
            this.player.flipX = false
        } else {
            this.player.setVelocityX(0)
            this.player.play('idle', true)
        }

        /*Check casero para cuando salta el personaje:
        * Si el usuario presiona el boton de salto, y el pj esta tocando una plataforma
        * Verificamos con checkIsDown, que solo realize un salto
        */
        if (this.control.up.isDown && this.player.body.touching.down && !this.checkIsDown) {
            this.player.setVelocityY(-300);
            this.checkIsDown = true
        }
        /**
         * Cuando Soltamos el boton de saltar, en el momento que el pj toca el suelo, volvemos a habilitar el salto */
        else if (this.control.up.isUp && this.player.body.touching.down && this.checkIsDown) {
            this.checkIsDown = false
        }

        //Print en UI para el timer
        this.timeTxt.setText(`Time = ${this.clock}`)

        //Iteracion casera para los movimientos de las plataformas moviles
        this.moviles.forEach((child, idx) => {
            if (child.body.position.x <= this.posCheck[idx].posInit) {
                child.body.setVelocityX(100)
            } else if (child.body.position.x >= this.posCheck[idx].posEnd) {
                child.body.setVelocityX(-100)
            }
        })

        //Cuando el reloj interno llegue a 0, simplemente detenemos el timer (definido en el create)
        if (this.clock === 0) {
            this.timer.paused = true
        }
    }

    setPlayer({ physics }) {
        let player
        player = physics.add.sprite(1800, 96, 'pj').setOrigin(0, 0).refreshBody()
        player.setGravityY(350)
        player.setCollideWorldBounds(true, null, null, true)

        return player
    }
    createAnims({ anims }) {
        anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers("pj", { start: 0, end: 3 }),
            frameRate: 6,
            repeate: -1
        })

        anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers("pj", { start: 4, end: 7 }),
            frameRate: 10,
            repeate: -1
        })
    }
}

const config =
{
    type: Phaser.AUTO,
    width: 640,
    height: 320,
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
    scene: LevelUno
}


export default function startGame() {
    return new Phaser.Game(config)
}

