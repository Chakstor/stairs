class Player {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/mario/standing_walking.png";

        this.frames = 3;
        this.framesIndex = 0;

        this.width = 90 / this.frames;
        this.height = 32;
        this.posX = 40;
        this.posY = 50;
    }

    draw(frameCounter) {
        this.ctx.drawImage(
            this.image,
            this.framesIndex * Math.floor(this.image.width / this.frames),
            0,
            Math.floor(this.image.width / this.frames),
            this.image.height,
            this.posX,
            this.posY,
            this.width,
            this.height
        );
    }
}