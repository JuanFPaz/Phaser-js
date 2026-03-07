import Phaser from "phaser";

class MainMenu extends Phaser.Scene {
    //Texto y sus configs
    tituloConfig = {
        text: 'PONG!',
        position: { x: 100, y: 60 },
        size: { w: 600, h: 180 },
        style: { fontSize: 210, color: 'rgb(255,255,255)' },
    }

    menuConfig = [
        {
            text: '1P  vs CPU',
            position: { x: 300, y: 300 },
            size: { w: 200, h: 30 },
            style: { fontSize: 32, color: 'rgb(255,255,255)' },
            scene: 'Pong',
            data: { modo: 'CPU' }
        },
        {
            text: '1P  vs  2P',
            position: { x: 300, y: 360 },
            size: { w: 200, h: 30 },
            style: { fontSize: 32, color: 'rgb(255,255,255)' },
            scene: 'Pong',
            data: { modo: '2P' }
        }
    ]

    creditosConfig = [
        {
            text: `Basado en el juego desarrolado por Allan Alcorn y Atari ®`,
            position: { x: 100, y: 510 }, size: { w: 600, h: 30 },
            style: { fontSize: 16, color: 'rgb(255,255,255)' }
        },
        {
            text: `Codigos por Juan Paz - 2026`,
            position: { x: 100, y: 540 },
            size: { w: 600, h: 30 },
            style: { fontSize: 16, color: 'rgb(255,255,255)' }
        }
    ]

    flechaConfig = [
        {
            position: { x: 300, y: 315 }, key: 'flecha',
        },
        {
            position: { x: 300, y: 375 }
        }
    ]
    //Indice Global
    indice

    // Game Objects
    tituloTxt
    menuTxt
    creditosTxT
    flecha

    constructor() {
        super('MainMenu')
    }

    create() {
        this.establecerIndice()
        this.crearGameObjectBackground()
        this.flecha = this.crearGameObjectFlecha(this.flechaConfig[this.indice])
        this.tituloTxt = this.crearGameObjectTitulo(this.tituloConfig)
        this.menuTxt = this.crearGameObjectMenu(this.menuConfig)
        this.creditosTxT = this.crearGameObjectCreditos(this.creditosConfig)
        this.establecerTecladoGlobal(this.input.keyboard)
    }

    crearGameObjectFlecha({ position, key }) {
        let { x, y } = position
        let _key = key
        let gameObject = this.add.image(x, y, _key)
        gameObject.setOrigin(1, 0.5)
        return gameObject
    }

    establecerIndice() {
        this.indice = 0
    }

    crearGameObjectBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0)
    }

    crearGameObjectTitulo(unObjeto) {
        return this.crearGameObjectText(unObjeto)
    }

    crearGameObjectMenu(unObjeto) {
        return unObjeto.map((obj) => {
            return this.crearGameObjectText(obj)
        })
    }

    crearGameObjectCreditos(unObjeto) {
        return unObjeto.map((obj) => {
            return this.crearGameObjectText(obj)
        })
    }

    establecerTecladoGlobal(teclado) {
        teclado.on('keydown-S', () => {
            let i = this.indice < this.flechaConfig.length - 1 ? ++this.indice : --this.indice
            let { x, y } = this.flechaConfig[i].position
            this.flecha.setPosition(x, y)
        })

        teclado.on('keydown-W', () => {
            let i = this.indice === 0 ? ++this.indice : --this.indice
            let { x, y } = this.flechaConfig[i].position
            this.flecha.setPosition(x, y)
        })

        teclado.on('keydown-ENTER', () => {
            let i = this.indice
            let scene = this.menuConfig[i].scene
            let data = this.menuConfig[i].data
            this.scene.start(scene, data)
        })

        // this.mostrarGrid(teclado)
    }

    crearGameObjectText({ text, position, size, style }) {
        let texto = text
        let { x, y } = position
        let { w, h } = size
        let _style = style
        let gameObject = this.add.text(x, y, texto, _style)
        gameObject.setFixedSize(w, h)
        gameObject.setAlign('center')

        return gameObject
    }

    mostrarGrid(teclado) {
        teclado.on('keydown-F', () => {
            this.add.grid(0, 0, 800, 600, 100, 30, 0, 0, 0xff0000, 1).setOrigin(0, 0);
        })
    }
}

export default MainMenu