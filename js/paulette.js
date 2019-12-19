class Paulette {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/paulette/paulette.png";

        this.frames = 2;
        this.framesIndex = 0;

        this.width = 60 / this.frames;
        this.height = 44;
        this.posX = posX;
        this.posY = posY - this.height;
    }

    draw(framesCounter) {

        this.drawImage(this.image);

        if (framesCounter % 80 === 0) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 1 ? 0 : this.framesIndex;
        }
    }

    drawImage(image) {
        this.ctx.drawImage(
            image,
            this.framesIndex * Math.floor(image.width / this.frames),
            0,
            Math.floor(image.width / this.frames),
            image.height,
            this.posX,
            this.posY,
            this.width,
            this.height
        );
    }
}