import { Scene } from 'phaser';

class GameScene extends Scene {
    private player: Phaser.GameObjects.Sprite;
    private grounds: Phaser.GameObjects.Image[] = [];
    private bird: Phaser.GameObjects.Image[] = [];
    // private bird: Phaser.GameObjects.Sprite;
    private birdSpacing: number = 800;
    private barriers: Phaser.GameObjects.Image[] = [];
    private isJumping = false;
    private groundSpeed: number = 300;
    private barrierSpacing: number = 550;
    private score: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private isGameOver: boolean = false;
    private distanceTraveled: number = 0;
    private lastSpeedIncreaseScore: number = 0;

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'assets/bg.jpeg');
        this.load.image('ground', 'assets/ground.png');
        // this.load.image('barrier', 'assets/barrier.png');
        this.load.spritesheet(
            'player',
            'player-jump.png',
            {
                frameWidth: 80,
                frameHeight: 80,
            }
        );
        this.load.spritesheet(
            'player1',
            'player-run.png',
            {
                frameWidth: 80,
                frameHeight: 80,
            }
        );
        this.load.spritesheet(
            'bird',
            'bird.png',
            {
                frameWidth: 32,
                frameHeight: 32,
            }
        )
    }

    create() {
        this.grounds = [];
        this.barriers = [];
        // this.bird = [];
        this.isJumping = false;
        this.isGameOver = false;
        this.score = 0;
        this.distanceTraveled = 0;
        this.lastSpeedIncreaseScore = 0;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const bg = this.add.image(screenWidth / 2, screenHeight / 2, 'background');
        bg.displayWidth = screenWidth;
        bg.displayHeight = screenHeight;

        const groundY = screenHeight - 90;

        const ground1 = this.add.image(0, groundY, 'ground');
        ground1.setOrigin(0, 0.5);
        ground1.displayWidth = screenWidth;
        ground1.displayHeight = 250;

        const ground2 = this.add.image(screenWidth, groundY, 'ground');
        ground2.setOrigin(0, 0.5);
        ground2.displayWidth = screenWidth;
        ground2.displayHeight = 250;

        this.grounds = [ground1, ground2];

        const barrierY = groundY + 120;
        const numBarriers = Math.ceil(screenWidth / this.barrierSpacing) + 2;

        for (let i = 0; i < numBarriers; i++) {
            const barrierX = screenWidth + (i * this.barrierSpacing) + Phaser.Math.Between(0, 200);
            const barrier = this.add.image(barrierX, barrierY, 'barrier');
            barrier.setScale(0.5, 0.5);
            barrier.setOrigin(0.5, 1);
            this.barriers.push(barrier);
        }
        
        const birdY = groundY + 200;
        const numBird = Math.ceil(screenWidth / this.birdSpacing) + 2;

        for ( let i = 0; i < numBird; i++){
            const birdX = screenWidth + (i * this.birdSpacing) + Phaser.Math.Between(0, 200);
            const bird = this.add.image(birdX, birdY, 'bird');
            bird.setScale(1,1);
            bird.setOrigin(1,2);
            this.bird.push(bird);
        }

        this.anims.create(
            {
                key: 'player-jump',
                frames: this.anims.generateFrameNumbers('player', { start: 1, end: 4 }),
                frameRate: 4,
                repeat: -1
            },
        );

        this.anims.create(
            {
                key: 'player-run',
                frames: this.anims.generateFrameNumbers('player1', { start: 1, end: 10 }),
                frameRate: 10,
                repeat: -1
            },
        );
        
        this.anims.create(
            {
                key: 'bird',
                frames: this.anims.generateFrameNumbers('bird', {start: 1, end: 3}),
                frameRate: 10,
                repeat: -1
            }
        )

        const startX = screenWidth - 1600;
        const startY = screenHeight - 75;

        this.player = this.add.sprite(startX, startY, 'player1');
        this.player.setScale(2.5, 2.5);
        this.player.play('player-run');
        
        // this.bird = this.add.sprite(startX + 500, startY - 200, 'bird');
        // this.bird.setScale(2, 2);
        
        

        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            fontStyle: 'bold italic',
            color: '#000000',
        });
        this.scoreText.setDepth(100);

        this.input.keyboard?.on('keydown', (event: any) => {
            if (!this.isGameOver && (event.code == 'Space' || event.code == 'ArrowUp')) {
                this.jump();
            }
        });
        this.input.on('pointerdown', (pointer: any): void => {
            if(!this.isGameOver && pointer.leftButtonDown()){
                this.jump();
            }
        });
    }

    jump(){
        if (!this.isJumping && !this.isGameOver) {
            this.isJumping = true;
            this.player.play('player-jump');

            const jumpHeight: number = 300;

            this.tweens.add({
                targets: this.player,
                y: this.player.y - jumpHeight,
                duration: 500,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: this.player,
                        y: this.player.y + jumpHeight,
                        duration: 500,
                        ease: 'Quad.easeIn',
                        onComplete: () => {
                            this.isJumping = false;
                            if (!this.isGameOver) {
                                this.player.play('player-run');
                            }
                        }
                    });
                }
            });
        }
    }

    update() {
        if (this.isGameOver) return;

        const screenWidth = window.innerWidth;

        this.distanceTraveled += this.groundSpeed * (this.game.loop.delta / 1000);
        this.score = Math.floor(this.distanceTraveled / 10);
        this.scoreText.setText('Score: ' + this.score);

        if (this.score - this.lastSpeedIncreaseScore >= 1000) {
            this.groundSpeed += 50;
            this.lastSpeedIncreaseScore = this.score;
        }

        this.grounds.forEach((ground) => {
            ground.x -= this.groundSpeed * (this.game.loop.delta / 1000);

            if (ground.x <= -screenWidth) {
                ground.x = screenWidth - 2;
            }
        });

        this.barriers.forEach((barrier) => {
            barrier.x -= this.groundSpeed * (this.game.loop.delta / 1000);

            const playerBounds = this.player.getBounds();
            const barrierBounds = barrier.getBounds();

            const playerHitbox = new Phaser.Geom.Rectangle(
                playerBounds.x + playerBounds.width * 0.2,
                playerBounds.y + playerBounds.height * 0.2,
                playerBounds.width * 0.2,
                playerBounds.height * 0.2
            );

            const barrierHitbox = new Phaser.Geom.Rectangle(
                barrierBounds.x + barrierBounds.width * 0.1,
                barrierBounds.y + barrierBounds.height * 0.1,
                barrierBounds.width * 0.4,
                barrierBounds.height * 0.4
            );

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerHitbox, barrierHitbox)) {
                this.gameOver();
                return;
            }

            if (barrier.x <= -100) {
                let maxX = -Infinity;
                this.barriers.forEach(b => {
                    if (b.x > maxX) maxX = b.x;
                });
                const randomSpacing = Phaser.Math.Between(400, 700);
                barrier.x = maxX + randomSpacing;
            }
        });

        this.bird.forEach((bird) => {
            bird.x -= this.groundSpeed * (this.game.loop.delta / 800);

            const playerBounds = this.player.getBounds();
            const birdBounds = bird.getBounds();

            const playerHitbox = new Phaser.Geom.Rectangle(
                playerBounds.x + playerBounds.width * 0.2,
                playerBounds.y + playerBounds.height * 0.2,
                playerBounds.width * 0.2,
                playerBounds.height * 0.2
            );

            const birdHitbox = new Phaser.Geom.Rectangle(
                birdBounds.x + birdBounds.width * 0.1,
                birdBounds.y + birdBounds.height * 0.1,
                birdBounds.width * 0.4,
                birdBounds.height * 0.4
            );

            if (Phaser.Geom.Intersects.RectangleToRectangle(playerHitbox, birdHitbox)) {
                this.gameOver();
                return;
            }

            if (bird.x <= -100) {
                let maxX = -Infinity;
                this.bird.forEach(b => {
                    if (b.x > maxX) maxX = b.x;
                });
                const randomSpacing = Phaser.Math.Between(0, 1000);
                bird.x = maxX + randomSpacing;
            }
        });
    }

    gameOver() {
        this.isGameOver = true;

        this.player.stop();

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const overlay = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        overlay.setDepth(200);

        const gameOverText = this.add.text(screenWidth / 2, screenHeight / 2 - 80, 'GAME OVER', {
            fontSize: '64px',
            color: '#ff0000',
            fontStyle: 'bold'
        });
        gameOverText.setOrigin(0.5);
        gameOverText.setDepth(201);

        const finalScoreText = this.add.text(screenWidth / 2, screenHeight / 2, 'Score: ' + this.score, {
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        finalScoreText.setOrigin(0.5);
        finalScoreText.setDepth(201);

        const replayButton = this.add.rectangle(screenWidth / 2, screenHeight / 2 + 80, 200, 60, 0x4CAF50);
        replayButton.setDepth(201);
        replayButton.setInteractive({ useHandCursor: true });

        const replayText = this.add.text(screenWidth / 2, screenHeight / 2 + 80, 'REPLAY', {
            fontSize: '28px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        replayText.setOrigin(0.5);
        replayText.setDepth(202);

        replayButton.on('pointerover', () => {
            replayButton.setFillStyle(0x66BB6A);
        });

        replayButton.on('pointerout', () => {
            replayButton.setFillStyle(0x4CAF50);
        });

        replayButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }
}

export default GameScene