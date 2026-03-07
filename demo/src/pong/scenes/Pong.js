import Phaser from "phaser";

class Pong extends Phaser.Scene {
    playerUno
    playerDos
    playerUnoMov = []
    playerDosMov = []
    score = {
        playerUno: 0,
        playerDos: 0,
    }
    pelota
    collideWalls
    gameState = {
        play: true,
    }

    // Cache el error:
    debugTxt
    scoreTxt
    //

    game2P = false
    gameCPU = false
    constructor() {
        super('Pong')
    }

    init({ modo }) {
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
        // Cada vez que iniciamos this.scene.start
        // Se vuelve a ejecutar los metodos de la escena, en este caso, create()
        // Pero las propiedades como scoreTxt que es un arreglo, tiene las instancias de this.add.text de la primera escena instanciada
        this.scoreTxt = []
        this.crearFondo(0, 0)
        this.playerUno = this.crearPaleta(20, 300)
        this.playerDos = this.crearPaleta(760, 300)
        this.pelota = this.crearPelota(400, 300)
        this.collideWalls = this.crearParedes()

        this.crearColisiones(this.pelota, this.collideWalls)
        this.crearColisiones([this.playerUno, this.playerDos], this.collideWalls)
        this.crearColisiones(this.playerUno, this.pelota, this.manejadorColisionPelota)
        this.crearColisiones(this.playerDos, this.pelota, this.manejadorColisionPelota)

        //Entonces Cuando llega aca, en mostrarScoreMatch(this.scoreTxt)
        //Es cuando ocurre el error:
        // Score Match lo que hace es agregar un nuevo elemento con push()
        // Pero nosotros llamamos a cada elemento con sus indices 0 y 1
        // pero las nuevas instancias se van a ir guardando en el 2 y 3, 4 y 5, etc etc, cada vez que llamemos denuevoa esta escena
        this.mostrarScoreMatch(this.scoreTxt)
        //Por eso, en el create, seteamos a this.scoreTxt como un arreglo vacio, cada vez que se llame a esta escena.
        //Fin.
        this.crearColisionWorldBounds()

        if (this.game2P) {
            this.crearControles(this.playerUnoMov, this.playerDosMov)
        } else if (this.gameCPU) {
            this.scene.start('MainMenu')
        }

        this.input.keyboard.on('keydown-ESC', (a) => {
            this.scene.start('MainMenu')
        })
        // this.add.grid(0, 30, 800, 540, 20, 30, 0, 0, 0xff0000, 1).setOrigin(0, 0);
    }


    update() {
        if (this.gameState.play) {
            this.movimientoPaleta(this.playerUnoMov, this.playerUno)
            this.movimientoPaleta(this.playerDosMov, this.playerDos)
        }

        // this.actualizarVelocityPelota(this.debugTxt, this.pelota)
    }

    crearPelota(x, y) {
        // .setScale(0.75).refreshBody()
        let sprite = this.physics.add.sprite(x, y, 'pelota')
        sprite.setCollideWorldBounds(true)
        sprite.body.onWorldBounds = true
        // sprite.setVelocity(600, 100)
        // sprite.setMaxVelocity(1200, 300)
        sprite.setBounce(1)

        return sprite
    }

    crearPaleta(x, y) {
        // .setOrigin(0, 0.5).setScale(0.75).refreshBody()
        let sprite = this.physics.add.sprite(x, y, 'paleta').setOrigin(0, 0.5)
        sprite.body.pushable = false
        sprite.setCollideWorldBounds(true)

        return sprite
    }

    crearParedes() {
        let staticGroup = this.physics.add.staticGroup()
        staticGroup.create(0, 0, 'colide-dos').setOrigin(0, 0).refreshBody()
        staticGroup.create(0, 570, 'colide-dos').setOrigin(0, 0).refreshBody()
        staticGroup.getChildren().forEach((child) => {
            child.setVisible(false)
        })

        return staticGroup
    }

    crearFondo(x, y) {
        this.add.image(x, y, 'estadio').setOrigin(0, 0)
    }

    crearColisiones(objetoUno, objetoDos, callback = null) {
        this.physics.add.collider(objetoUno, objetoDos, callback)

        // if (!(callback)) {
        //     this.physics.add.collider(objetoUno, objetoDos)
        // } else {
        //     this.physics.add.collider(objetoUno, objetoDos, callback)
        // }
    }

    crearColisionWorldBounds() {
        this.physics.world.on('worldbounds', (body, up, down, left, right) => {
            this.manejadorWorldBounds(left, right)
        })
    }
    crearControles(controlUno, controlDos) {
        if (controlUno.length < 2 && controlDos.length < 2) {
            controlUno.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W))
            controlUno.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S))

            controlDos.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT))
            controlDos.push(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO))
        }

    }

    mostrarScoreMatch(texto) {
        // Lo cual es totalmente al pedo condicionar la longitud del arreglo, porque esta guardando una instancia de un Text
        // de otra escena, o algo asi.
        texto.push(this.add.text(260, 30, `${this.score.playerUno}`, { fontSize: 100, fill: '#000000' }))
        texto.push(this.add.text(420, 30, `${this.score.playerDos}`, { fontSize: 100, fill: '#000000' }))
        texto[0].setFixedSize(120, 90).setColor('rgb(255,255,255)').setAlign('center')
        texto[1].setFixedSize(120, 90).setColor('rgb(255,255,255)').setAlign('center')
    }

    mostrarVelocityPelota(texto, pelota) {
        texto.push(this.add.text(0, 30, `Velocity X = ${pelota.body.velocity.x}`, { fontSize: 16, fill: '#000000' }))
        texto.push(this.add.text(200, 30, `Velocity Y = ${pelota.body.velocity.y}`, { fontSize: 16, fill: '#000000' }))
    }

    actualizarVelocityPelota(texto, pelota) {
        texto[0].setText(`Velocity X = ${pelota.body.velocity.x}`)
        texto[1].setText(`Velocity Y = ${pelota.body.velocity.y}`)
    }


    manejadorColisionPelota(player, pelota) {
        // Primero incrementamos su velocidad en X e Y
        // Y luego invierte las velocidad por la colision entre los dos objetos, gracias al this.pelota.setBounce(1)
        //
        //    Cuando la pelota se mueve a la izquierda <- Su velocity es negativo (un numero MENOR que 0), si es asi, le restamos 20
        //    Cuando la pelota se mueve a la derecha -> Su velocity es positivo (un numero MAYOR que 0), si es asi, le SUMAMOS 20
        let vxPelota = pelota.body.velocity.x < 0 ? pelota.body.velocity.x - 20 : pelota.body.velocity.x + 20
        let vyPelota = pelota.body.velocity.y < 0 ? pelota.body.velocity.y - 20 : pelota.body.velocity.y + 20
        pelota.body.setVelocity(vxPelota, vyPelota)
    }

    manejadorWorldBounds(left, right) {
        if (left) {
            this.gameState.play = false
            this.scoreTxt[1].setText(`${this.score.playerDos += 1}`)
            this.pelota.body.setVelocity(0, 0)
            this.playerUno.body.setVelocity(0, 0)
            this.playerDos.body.setVelocity(0, 0)
            let timer = this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.gameState.play = true
                    this.pelota.setPosition(400, 300)
                    this.pelota.setVelocity(-600, -100)
                    this.playerUno.setPosition(40, 300)
                    this.playerDos.setPosition(745, 300)
                },
                loop: false,
                repeat: 0,
                timeScale: 1
            })
        }
        if (right) {
            this.gameState.play = false
            this.scoreTxt[0].setText(`${this.score.playerUno += 1}`)
            this.pelota.body.setVelocity(0, 0)
            this.playerUno.body.setVelocity(0, 0)
            this.playerDos.body.setVelocity(0, 0)
            let timer = this.time.addEvent({
                delay: 3000,
                callback: () => {
                    this.gameState.play = true
                    this.pelota.setPosition(400, 300)
                    this.pelota.setVelocity(-600, -100)
                    this.playerUno.setPosition(40, 300)
                    this.playerDos.setPosition(745, 300)
                },
                loop: false,
                repeat: 0,
                timeScale: 1
            })
        }
    }

    movimientoPaleta(unControl, unPlayer) {

        if (unControl[0].isDown) {
            unPlayer.body.setVelocityY(-450)
            return
        } else if (unControl[1].isDown) {
            unPlayer.body.setVelocityY(450)
            return
        }
        unPlayer.body.setVelocityY(0)
    }
}

export default Pong