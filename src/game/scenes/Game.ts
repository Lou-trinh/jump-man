import { Scene } from 'phaser';
import { EventBus } from '../EventBus';
import webSocket from "../../lib/webSocket.ts";

class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }
    
    async socketSend(): Promise<void> {
        webSocket.send('/ws/receive', 'connect server');
    }

    preload ()
    {
        this.load.image('background', 'assets/bg.jpeg');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('barrier', 'assets/barrier.png');
        this.load.image('bird', 'assets/bird.png');
    }

    create ()
    {
        this.createStartButton();
        EventBus.emit('current-scene-ready', this);
    }
    
    createStartButton()
    {
        const x = Math.floor(window.innerWidth / 2);
        const y = Math.floor(window.innerHeight / 2);
        const startButton = this.add.text(x, y, '▶️ BẮT ĐẦU', {
            fontFamily: 'Arial',
            fontSize: 32,
            backgroundColor: '#1e9011',
            padding: { x: 20, y: 10 },
            color: '#ffffff',
            shadow: {
                offsetX: 12,
                offsetY: 12,
                color: '#123465',
                blur: 0,
                stroke: false,
                fill: false,
            },

        })
            .setOrigin(0.5)
            .setDepth(100)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => startButton.setStyle({ backgroundColor: '#3cb371' }))
            .on('pointerout', () => startButton.setStyle({ backgroundColor: '#1e90ff' }))
            .on('pointerdown', () => {
                console.log('Bắt đầu game!');
                this.socketSend().then();
            })   
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            })
    }
    
    update(time: number, delta: number) {
        super.update(time, delta);
    }

}

export default Game
