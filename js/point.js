class Point {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, points) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.posX = posX;
        this.posY = posY;
        this.posYInitial = posY;
        this.points = points;
    }

    draw() {
        this.ctx.font = ".7em 'Press Start 2P'";
        this.ctx.textAlign = "start";
        this.ctx.fillText(this.points, this.posX, this.posY);
        this.posY -= .5;

        setTimeout(() => { this.posX = this.canvasWidth; }, 500);
    }
}