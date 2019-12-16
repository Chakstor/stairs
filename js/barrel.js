class Barrel {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, direction, posXSpeed = 3) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/enemies/barrel.png";

        this.frames = 4;
        this.framesIndex = 0;

        this.width = 96 / this.frames;
        this.height = 20;
        this.posX = posX;
        this.posY = posY - this.height;

        this.posXSpeed = posXSpeed;
        this.directionX = direction;
    }

    draw(framesCounter) {

        this.posX += this.posXSpeed * this.directionX;

        this.drawImage(this.image);

        if (framesCounter % 4 === 0) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 3 ? 0 : this.framesIndex;
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