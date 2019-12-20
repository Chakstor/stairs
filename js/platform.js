class Platform {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, width = canvasWidth) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/scenario/platform.png";

        this.width = width;
        this.height = 16;
        this.posX = posX;
        this.posY = posY;
    }

    draw() {
        this.ctx.save();

        this.ctx.fillStyle = this.ctx.createPattern(this.image, 'repeat');
        this.ctx.translate(this.posX, this.posY);
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }
}