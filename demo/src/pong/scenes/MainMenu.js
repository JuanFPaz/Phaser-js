import Phaser from "phaser";

class MainMenu extends Phaser.Scene {
    titulo = { text: 'PONG!' }
    menu = [
        { text: '1P  vs CPU', scene: 'Pong', data: { modo: 'CPU' } },
        { text: '1P  vs  2P', scene: 'Pong', data: { modo: '2P' } }
    ]
    creditos = [
        { text: `Basado en el juego desarrolado por Allan Alcorn y Atari ®` },
        { text: `Codigos por Juan Paz - 2026` }
    ]

    tituloTxt
    menuTxt
    creditosTxT
    flecha
    indice
    posFlecha = [
        { x: 300, y: 315 },
        { x: 300, y: 375 }
    ]

    debugIndice
    debugParams
    constructor() {
        super('MainMenu')
    }

    create() {
        //Explicacion de los cambios en PONG.JS
        this.menuTxt = []
        this.creditosTxT = []
        this.indice = 0
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        this.flecha = this.add.image(this.posFlecha[this.indice].x, this.posFlecha[this.indice].y, 'flecha').setOrigin(1, 0.5)
        this.tituloTxt = this.add.text(100, 60, `${this.titulo.text}`, { fontSize: 210, color: 'rgb(255,255,255)' })

        this.menuTxt.push(this.add.text(300, 300, `${this.menu[0].text}`, { fontSize: 32, color: 'rgb(255, 255, 255)' }))
        this.menuTxt.push(this.add.text(300, 360, `${this.menu[1].text}`, { fontSize: 32, color: 'rgb(255, 255, 255)' }))


        this.creditosTxT.push(this.add.text(100, 510, `${this.creditos[0].text}`, { fontSize: 16, color: 'rgb(255,255,255)' }))
        this.creditosTxT.push(this.add.text(100, 540, `${this.creditos[1].text}`, { fontSize: 16, color: 'rgb(255,255,255)' }))

        this.menuTxt[0].setAlign('center').setFixedSize(200, 30)
        this.menuTxt[1].setAlign('center').setFixedSize(200, 30)
        this.creditosTxT[0].setFixedSize(600, 30).setAlign('center')
        this.creditosTxT[1].setFixedSize(600, 30).setAlign('center')
        this.tituloTxt.setFixedSize(600, 180).setAlign('center')
        this.debugIndice = this.add.text(0, 0, `Indice = ${this.indice}`)
        this.add.grid(0, 0, 4000, 2000, 400, 300, 0x000000, 0, 0xffffff, 0.5).setOrigin(0, 0);
        this.add.grid(0, 0, 4000, 2000, 100, 30, 0, 0, 0xff0000, 1).setOrigin(0, 0);
        this.input.keyboard.on('keydown-S', () => {
            let i = this.indice < this.posFlecha.length - 1 ? ++this.indice : --this.indice
            this.debugIndice.setText(`Indice = ${this.indice}`)
            this.flecha.setPosition(this.posFlecha[i].x, this.posFlecha[i].y)
        })

        this.input.keyboard.on('keydown-W', () => {
            let i = this.indice === 0 ? ++this.indice : --this.indice
            this.debugIndice.setText(`Indice = ${this.indice}`)
            this.flecha.setPosition(this.posFlecha[i].x, this.posFlecha[i].y)
        })

        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start(this.menu[this.indice].scene, this.menu[this.indice].data)
        })
    }

}

export default MainMenu