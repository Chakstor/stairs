class Game {
    constructor() {
        this.ctx = document.getElementById('stairs').getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 900;

        this.fps = 60;
        this.framesCounter = 0;

        this.isGameOver = false;
    }

    init() {
        this.interval = setInterval(() => {
            this.framesCounter++;
            this.framesCounter = (this.framesCounter > 1000) ? this.framesCounter = 0 : this.framesCounter;
        }, 1000 / this.fps);
    }
}