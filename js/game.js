class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 900;

        this.fps = 60;
        this.framesCounter = 0;

        this.isGameOver = false;

        this.player = new Player(this.ctx, this.canvasWidth, this.canvasHeight);
    }

    init() {
        this.interval = setInterval(() => {
            this.framesCounter++;

            this.clearAll();
            this.drawAll();
            this.moveAll();

            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;
        }, 1000 / this.fps);
    }

    drawAll() {
        this.player.draw(this.framesCounter);
    }

    moveAll() {
        this.player.move();
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }
}