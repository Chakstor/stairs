class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.ctx.fillStyle = 'white';

        this.canvasWidth = 900;
        this.canvasHeight = 800;

        this.fps = 60;
        this.framesCounter = 0;
        this.isGameOver = false;

        this.collectableItems = {
            'umbrella': {
                image: 'images/items/umbrella.png',
                width: 32,
                height: 30
            },
            'purse': {
                image: 'images/items/purse.png',
                width: 24,
                height: 33
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
        this.paulette = {};
        this.score = 0;
        this.bonusScore = 5000;

        this.soundPlayer = new soundPlayer();
        this.scoreboard = new Scoreboard(this.ctx, this.canvasWidth, this.canvasHeight, 5, 50);
        this.itemBag = new ItemBag(this.ctx, this.canvasWidth, this.canvasHeight, 660, 10, this.collectableItems);
        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight, 30, this.canvasHeight - 50, this);
    }

    init() {
        this.generateScenary();
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
            this.removeBarrels();
            this.updatePlayerYBase();
            this.makeBarrelDescend();
            this.isPlayerOutOfPlatform();
            this.hasPlayerJumpedOverABarrel();

            if (this.hasPlayerCollidedWithBarrel()) this.playerLose();

            if (!this.isGameOver && this.framesCounter % 300 === 0) this.bonusScore -= 100;
            if (!this.isGameOver && this.framesCounter % 100 === 0) this.generateBarrel();

            if (this.hasPlayerReachedGoal(this.paulette)) {
                if (!this.itemBag.checkItem('key')) this.paulette.says('missing key');
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

        this.point && this.point.draw();
        this.scoreboard.draw(this.score, this.bonusScore);
        this.itemBag.draw();

        this.player.draw(this.framesCounter);
        this.paulette.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    generateScenary(platformsQty = 5) {

        let ladderHeight = 90;
        let collectableItemsKeys = Object.keys(this.collectableItems).sort(() => Math.random() - 0.5);

        this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 10, this.canvasHeight - 50));

        for (let i = 0; i <= platformsQty; i++) {

            let min = i % 2 === 0 ? 100 : this.canvasWidth / 2;
            let max = i % 2 === 0 ? this.canvasWidth / 2 : this.canvasWidth - 100;

            let posY = this.canvasHeight - (50 + ladderHeight * i);

            this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 0, posY - ladderHeight));
            this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, this.generateRandomXPosition(min, max), posY, 90));

            if (i < collectableItemsKeys.length) this.placeCollectableItems(collectableItemsKeys[i], this.collectableItems[collectableItemsKeys[i]], posY);
        }


        this.setPaulettePosition(this.ladders, this.platforms);
    }

    generateRandomXPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setPaulettePosition(platforms) {

        let posX = this.canvasWidth/7;
        let posY = platforms[platforms.length - 1].posY;

        this.paulette = new Paulette(this.ctx, this.canvasWidth, this.canvasHeight, posX, 0);
        this.paulette.posY = posY - this.paulette.height;
    }

    sumPoints(points, posX, posY) {
        this.score += points;
        this.point = new Point(this.ctx, this.canvasWidth, this.canvasHeight, posX, posY, points);
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
            return ((platform.posY + 10) > this.player.posY + this.player.height)
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
            this.sumPoints(100, this.player.posX + this.player.width, this.player.posY + 30);
            this.soundPlayer.play(pointsSound);
        }
    }

    hasPlayerReachedGoal(goal) {
        return (
            this.player.posX + this.player.width > goal.posX &&
            goal.posX + goal.width > this.player.posX &&
            this.player.posY + this.player.height > goal.posY &&
            goal.posY + goal.height > this.player.posY
        );
    }

    isPlayerOutOfPlatform() {

        let currentPlatform = this.player.currentPlatform;

        if (this.player.posX > currentPlatform.posX + currentPlatform.width) {
            this.player.posYBase = this.platforms[0].posY - this.player.height;
        }
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
    placeCollectableItems(key, item, posY) {
        item.name = key;
        item.posX = this.generateRandomXPosition(700, 800);
        item.posY = posY - 50;
        this.generatedItems.push(new Item(this.ctx, this.canvasWidth, this.canvasHeight, item, this));
    }

    collectItem(item) {
        this.soundPlayer.play(gotItemSound);
        this.itemBag.setItem(item);
        this.sumPoints(300, this.player.posX + this.player.width, this.player.posY + 10);
        this.generatedItems = this.generatedItems.filter(i => i.item.name !== item.name);
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

        // clearInterval(this.interval);
    }

    playerWin() {
        this.soundPlayer.stop(theme);
        this.soundPlayer.play(roundClear);

        clearInterval(this.interval);
    }
}