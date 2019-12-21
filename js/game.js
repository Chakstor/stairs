class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.ctx.fillStyle = 'white';

        this.canvasWidth = 900;
        this.canvasHeight = 800;

        this.fps = 60;
        this.framesCounter = 0;
        this.isGameOver = false;
        this.currentStage = 1;
        this.maxStages = 2;

        this.collectableItems = {
            'umbrella': {
                image: 'images/items/umbrella.png',
                width: 32,
                height: 30
            },
            'purse': {
                image: 'images/items/purse.png',
                width: 18,
                height: 25
            },
            'key': {
                image: 'images/items/key.png',
                width: 28,
                height: 32
            }
        };

        this.ladders = [];
        this.platforms = [];
        this.barrels = [];
        this.generatedItems = [];
        this.pauline = {};

        this.soundPlayer = new soundPlayer();
        this.scoreboard = new Scoreboard(this.ctx, this.canvasWidth, this.canvasHeight, 5, 50);
        this.itemBag = new ItemBag(this.ctx, this.canvasWidth, this.canvasHeight, 660, 10, this.collectableItems);
        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight, 30, this.canvasHeight - 50, this);

        this.setListener();
    }

    init(stage) {
        this.chooseStage(stage);
        this.renderLoop();

        this.soundPlayer.play(intro);

        intro.addEventListener('ended', () => {
            this.soundPlayer.play(theme, true);
        });
    }

    renderLoop() {
        this.interval = setInterval(() => {

            this.framesCounter++;

            this.moveAll();
            this.clearAll();
            this.drawAll();
            this.updatePlayerYBase();

            if (this.currentStage !== 2) {
                this.removeBarrels();
                this.makeBarrelDescend();
                this.hasPlayerJumpedOverABarrel();
            }

            if (this.currentStage !== 2 && this.hasPlayerCollidedWithBarrel()) this.playerLose();

            if (!this.isGameOver && this.framesCounter % 300 === 0 && this.scoreboard.bonusScore > 0) this.scoreboard.bonusScore -= 100;
            if (this.currentStage !== 2 && !this.isGameOver && this.framesCounter % 80 === 0) this.generateBarrel();

            if (this.hasPlayerReachedGoal(this.pauline)) {
                if (!this.itemBag.checkItem('key')) this.pauline.says('missing key');
                if (this.itemBag.checkItem('key')) this.playerWin();
            }

            this.player.canClimb = this.isLadderClimbable() ? true : false;

            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;

        }, 1000 / this.fps);
    }

    drawAll() {
        this.platforms.forEach(platform => platform.draw());
        this.ladders.forEach(ladder => ladder.draw());
        this.barrels.forEach(barrel => barrel.draw(this.framesCounter));
        this.generatedItems.forEach(item => item.draw());

        this.water && this.water.draw();
        this.point && this.point.draw();

        this.scoreboard.draw();
        this.itemBag.draw();

        this.player.draw(this.framesCounter);
        this.pauline.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
        this.platforms.forEach(platform => platform.move() )
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    sumPoints(points, posX, posY) {
        this.scoreboard.score += points;
        this.point = new Point(this.ctx, this.canvasWidth, this.canvasHeight, posX, posY, points);
    }

    chooseStage(level) {

        this.currentStage = level || 1;

        switch (level) {
            case 2:
                this.generateStage2();
                break;
            default:
                this.generateStage();
        }
    }


    // -------------
    // STAGE
    // -------------
    generateStage(platformsQty = 6) {

        let ladderHeight = 90;
        let collectableItemsCount = 0;
        let collectableItemsKeys = Object.keys(this.collectableItems).sort(() => Math.random() - 0.5);

        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight - 50, this.canvasWidth));

        for (let i = 0; i < platformsQty; i++) {

            let min = i % 2 === 0 ? 100 : this.canvasWidth / 2;
            let max = i % 2 === 0 ? this.canvasWidth / 2 : this.canvasWidth - 100;

            let posY = this.canvasHeight - (50 + ladderHeight * i);

            this.platforms.push(new Platform(this.ctx, 0, posY - ladderHeight, this.canvasWidth));
            this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, this.generateRandomXPosition(min, max), posY, 90));

            if (collectableItemsCount <= collectableItemsKeys.length && i % 2 === 0) {
                this.placeCollectableItems(collectableItemsKeys[collectableItemsCount], this.collectableItems[collectableItemsKeys[collectableItemsCount]], posY, collectableItemsCount);
                collectableItemsCount++;
            }
        }

        this.setPaulinePosition(this.platforms);
    }

    placeCollectableItems(key, item, posY, itemCount) {

        let min = itemCount % 2 !== 0 ? 50 : this.canvasWidth / 1.5;
        let max = itemCount % 2 !== 0 ? this.canvasWidth / 5 : this.canvasWidth - 100;

        item.name = key;
        item.posX = this.generateRandomXPosition(min, max);
        item.posY = posY - 50;
        this.generatedItems.push(new Item(this.ctx, this.canvasWidth, this.canvasHeight, item, this));
    }

    generateRandomXPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // -------------
    // STAGE 2 - BETA
    // Needs refactor :)
    // -------------
    generateStage2() {

        this.water = new Water(this.ctx, 0, this.canvasHeight - 15, this.canvasWidth);

        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight + this.player.height, this.canvasWidth));

        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight - 50, 88));
        this.platforms.push(new Platform(this.ctx, 100, this.canvasHeight - 50, 88, 'x', 100, this.canvasWidth - 100));

        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, 60, this.canvasHeight - 50, 100));
        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight - 150, 88));
        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, 5, this.canvasHeight - 150, 150));

        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight - 300, 60));

        this.platforms.push(new Platform(this.ctx, 70, this.canvasHeight - 300, 40, 'y', this.canvasHeight - 450, this.canvasHeight - 300));

        this.platforms.push(new Platform(this.ctx, 0, this.canvasHeight - 450, 60));

        this.platforms.push(new Platform(this.ctx, 200, this.canvasHeight - 150, 50));
        this.platforms.push(new Platform(this.ctx, 260, this.canvasHeight - 300, 40, 'y', this.canvasHeight - 300, this.canvasHeight - 150));

        this.platforms.push(new Platform(this.ctx, 310, this.canvasHeight - 300, 40));
        this.platforms.push(new Platform(this.ctx, 360, this.canvasHeight - 340, 40));
        this.platforms.push(new Platform(this.ctx, 410, this.canvasHeight - 380, 40));

        this.platforms.push(new Platform(this.ctx, 520, this.canvasHeight - 230, 380));
        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, 5, this.canvasHeight - 150, 150));
        this.platforms.push(new Platform(this.ctx, 700, this.canvasHeight - 330, 200));
        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth - 200, this.canvasHeight - 230, 100));
        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth - 50, this.canvasHeight - 330, 270));
        this.platforms.push(new Platform(this.ctx, this.canvasWidth - 100, 200, 100));

        this.platforms.push(new Platform(this.ctx, this.canvasWidth / 2, 200, 88, 'x', this.canvasWidth / 2, this.canvasWidth - 190));
        this.platforms.push(new Platform(this.ctx, 0, 200, this.canvasWidth / 2));

        this.collectableItems['umbrella'].name = 'umbrella';
        this.collectableItems['umbrella'].posX = 15;
        this.collectableItems['umbrella'].posY = 280;
        this.generatedItems.push(new Item(this.ctx, this.canvasWidth, this.canvasHeight, this.collectableItems['umbrella'], this));

        this.collectableItems['purse'].name = 'purse';
        this.collectableItems['purse'].posX = 680;
        this.collectableItems['purse'].posY = 310;
        this.generatedItems.push(new Item(this.ctx, this.canvasWidth, this.canvasHeight, this.collectableItems['purse'], this));

        this.collectableItems['key'].name = 'key';
        this.collectableItems['key'].posX = this.canvasWidth - 90;
        this.collectableItems['key'].posY = this.canvasHeight - 120;
        this.generatedItems.push(new Item(this.ctx, this.canvasWidth, this.canvasHeight, this.collectableItems['key'], this));

        this.setPaulinePosition(this.platforms);
    }


    // -------------
    // LADDERS
    // -------------
    isLadderClimbable() {
        return this.ladders.some(ladder => (
            this.player.posX + this.player.width/3 > ladder.posX &&
            ladder.posX + ladder.width/3 > this.player.posX &&
            this.player.posY + this.player.height > ladder.posY &&
            ladder.posY + ladder.height > this.player.posY)
        )
    }


    // -------------
    // PLATFORMS
    // -------------
    getRandomPlatform() {
        return this.platforms[Math.floor(Math.random() * (this.platforms.length - 1))];
    }

    getPlayersClosestPlatform() {
        return this.platforms.filter(platform => {
            return (
                platform.posY + 10 > this.player.posY + this.player.height &&
                (this.player.posX + this.player.width > platform.posX && this.player.posX < platform.posX + platform.width)
            )
        }).reverse();
    }


    // -------------
    // BARRELS
    // -------------
    generateBarrel() {
        let barrelSpeedX = Math.floor((Math.random() * 3) + 2);
        let randomPlatform = this.getRandomPlatform();
        let shallBarrelDescend = !Math.round(Math.random());

        this.barrels.push(new Barrel(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth, randomPlatform.posY, -1, shallBarrelDescend, barrelSpeedX));
    }

    makeBarrelDescend() {
        this.ladders.forEach(ladder => {
            this.barrels.forEach(barrel => {
                if (barrel.posX + barrel.width / 12 > ladder.posX &&
                    ladder.posX + ladder.width / 12 > barrel.posX &&
                    barrel.posY + barrel.height > ladder.posY - barrel.height &&
                    (ladder.posY - barrel.height) + ladder.height > barrel.posY) {
                        if (barrel.shallDescend) barrel.isDescending = true;
                    }
            })
        })
    }

    removeBarrels() {
        this.barrels = this.barrels.filter(barrel => {
            return (barrel.directionX === -1 && barrel.posX + barrel.width > 0) ||
                (barrel.directionX === 1 && barrel.posX < this.canvasWidth);
        });
    }


    // -------------
    // PLAYER'S ACTIONS
    // -------------
    hasPlayerCollidedWithBarrel() {

        let marginError = 0;

        return this.barrels.some(barrel => (
            (this.player.posX + marginError) + (this.player.width - marginError) > barrel.posX &&
            barrel.posX + barrel.width > (this.player.posX + marginError) &&
            (this.player.posY + marginError) + (this.player.height - marginError) > barrel.posY &&
            barrel.posY + barrel.height > (this.player.posY + marginError))
        )
    }

    hasPlayerJumpedOverABarrel() {

        let hasJumpedOverBarrel = this.barrels.some(barrel => (
            this.player.posX + this.player.width > barrel.posX + barrel.width &&
            barrel.posX > this.player.posX &&
            this.player.posY + this.player.height > barrel.posY - (barrel.height * 2) &&
            barrel.posY > this.player.posY + this.player.height
        ));

        if (hasJumpedOverBarrel) {
            this.sumPoints(100, this.player.posX - 20, this.player.posY + this.player.height + 10);
            this.soundPlayer.play(pointsSound);
        }
    }

    hasPlayerReachedGoal(goal) {

        let marginError = 15;

        return (
            this.player.posX + this.player.width >= goal.jailX - marginError &&
            (goal.jailX + marginError) + goal.jailWidth > this.player.posX &&
            this.player.posY + this.player.height > goal.jailY &&
            goal.jailY + goal.jailHeight > this.player.posY
        );
    }

    updatePlayerYBase() {

        let closestPlatform = this.getPlayersClosestPlatform();

        if (closestPlatform.length) {
            this.player.posYBase = closestPlatform[0].posY - this.player.height;
            this.player.currentPlatform = closestPlatform[0];
        }
    }


    // -------------
    // ITEMS
    // -------------

    collectItem(item) {
        this.soundPlayer.play(gotItemSound);
        this.itemBag.setItem(item);
        this.sumPoints(300, this.player.posX + this.player.width, this.player.posY - 10);
        this.generatedItems = this.generatedItems.filter(i => i.item.name !== item.name);
    }

    setPaulinePosition(platforms) {

        let posX = this.canvasWidth / 7;
        let posY = platforms[platforms.length - 1].posY;

        this.pauline = new Pauline(this.ctx, this.canvasWidth, this.canvasHeight, posX, posY, this);
        this.pauline.posY = posY - this.pauline.height;
    }


    // -------------
    // GAME ENDS
    // -------------
    playerLose() {
        this.isGameOver = true;
        this.player.isDying = true;
        this.barrels = [];

        this.soundPlayer.stop(theme);
        this.soundPlayer.play(dieSound);

        setTimeout(() => { goToStage(this.currentStage) }, 5000);
    }

    playerWin() {
        this.isGameOver = true;

        this.soundPlayer.stop(theme);
        this.soundPlayer.play(roundClear);
        this.scoreboard.updateScore();

        this.pauline.openJail();

        setTimeout(() => { clearInterval(this.interval) }, 20);

        if (this.currentStage < this.maxStages) {
            setTimeout(() => { goToStage(stage++) }, 5000);
        }
    }


    // -------------
    // Listeners
    // -------------
    setListener() {
        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 49: // 1
                    goToStage(1);
                    break;
                case 50: // 2
                    goToStage(2);
                    break;
            }
        });
    }
}