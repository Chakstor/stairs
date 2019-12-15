class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 800;

        this.fps = 60;
        this.framesCounter = 0;

        this.isGameOver = false;

        this.ladders = [];
        this.platforms = [];
        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight, 30, this.canvasHeight - 50);
    }

    init() {
        this.generateLadder();
        this.generatePlaform();

        this.interval = setInterval(() => {
            this.framesCounter++;

            this.clearAll();
            this.drawAll();
            this.moveAll();
            this.updatePlayerYBase();

            this.player.canClimb = this.isClimbable() ? true : false;
            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;
        }, 1000 / this.fps);
    }

    drawAll() {
        this.ladders.forEach(ladder => ladder.draw());
        this.platforms.forEach(platform => platform.draw());
        this.player.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    generatePlaform() {
        this.platforms.push(new Platform(this.ctx, this.canvasWidth, this.canvasHeight, 10, this.canvasHeight - 50))
        this.platforms.push(new Platform(this.ctx, this.canvasWidth - 400, this.canvasHeight, 10, this.canvasHeight - 50 - 90))
    }

    generateLadder() {
        this.ladders.push(new Ladder(this.ctx, this.canvasWidth, this.canvasHeight, 300, this.canvasHeight - 50, 10))
    }

    updatePlayerYBase() {

        let closestPlatform = this.platforms.filter(platform => {
            return ((platform.posY + 1) > this.player.posY + this.player.height)
        }).reverse()[0];

        //console.log((closestPlatform && closestPlatform.posY) || this.player.posYBase);
        //console.log(closestPlatform[0] && closestPlatform[0].posY);

        // if (closestPlatform[0] && closestPlatform[0].posY)
        //     console.log(this.player.posYBase);
    }

    isClimbable() {
        return this.ladders.some(ladder => (
            this.player.posX + this.player.width > ladder.posX &&
            ladder.posX + ladder.width > this.player.posX &&
            this.player.posY + this.player.height > ladder.posY - 5 &&
            ladder.posY - 5 + ladder.height > this.player.posY)
        )
    }
}