import Phaser from "phaser";
import Preload from "./scenes/Preload";
import MainMenu from "./scenes/MainMenu"
import Pong from "./scenes/Pong"

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
            gravity: { y: 0 },
            debug: false
        }
    },
    roundPixels: true,
    pixelArt: true,
    scene: [
        Preload,
        MainMenu,
        Pong
    ]
}

export default function startGame() {
    return new Phaser.Game({ ...config, })
}