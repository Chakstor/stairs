class Water {
    constructor(ctx, posX, posY, width) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "images/scenario/water.png";

        this.width = width;
        this.height = 15;

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