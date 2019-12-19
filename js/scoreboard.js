class Scoreboard {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.posX = posX;
        this.posY = posY;
    }

    draw(score) {
        this.ctx.font = ".85em 'Press Start 2P'";
        this.ctx.textAlign = "end";
        this.ctx.fillText('MARIO', this.posX, this.posY - 20);
        this.ctx.fillText(score.toString().padStart(6, 0), this.posX, this.posY);
    }
}