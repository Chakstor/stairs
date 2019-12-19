class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.ctx.fillStyle = 'white';

        this.canvasWidth = 900;
        this.canvasHeight = 800;

        this.fps = 60;
        this.framesCounter = 0;
        this.isGameOver = false;

        this.ladders = [];
        this.platforms = [];
        this.barrels = [];
        this.paulette = {};
        this.score = 0;

        this.scoreboard = new Scoreboard(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth - 20, 100);
        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight, 30, this.canvasHeight - 50, this);
    }

    init() {
        this.generateScenary(5);
        this.generateBarrel()

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

            if (this.framesCounter % 100 === 0) this.generateBarrel();

            if (this.hasPlayerCollidedWithBarrel()) this.playerLose();
            if (this.hasPlayerReachedGoal(this.paulette)) this.playerWin();

            this.player.canClimb = this.isLadderClimbable() ? true : false;

            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;

        }, 1000 / this.fps);
    }

    drawAll() {
        this.platforms.forEach(platform => platform.draw());
        this.ladders.forEach(ladder => ladder.draw());
        this.barrels.forEach(barrel => barrel.draw(this.framesCounter));

        this.point && this.point.draw();
        this.scoreboard.draw(this.score);
        this.player.draw(this.framesCounter);
        this.paulette.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    generateScenary(platformsQty) {

        let ladderHeight = 90;

        this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 10, this.canvasHeight - 50))

        for (let i = 0; i <= platformsQty; i++) {

            let min = i % 2 === 0 ? 100 : this.canvasWidth / 2;
            let max = i % 2 === 0 ? this.canvasWidth / 2 : this.canvasWidth - 100;

            this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 0, this.canvasHeight - (50 + ladderHeight * i) - ladderHeight));
            this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, this.generateRandomXPosition(min, max), this.canvasHeight - (50 + ladderHeight * i), 90));
        }

        let paulettePosX = this.canvasWidth - this.ladders[this.ladders.length - 1].posX;
        let paulettePosY = this.platforms[this.platforms.length - 1].posY;

        this.setPaulettePosition(paulettePosX, paulettePosY);
    }

    generateRandomXPosition(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    setPaulettePosition(posX, posY) {
        this.paulette = new Paulette(this.ctx, this.canvasWidth, this.canvasHeight, posX, 0);
        this.paulette.posY = posY - this.paulette.height;
    }

    generateBarrel() {
        let barrelSpeedX = Math.floor((Math.random() * 3) + 2);
        let randomPlatform = this.getRandomPlatform();
        let shallBarrelDescend = !Math.round(Math.random());

        this.barrels.push(new Barrel(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth, randomPlatform.posY, -1, shallBarrelDescend, barrelSpeedX));
    }

    getRandomPlatform() {
        return this.platforms[Math.floor(Math.random() * (this.platforms.length - 1))];
    }

    getPlayersClosestPlatform() {
        return this.platforms.filter(platform => {
            return ((platform.posY + 10) > this.player.posY + this.player.height)
        }).reverse();
    }

    updatePlayerYBase() {

        let closestPlatform = this.getPlayersClosestPlatform();

        if (closestPlatform.length) {
            this.player.posYBase = closestPlatform[0].posY - this.player.height;
            this.player.currentPlatform = closestPlatform[0];
        }
    }

    isPlayerOutOfPlatform() {

        let currentPlatform = this.player.currentPlatform;

        if (this.player.posX > currentPlatform.posX + currentPlatform.width) {
            this.player.posYBase = this.platforms[0].posY - this.player.height;
        }
    }

    isLadderClimbable() {
        return this.ladders.some(ladder => (
            this.player.posX + this.player.width/3 > ladder.posX &&
            ladder.posX + ladder.width/3 > this.player.posX &&
            this.player.posY + this.player.height > ladder.posY &&
            ladder.posY + ladder.height > this.player.posY)
        )
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

        let barrels = this.barrels.some(barrel => (
            this.player.posX + this.player.width > barrel.posX + barrel.width &&
            barrel.posX > this.player.posX &&
            this.player.posY + this.player.height > barrel.posY - (barrel.height * 2.5) &&
            barrel.posY > this.player.posY + this.player.height
        ));

        if (barrels) {
            this.points = 100;
            this.score += this.points;
            this.point = new Point(this.ctx, this.canvasWidth, this.canvasHeight, this.player.posX + this.player.width, this.player.posY + 10, this.points);
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

    removeBarrels() {
        this.barrels = this.barrels.filter(barrel => {
            return (barrel.directionX === -1 && barrel.posX + barrel.width > 0) ||
                (barrel.directionX === 1 && barrel.posX < this.canvasWidth);
        });
    }

    playerLose() {
        this.isGameOver = true;
        this.player.isDead = true;
        clearInterval(this.interval);
    }

    playerWin() {
        clearInterval(this.interval);
    }
}