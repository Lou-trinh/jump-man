import MainGame from './scenes/Game';
import { AUTO, Game, Types } from 'phaser';
import GameScene from "./scenes/GameScene.ts";

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Types.Core.GameConfig = {
    type: AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#4B5996',
    scene: [
        MainGame, GameScene
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
}

export default StartGame;
