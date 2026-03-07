import Phaser from "phaser";



class TileExample extends Phaser.Scene {
    map
    constructor() {
        super()
    }
    preload() {
        this.load.image('tiles', '/assets-3/Tiles 32x32.png')
        this.load.tilemapTiledJSON('map', '/assets-3/plataform-1.json')
    }

    create() {

        this.map = this.make.tilemap({ key: 'map'});
        const tileset = this.map.addTilesetImage('plataforma','tiles')
        const layer = this.map.createLayer(0, tileset, 0, 0); // layer index, tileset, x, y
    }
}
const config =
{
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'app'
    },
    roundPixels: true,
    pixelArt: true,
    scene: TileExample
}
export default function startGame() {
    return new Phaser.Game(config)
}