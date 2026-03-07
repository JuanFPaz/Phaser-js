import Phaser from "phaser";

class Preload extends Phaser.Scene{
    constructor (){
        super('Preload')
    }

    preload() {
        this.load.image('background','/assets-3/background-pong.png')
        this.load.image('estadio', '/assets-3/estadio.png')
        this.load.image('paleta', '/assets-3/paleta.png')
        this.load.image('pelota', '/assets-3/pelota.png')
        this.load.image('flecha','/assets-3/flecha.png')
        this.load.image('colide-dos', '/assets-3/colision-wall-lateral-2.png')
    }

    create(){
        this.scene.start('MainMenu','asdads')
    }
}

export default Preload