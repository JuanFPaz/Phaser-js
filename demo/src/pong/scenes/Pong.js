import Phaser from "phaser";

class Pong extends Phaser.Scene {
    //config's
    pelotaConfig = {
        position: {
            x: 400,
            y: 300
        },
        velocity: {
            vx: 600,
            vy: 100,
            vxMax: 1200,
            vyMax: 300
        },
        key: 'pelota'
    }

    scoreConfig = [
        {
            position: { x: 260, y: 30 },
            size: { w: 120, h: 90 },
            style: { fontSize: 100, color: 'rgb(255,255,255)' },
            scoreInit: 0
        },
        {
            position: { x: 420, y: 30 },
            size: { w: 120, h: 90 },
            style: { fontSize: 100, color: 'rgb(255,255,255)' },
            scoreInit: 0
        }
    ]

    playerConfig = [
        {
            position: { x: 20, y: 300 },
            velocity: { vy: 450 },
            key: 'paleta'
        },
        {
            position: { x: 760, y: 300 },
            velocity: { vy: 450 },
            key: 'paleta'
        }
    ]

    //Game Objects

    playerUno
    playerDos
    pelota
    paredes
    scoreTxt

    // Game States
    gameState
    game2P
    gameCPU

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
            this.game2P = false
            this.gameCPU = true
            return
        }
    }

    create() {
        this.establecerGameState()
        this.crearGameObjectBackground()
        this.paredes = this.crearGameObjectParedes()
        this.pelota = this.crearGameObjectPelota(this.pelotaConfig)
        this.playerUno = this.crearGameObjectPlayer(this.playerConfig[0])
        this.playerDos = this.crearGameObjectPlayer(this.playerConfig[1])
        this.scoreTxt = this.crearGameObjectScore(this.scoreConfig)

        this.crearColisiones(this.pelota, this.paredes)
        this.crearColisiones(this.playerUno, this.paredes)
        this.crearColisiones(this.playerDos, this.paredes)
        this.crearColisiones(this.playerUno, this.pelota, this.eventoColisionPelota)
        this.crearColisiones(this.playerDos, this.pelota, this.eventoColisionPelota)
        this.establecerGameplay(this.playerUno, this.playerDos)
        // this.crearColisionWorldBounds()
        this.establecerTecladoGlobal()
    }

    update() {
        if (this.gameState.play) {
            this.movimientoPlayer(this.playerConfig[0], this.playerUno,)
            this.movimientoPlayer(this.playerConfig[1], this.playerDos)
        }
    }

    establecerGameState() {
        this.gameState = {
            play: true
        }
    }

    crearGameObjectScoreText({ position, size, style, scoreInit }) {
        let score = scoreInit
        let { x, y } = position
        let { w, h } = size
        let _style = style
        let gameObject = this.add.text(x, y, score, _style)
        gameObject.setFixedSize(w, h)
        gameObject.setAlign('center')
        return gameObject
    }

    crearGameObjectScore(unObjeto) {
        return unObjeto.map((obj, idx) => {
            return this.crearGameObjectScoreText(obj, idx)
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

    crearGameObjectPlayer({ position, key }) {
        let { x, y } = position
        let _key = key
        let gameObject = this.physics.add.sprite(x, y, _key).setOrigin(0, 0.5)
        gameObject.setCollideWorldBounds(true)
        gameObject.body.pushable = false
        gameObject.control = []
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
            this.manejadorWorldBounds(left, right)
        })
    }

    crearControlesPlayers(controlUno, controlDos) {
        controlUno.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))
        controlUno.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))

        controlDos.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT))
        controlDos.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO))
    }

    eventoColisionPelota(player, pelota) {
        let vxPelota = pelota.body.velocity.x < 0 ? pelota.body.velocity.x - 20 : pelota.body.velocity.x + 20
        let vyPelota = pelota.body.velocity.y < 0 ? pelota.body.velocity.y - 20 : pelota.body.velocity.y + 20
        pelota.body.setVelocity(vxPelota, vyPelota)
    }

    manejadorScoreMatch(unScore) {
        if (unScore === 10) {
            console.log('Fin del Partido!')
            this.scene.start('MainMenu')
            return
        }
    }

    manejadorWorldBounds(left, right) {
        if (left) {
            let score = this.playerDos.score += 1
            this.manejadorGol(this.scoreTxt[1], score)
            let timer = this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.manejadorScoreMatch(score)
                    this.manejadorTimer(-600, -100)
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
                    this.manejadorTimer(600, 100)
                },
                loop: false,
                repeat: 0,
                timeScale: 1
            })
        }
    }

    manejadorGol(unScore, unScorePlayer) {
        this.gameState.play = false
        this.pelota.body.setVelocity(0, 0)
        this.playerUno.body.setVelocity(0, 0)
        this.playerDos.body.setVelocity(0, 0)
        unScore.setText(`${unScorePlayer}`)
    }

    manejadorTimer(x, y,) {
        this.gameState.play = true
        this.pelota.setPosition(400, 300)
        this.pelota.setVelocity(x, y)
        this.playerUno.setPosition(40, 300)
        this.playerDos.setPosition(745, 300)
    }

    movimientoPlayer({ velocity }, { control, body }) {
        let up = control[0]
        let down = control[1]
        let { vy } = velocity
        if (up.isDown) {
            body.setVelocityY(-vy)
            return
        } else if (down.isDown) {
            body.setVelocityY(vy)
            return
        }
        body.setVelocityY(0)
    }

    establecerGameplay(playerUno, playerDos) {
        if (this.game2P) {
            this.crearControlesPlayers(playerUno.control, playerDos.control)
        } else if (this.gameCPU) {
            this.scene.start('MainMenu')
        }
    }

    establecerTecladoGlobal() {
        this.input.keyboard.on('keydown-ESC', (a) => {
            this.scene.start('MainMenu')
        })
    }
}

export default Pong