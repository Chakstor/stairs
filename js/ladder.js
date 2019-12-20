class Ladder {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, height) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = "images/scenario/ladder.png";

        this.width = 23;
        this.height = height;
        this.posX = posX;
        this.posY = posY - this.height;
    }

    draw() {
        this.ctx.save();

        this.ctx.fillStyle = this.ctx.createPattern(this.image, 'repeat-y');
        this.ctx.translate(this.posX, this.posY);
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }
}