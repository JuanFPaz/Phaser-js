import * as Phaser from "phaser";

class Pong extends Phaser.Scene {
    //config's
    pelotaConfig = {
        position: { x: 400, y: 300 },
        velocity: { vx: 600, vy: 100, vxMax: 800, vyMax: 600 },
        key: 'pelota'
    }

    scoreConfig = [
        {
            position: { x: 260, y: 30 },
            size: { w: 120, h: 90 },
            style: { fontSize: 100, color: 'rgb(255,255,255)' },
            text: 0,
            align: 'center'
        },
        {
            position: { x: 420, y: 30 },
            size: { w: 120, h: 90 },
            style: { fontSize: 100, color: 'rgb(255,255,255)' },
            text: 0,
            align: 'center'
        }
    ]

    debugConfig = [
        {
            position: { x: 0, y: 450 },
            size: { w: 300, h: 90 },
            style: { fontSize: 24, color: 'rgb(255,255,255)' },
            text: `Player 1:\nPosition X : 0 \nPosition Y : 0`,
            align: 'left'
        },
        {
            position: { x: 420, y: 450 },
            size: { w: 300, h: 90 },
            style: { fontSize: 24, color: 'rgb(255,255,255)' },
            text: `Player 2:\nPosition X : 0 \nPosition Y : 0`,
            align: 'left'
        },
        {
            position: { x: 0, y: 30 },
            size: { w: 300, h: 90 },
            style: { fontSize: 24, color: 'rgb(255,255,255)' },
            text: `Pelota:\nVelocity X: 0\nVelocity Y: 0`,
            align: 'left'
        },
    ]

    playerConfig = [
        {
            id: 0,
            name: 'Player 1',
            key: 'paleta',
            position: { x: 20, y: 300 },
            velocity: { vy: 450 },
            keyboard: { up: 87, down: 83, pausa: 24 }
        },
        {
            id: 1,
            name: 'Player 2',
            key: 'paleta',
            position: { x: 760, y: 300 },
            velocity: { vy: 450 },
            keyboard: { up: 104, down: 98, pausa: 24 }
        }
    ]

    //Game Objects

    playerUno
    playerDos
    pelota
    paredes
    scoreTxt
    debugTxt
    // Game States
    gameState
    game2P
    gameCPU
    example

    constructor() {
        super('Pong')
    }

    init(data) {
        let { modo } = data
        if (modo === '2P') {
            this.game2P = true
            this.gameCPU = false
            return
        }
        if (modo === 'CPU') {
            this.scene.start('MainMenu')
        }
    }

    create() {
        this.crearGameObjectBackground()
        this.paredes = this.crearGameObjectParedes()
        this.pelota = this.crearGameObjectPelota(this.pelotaConfig)
        this.playerUno = this.crearGameObjectPlayer(this.playerConfig[0])
        this.playerDos = this.crearGameObjectPlayer(this.playerConfig[1])
        this.scoreTxt = this.crearGameObjectScore(this.scoreConfig)
        this.debugTxt = this.crearGameObjectScore(this.debugConfig)

        this.crearColisiones(this.pelota, this.paredes)
        this.crearColisiones(this.playerUno, this.paredes)
        this.crearColisiones(this.playerDos, this.paredes)
        this.crearColisiones(this.playerUno, this.pelota, this.eventoColisionPelota)
        this.crearColisiones(this.playerDos, this.pelota, this.eventoColisionPelota)
        this.crearColisionWorldBounds()


        this.establecerGameState()
        this.establecerTecladoGlobal()
    }

    update() {
        if (this.gameState.play) {
            this.playerUno.setVelocityY(this.actualizarMovimientoPlayer(this.playerConfig[0], this.playerUno))
            this.playerDos.setVelocityY(this.actualizarMovimientoPlayer(this.playerConfig[1], this.playerDos))
            // this.actualizarPosicionPlayer(this.debugTxt[0], this.playerUno)
            // this.actualizarPosicionPlayer(this.debugTxt[1], this.playerDos)
            // this.actualizarVelocityPlayer(this.debugTxt[2], this.pelota)
        }
    }

    crearGameObjectText({ position, size, style, text, align }) {
        let _text = text
        let { x, y } = position
        let { w, h } = size
        let _style = style
        let gameObject = this.add.text(x, y, _text, _style)
        gameObject.setFixedSize(w, h)
        gameObject.setAlign(align)
        return gameObject
    }

    crearGameObjectScore(unObjeto) {
        return unObjeto.map((obj) => {
            return this.crearGameObjectText(obj)
        })
    }

    crearGameObjectPelota({ position, velocity, key }) {
        let { x, y } = position
        let { vx, vy, vxMax, vyMax } = velocity
        let _key = key
        let gameObject = this.physics.add.sprite(x, y, _key)
        gameObject.setCollideWorldBounds(true)
        gameObject.body.onWorldBounds = true
        gameObject.setVelocity(vx, vy)
        gameObject.setMaxVelocity(vxMax, vyMax)
        gameObject.setBounce(1)

        return gameObject
    }

    crearGameObjectPlayer({ position, key, keyboard, name }) {
        let { x, y } = position
        let _keyboard = keyboard
        let _key = key
        let gameObject = this.physics.add.sprite(x, y, _key).setOrigin(0, 0.5)
        gameObject.setCollideWorldBounds(true)
        gameObject.body.pushable = false
        gameObject.keyboard = this.input.keyboard.addKeys(_keyboard)
        gameObject.name = name
        gameObject.score = 0
        return gameObject
    }

    crearGameObjectParedes() {
        let gameObject = this.physics.add.staticGroup()
        gameObject.create(0, 0, 'colide-dos').setOrigin(0, 0).refreshBody()
        gameObject.create(0, 570, 'colide-dos').setOrigin(0, 0).refreshBody()
        gameObject.getChildren().forEach((child) => {
            child.setVisible(false)
        })

        return gameObject
    }

    crearGameObjectBackground() {
        this.add.image(0, 0, 'estadio').setOrigin(0, 0)
    }

    crearColisiones(objetoUno, objetoDos, callback = null) {
        this.physics.add.collider(objetoUno, objetoDos, callback, null, this)
    }

    crearColisionWorldBounds() {
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            this.eventoColisionGol(left, right)
        })
    }

    eventoColisionPelota(player, pelota) {
        let vxPelota = pelota.body.velocity.x < 0 ? pelota.body.velocity.x - 20 : pelota.body.velocity.x + 20
        let vyPelota = pelota.body.velocity.y < 0 ? pelota.body.velocity.y - 20 : pelota.body.velocity.y + 20

        if (player.keyboard.up.isDown) {
            let vyUp = vyPelota < 0 ? vyPelota * 1 : vyPelota * -1
            pelota.body.setVelocity(vxPelota, vyUp)
            return
        } else if (player.keyboard.down.isDown) {
            let vyDown = vyPelota < 0 ? vyPelota * -1 : vyPelota * 1
            pelota.body.setVelocity(vxPelota, vyDown)
            return
        }
        pelota.body.setVelocity(vxPelota, vyPelota)
    }

    eventoColisionGol(left, right) {
        //Es totalmente funcional, pero se ve tan feoo.. (?)
        if (left) {
            let score = this.playerDos.score += 1
            this.manejadorGol(this.scoreTxt[1], score)
            let timer = this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.manejadorScoreMatch(score)
                    this.manejadorTimer(-1)
                },
                loop: false,
                repeat: 0,
                timeScale: 1
            })
        }
        if (right) {
            let score = this.playerUno.score += 1
            this.manejadorGol(this.scoreTxt[0], score)
            let timer = this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.manejadorScoreMatch(score)
                    this.manejadorTimer(1)
                },
                loop: false,
                repeat: 0,
                timeScale: 1
            })
        }
    }

    manejadorScoreMatch(unScore) {
        if (unScore === 10) {
            console.log('Fin del Partido!')
            this.scene.start('MainMenu')
            return
        }
    }

    manejadorGol(unScore, unScorePlayer) {
        this.gameState.play = false
        this.pelota.body.setVelocity(0, 0)
        this.playerUno.body.setVelocity(0, 0)
        this.playerDos.body.setVelocity(0, 0)
        unScore.setText(`${unScorePlayer}`)
    }

    manejadorTimer(unaDire) {
        let vx = this.pelotaConfig.velocity.vx * unaDire
        let vy = this.pelotaConfig.velocity.vy * unaDire
        let positions = [
            { x: this.pelotaConfig.position.x, y: this.pelotaConfig.position.y },
            { x: this.playerConfig[0].position.x, y: this.playerConfig[0].position.y },
            { x: this.playerConfig[1].position.x, y: this.playerConfig[1].position.y }

        ]

        this.gameState.play = true
        this.pelota.setVelocity(vx, vy)
        this.pelota.setPosition(positions[0].x, positions[0].y)
        this.playerUno.setPosition(positions[1].x, positions[1].y)
        this.playerDos.setPosition(positions[2].x, positions[2].y)
    }
    actualizarMovimientoPlayer(unConfig, unPlayer) {
        let { velocity: { vy } } = unConfig
        let { keyboard: { up, down } } = unPlayer
        if (up.isDown) {
            return -vy
        } else if (down.isDown) {
            return vy
        }
        return 0
    }

    actualizarPosicionPlayer(unDebug, unPlayer) {
        unDebug.setText(`${unPlayer.name} :\nPosition X : ${unPlayer.body.x} \nPosition Y : ${unPlayer.body.y}`)
    }
    actualizarVelocityPlayer(unDebug, unPelota) {
        unDebug.setText(`Pelota :\nVelocity X : ${unPelota.body.velocity.x} \nVelocity Y : ${unPelota.body.velocity.y}`)
    }

    establecerGameState() {
        this.gameState = {
            play: true
        }
    }
    establecerTecladoGlobal() {
        this.input.keyboard.on('keydown-ESC', (a) => {
            this.scene.start('MainMenu')
        })
    }

}

export default Pong