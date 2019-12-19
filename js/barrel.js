class Barrel {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, direction, shallDescend, posXSpeed = 3) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/enemies/barrel.png";

        this.imageDescending = new Image();
        this.imageDescending.src = "images/enemies/barrel-descending.png";

        this.frames = 4;
        this.framesIndex = 0;
        this.shallDescend = shallDescend;
        this.isDescending = false;
        this.stopAnimation = false;

        this.width = 96 / this.frames;
        this.height = 20;
        this.posX = posX;
        this.posY = posY - this.height;

        this.LADDERHEIGHT = this.posY - 90;

        this.posXSpeed = posXSpeed;
        this.posYSpeed = 2;
        this.directionX = direction;
    }

    draw(framesCounter) {

        if (this.stopAnimation) {
            this.posX = this.posX;
            this.posY = this.posY;
            return;
        }

        if (this.isDescending) {
            if (this.posY >= this.LADDERHEIGHT) this.isDescending = false;
            this.posY += this.posYSpeed;
            this.drawImage(this.imageDescending);
        } else {
            this.posX += this.posXSpeed * this.directionX;
            this.drawImage(this.image);
        }

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

        //this.ctx.fillRect(this.posX + this.width, this.posY - (this.height * 3), 1, this.height*2);
    }
}