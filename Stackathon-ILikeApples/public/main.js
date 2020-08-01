
let width = 600;
let height = 800;

// 
let game = new Phaser.Game(width, height, Phaser.AUTO, '#game');

// 
let states = {
    //
    preload: function () {
        this.preload = function () {
            // 
            game.stage.backgroundColor = '#000000';
            // 
            game.load.crossOrigin = 'anonymous';
            game.load.image('bg', './assets/images/bg.png');
            game.load.image('dude', './assets/images/dude.png');
            game.load.image('green', './assets/images/green.png');
            game.load.image('red', './assets/images/red.png');
            game.load.image('yellow', './assets/images/yellow.png');
            game.load.image('bomb', './assets/images/bomb.png');
            game.load.image('five', './assets/images/five.png');
            game.load.image('three', './assets/images/three.png');
            game.load.image('one', './assets/images/one.png');
            game.load.image('star', './assets/images/star.png');
            game.load.image('logo', './assets/images/fa-logo@2x.png');
            //game.load.audio('bgMusic', './assets/audio/bgMusic.mp3');
            game.load.audio('scoreMusic', './assets/audio/addscore.mp3');
            game.load.audio('bombMusic', './assets/audio/boom.mp3');
            // 
            let progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);

            game.load.onFileComplete.add(function (progress) {
                progressText.text = progress + '%';
            });

            game.load.onLoadComplete.add(onLoad);

            let deadLine = false;
            setTimeout(function () {
                deadLine = true;
            }, 1000);

            function onLoad() {
                if (deadLine) {
                    game.state.start('created');
                } else {
                    setTimeout(onLoad, 1000);
                }
            }
        }
    },
    // 
    created: function () {
        this.create = function () {
            // 
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            let logo = game.add.image(50, 10, 'logo')
            logo.width = 450;
            logo.height = 150
            // 
            let title = game.add.text(game.world.centerX, game.world.height * 0.3, 'I like apples', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            // 
            var style = { font: "25px Arial", fill: "#ff0044", align: "center" };
            var text = game.add.text(game.world.centerX, game.world.centerY, "Tap to begin!", style);
            text.anchor.set(0.5, 0.5);
            text.alpha = 0.1;

            game.add.tween(text).to({ alpha: 1 }, 2000, "Linear", true);
            // 
            let man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            let manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            //
            game.input.onTap.add(function () {
                game.state.start('playlv1');
            });
        }
    },
    // state playlv1
    playlv1: function () {
        let man;
        let apples;
        let score = 0;
        let title;
        let scoreMusic;
        let bombMusic;
        //let bgMusic;
        let level = 1
        let levelTitle
        this.create = function () {
            score = 0;
            // 
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 300;

            // if (!bgMusic) {
            //     bgMusic = game.add.audio('bgMusic');
            //     bgMusic.loopFull();
            // }
            //
            scoreMusic = game.add.audio('scoreMusic');
            bombMusic = game.add.audio('bombMusic');
            // 
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 
            man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            let manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            game.physics.enable(man);
            man.body.allowGravity = false;
            //
            title = game.add.text(80, 20, 'Score:0', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            levelTitle = game.add.text(500, 20, 'Level:1', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: 'red'
            });
            levelTitle.anchor.setTo(0.5, 0.5);

            // 
            let touching = false;
            //
            game.input.onDown.add(function (pointer) {
                // 
                if (Math.abs(pointer.x - man.x) < man.width / 2) touching = true;
            });
            // 
            game.input.onUp.add(function () {
                touching = false;
            });
            // 
            game.input.addMoveCallback(function (pointer, x, y, isTap) {
                if (!isTap && touching) man.x = x;
            });
            // 
            apples = game.add.group();
            //
            let appleTypes = ['green', 'red', 'yellow', 'bomb'];
            let appleTimer = game.time.create(true);
            appleTimer.loop(1000, function () {
                let x = Math.random() * game.world.width;
                let index = Math.floor(Math.random() * appleTypes.length);
                let type = appleTypes[index];
                let apple = apples.create(x, 0, type);
                apple.type = type;
                // 
                game.physics.enable(apple);
                // 
                let appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
                // 
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function (apple, up, down, left, right) {
                    if (down) {
                        apple.kill();
                        if (apple.type !== 'bomb') game.state.start('over', true, false, [score, 1]);
                    }
                });
            });
            appleTimer.start();
        }

        this.update = function () {
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        }
        // 
        function pickApple(man, apple) {
            if (apple.type === 'bomb') {
                //
                bombMusic.play();
                game.state.start('over', true, false, [score, 1]);
            } else {
                let point = 1;
                let img = 'one';
                if (apple.type === 'red') {
                    point = 3;
                    img = 'three';
                } else if (apple.type === 'yellow') {
                    point = 5;
                    img = 'five';
                }
                // 
                let goal = game.add.image(apple.x, apple.y, img);
                let goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
                // 
                let showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

                showTween.onComplete.add(function () {
                    let hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);

                    hideTween.onComplete.add(function () {
                        goal.kill();
                    });
                });
                // 
                score += point;
                title.text = 'Score: ' + score + "/30";
                // 
                apple.kill();
                // 
                scoreMusic.play();
                if (score >= 30) {
                    game.state.start('playlv2')
                }
            }
        }

    },

    // state playlv2
    playlv2: function () {
        let man;
        let apples;
        let score = 0;
        let title;
        let scoreMusic;
        let bombMusic;
        // let bgMusic;
        let level = 2
        let levelTitle
        this.create = function () {
            score = 0;
            // 
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 400;

            // if (!bgMusic) {
            //     bgMusic = game.add.audio('bgMusic');
            //     bgMusic.loopFull();
            // }
            // 
            scoreMusic = game.add.audio('scoreMusic');
            bombMusic = game.add.audio('bombMusic');
            // 
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 
            man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            let manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            game.physics.enable(man);
            man.body.allowGravity = false;
            // 
            title = game.add.text(80, 20, 'Score:0', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            levelTitle = game.add.text(500, 20, 'Level:2', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: 'red'
            });
            levelTitle.anchor.setTo(0.5, 0.5);

            //
            let touching = false;
            // 
            game.input.onDown.add(function (pointer) {
                // 
                if (Math.abs(pointer.x - man.x) < man.width / 2) touching = true;
            });
            // 
            game.input.onUp.add(function () {
                touching = false;
            });
            //
            game.input.addMoveCallback(function (pointer, x, y, isTap) {
                if (!isTap && touching) man.x = x;
            });
            // 
            apples = game.add.group();
            //
            let appleTypes = ['green', 'red', 'yellow', 'bomb', 'bomb', 'bomb', 'bomb'];
            let appleTimer = game.time.create(true);
            appleTimer.loop(300, function () {
                let x = Math.random() * game.world.width;
                let index = Math.floor(Math.random() * appleTypes.length);
                let type = appleTypes[index];
                let apple = apples.create(x, 0, type);
                apple.type = type;
                //
                game.physics.enable(apple);
                // 
                let appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
                // 
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function (apple, up, down, left, right) {
                    if (down) {
                        apple.kill();
                        if (apple.type !== 'bomb') game.state.start('over', true, false, [score, 2]);
                    }
                });
            });
            appleTimer.start();
        }

        this.update = function () {
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        }
        // 
        function pickApple(man, apple) {
            if (apple.type === 'bomb') {
                // 
                bombMusic.play();
                game.state.start('over', true, false, [score, 2]);
            } else {
                let point = 1;
                let img = 'one';
                if (apple.type === 'red') {
                    point = 3;
                    img = 'three';
                } else if (apple.type === 'yellow') {
                    point = 5;
                    img = 'five';
                }
                // 
                let goal = game.add.image(apple.x, apple.y, img);
                let goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
                // 
                let showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

                showTween.onComplete.add(function () {
                    let hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);

                    hideTween.onComplete.add(function () {
                        goal.kill();
                    });
                });
                // 
                score += point;
                title.text = 'Score: ' + score + "/30";
                // 
                apple.kill();
                //
                scoreMusic.play();
                if (score >= 30) {
                    game.state.start('playlv3')
                }
            }
        }

    },

    // state playlv3
    playlv3: function () {
        let man;
        let apples;
        let score = 0;
        let title;
        let scoreMusic;
        let bombMusic;
        // let bgMusic;
        let level = 3
        let levelTitle
        this.create = function () {
            score = 0;
            // 
            game.physics.startSystem(Phaser.Physics.Arcade);
            game.physics.arcade.gravity.y = 600;
            // 
            // 
            // if (!bgMusic) {
            //     bgMusic = game.add.audio('bgMusic');
            //     bgMusic.loopFull();
            // }
            // 
            scoreMusic = game.add.audio('scoreMusic');
            bombMusic = game.add.audio('bombMusic');
            // 
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // 
            man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
            let manImage = game.cache.getImage('dude');
            man.width = game.world.width * 0.2;
            man.height = man.width / manImage.width * manImage.height;
            man.anchor.setTo(0.5, 0.5);
            game.physics.enable(man);
            man.body.allowGravity = false;

            title = game.add.text(80, 20, 'Score:0', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            levelTitle = game.add.text(500, 20, 'Level:3', {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: 'red'
            });
            levelTitle.anchor.setTo(0.5, 0.5);

            let touching = false;
            game.input.onDown.add(function (pointer) {
                if (Math.abs(pointer.x - man.x) < man.width / 2) touching = true;
            });

            game.input.onUp.add(function () {
                touching = false;
            });

            game.input.addMoveCallback(function (pointer, x, y, isTap) {
                if (!isTap && touching) man.x = x;
            });
            // apple group
            apples = game.add.group();
            // app type
            let appleTypes = ['green', 'red', 'yellow', 'bomb', 'bomb', 'bomb', 'bomb', 'bomb', 'bomb', 'bomb'];
            let appleTimer = game.time.create(true);
            appleTimer.loop(300, function () {
                let x = Math.random() * game.world.width;
                let index = Math.floor(Math.random() * appleTypes.length);
                let type = appleTypes[index];
                let apple = apples.create(x, 0, type);
                apple.type = type;
                // 
                game.physics.enable(apple);
                // 
                let appleImg = game.cache.getImage(type);
                apple.width = game.world.width / 8;
                apple.height = apple.width / appleImg.width * appleImg.height;
                // 
                apple.body.collideWorldBounds = true;
                apple.body.onWorldBounds = new Phaser.Signal();
                apple.body.onWorldBounds.add(function (apple, up, down, left, right) {
                    if (down) {
                        apple.kill();
                        if (apple.type !== 'bomb') game.state.start('over', true, false, [score, 3]);
                    }
                });
            });
            appleTimer.start();
        }

        this.update = function () {
            game.physics.arcade.overlap(man, apples, pickApple, null, this);
        }
        // add a callback function
        function pickApple(man, apple) {
            if (apple.type === 'bomb') {
                // music
                bombMusic.play();
                game.state.start('over', true, false, [score, 3]);
            } else {
                let point = 1;
                let img = 'one';
                if (apple.type === 'red') {
                    point = 3;
                    img = 'three';
                } else if (apple.type === 'yellow') {
                    point = 5;
                    img = 'five';
                }
                // add img
                let goal = game.add.image(apple.x, apple.y, img);
                let goalImg = game.cache.getImage(img);
                goal.width = apple.width;
                goal.height = goal.width / (goalImg.width / goalImg.height);
                goal.alpha = 0;
                // 
                let showTween = game.add.tween(goal).to({
                    alpha: 1,
                    y: goal.y - 20
                }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);

                showTween.onComplete.add(function () {
                    let hideTween = game.add.tween(goal).to({
                        alpha: 0,
                        y: goal.y - 20
                    }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);

                    hideTween.onComplete.add(function () {
                        goal.kill();
                    });
                });
                // update score
                score += point;
                title.text = 'Score: ' + score + "/30";
                // clear apples
                apple.kill();
                // music
                scoreMusic.play();
                if (score >= 30) {
                    game.state.start('Win')
                }
            }
        }

    },

    // win state
    Win: function () {

        this.create = function () {
            // add background pic
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // add text
            let title = game.add.text(game.world.centerX, game.world.height * 0.25, 'You Win!', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);

            let title2 = game.add.text(game.world.centerX, game.world.height * 0.35, 'Amazing!', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: 'red'
            });
            title2.anchor.setTo(0.5, 0.5);

            let remind = game.add.text(game.world.centerX, game.world.height * 0.6, 'Tap to play again!', {
                fontSize: '25px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // tap listener
            game.input.onTap.add(function () {
                game.state.start('playlv1');
            });
        }
    },
    // over state
    over: function () {
        let score = 0;
        let level = 1;
        this.init = function () {
            score = arguments[0][0];
            level = arguments[0][1]
        }
        this.create = function () {
            // background pic
            let bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
            // text
            let title = game.add.text(game.world.centerX, game.world.height * 0.25, 'Game over', {
                fontSize: '40px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            title.anchor.setTo(0.5, 0.5);
            let scoreStr = 'Your score：' + score;
            let scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            scoreText.anchor.setTo(0.5, 0.5);
            let levelStr = 'Your level：' + level;
            let levelText = game.add.text(game.world.centerX, game.world.height * 0.5, levelStr, {
                fontSize: '30px',
                fontWeight: 'bold',
                fill: 'red'
            });
            levelText.anchor.setTo(0.5, 0.5);
            let remind = game.add.text(game.world.centerX, game.world.height * 0.6, 'Tap to play again!', {
                fontSize: '25px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            // Tap listenser
            game.input.onTap.add(function () {
                game.state.start('playlv1');
            });
        }
    }
};

// put functions into states
Object.keys(states).map(function (key) {
    game.state.add(key, states[key]);
});

// start the game
game.state.start('preload');