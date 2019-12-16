class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 800;

        this.fps = 60;
        this.framesCounter = 0;

        this.ladders = [];
        this.platforms = [];
        this.barrels = [];
        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight, 30, this.canvasHeight - 50);
    }

    init() {
        this.generateScenary();

        this.interval = setInterval(() => {

            this.framesCounter++;

            this.clearAll();
            this.drawAll();
            this.moveAll();
            this.updatePlayerYBase();
            this.isPlayerOutOfPlatform();
            this.removeBarrels();

            if (this.framesCounter % 25 === 0) this.generateBarrel();
            if (this.hasCollidedWithBarrel()) this.gameOver();

            this.player.canClimb = this.isLadderClimbable() ? true : false;
            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;
        }, 1000 / this.fps);
    }

    drawAll() {
        this.ladders.forEach(ladder => ladder.draw());
        this.platforms.forEach(platform => platform.draw());
        this.barrels.forEach(barrel => barrel.draw(this.framesCounter));
        this.player.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    generateScenary() {

        let platforms = 5;
        let ladderWidth = 23;
        let ladderHeight = 90;

        this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 10, this.canvasHeight - 50))

        for (let i = 0; i <= platforms; i++) {
            this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 10, this.canvasHeight - (50 + ladderHeight * i) - ladderHeight));
            this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, Math.floor((Math.random() * (this.canvasWidth - ladderWidth)) + 1), this.canvasHeight - (50 + ladderHeight * i), 10));
        }
    }

    generateBarrel() {
        let barrelSpeedX = Math.floor((Math.random() * 3) + 2);
        let randomPlatform = this.getRandomPlatform();

        this.barrels.push(new Barrel(this.ctx, this.canvasWidth, this.canvasHeight, this.canvasWidth, randomPlatform.posY, -1, barrelSpeedX));
    }

    getRandomPlatform() {
        return this.platforms[Math.floor(Math.random() * (this.platforms.length - 1))];
    }

    getClosestPlatform() {
        return this.platforms.filter(platform => {
            return ((platform.posY + 10) > this.player.posY + this.player.height)
        }).reverse();
    }

    updatePlayerYBase() {

        let closestPlatform = this.getClosestPlatform();

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
            this.player.posX + this.player.width > ladder.posX &&
            ladder.posX + ladder.width > this.player.posX &&
            this.player.posY + this.player.height > ladder.posY - 5 &&
            ladder.posY - 5 + ladder.height > this.player.posY)
        )
    }

    hasCollidedWithBarrel() {

        let marginError = 30;

        return this.barrels.some(barrel => (
            (this.player.posX + marginError) + (this.player.width - marginError) > barrel.posX &&
            barrel.posX + barrel.width > (this.player.posX + marginError) &&
            (this.player.posY + marginError) + (this.player.height - marginError) > barrel.posY &&
            barrel.posY + barrel.height > (this.player.posY + marginError))
        )
    }

    removeBarrels() {
        this.barrels = this.barrels.filter(barrel => {
            return (barrel.directionX === -1 && barrel.posX + barrel.width > 0) ||
                (barrel.directionX === 1 && barrel.posX < this.canvasWidth);
        });
    }

    gameOver() {
        clearInterval(this.interval);
    }
}