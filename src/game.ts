/// <reference path="../tsd/phaser.d.ts" />

const collectStar = function (player: Phaser.Sprite, star: Phaser.Sprite) {
    star.kill();
    this.score += 10;
    this.scoreText.text = 'Your Score: ' + this.score;
}

class PhaserGame {
    cursors: Phaser.CursorKeys;
    game: Phaser.Game;
    platforms: Phaser.Group;
    player: Phaser.Sprite;
    score: number = 0;
    scoreText: Phaser.Text;
    stars: Phaser.Group;

    constructor() {
        this.game = new Phaser.Game(800, 
                                    600, 
                                    Phaser.AUTO, 
                                    'content', 
                                    {       preload: this.preload, 
                                            create: this.create, 
                                            update: this.update 
                                    });
    } 

    preload() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

        this.game.time.advancedTiming = true;
    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.add.sprite(0, 0, 'sky');

        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
        this.game.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.0;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);

        this.stars = this.game.add.group();
        this.stars.enableBody = true;

        for (var i = 0; i < 12; i++)
        {
            var star : Phaser.Sprite = this.stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 6;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.scoreText = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.score = 0;


        this.cursors = this.game.input.keyboard.createCursorKeys();
    }

    update() {
        this.game.debug.text(String(this.game.time.fps), 2, 14, "#00ff00");
        var hitPlatform:boolean = this.game.physics.arcade.collide(this.player, this.platforms);

        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.stars, collectStar, null, this);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else
        {
            this.player.animations.stop();
            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform)
        {
            this.player.body.velocity.y = -350;
        }
    }

}

window.onload = () => {
    var game = new PhaserGame();
}