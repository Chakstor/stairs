class Scoreboard {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.posX = posX;
        this.posY = posY;

        this.score = 0;
        this.bonusScore = 5000;
    }

    draw() {
        this.ctx.closePath();
        this.ctx.beginPath();

        // Score
        this.ctx.textAlign = "start";

        this.ctx.fillStyle = "#e20f5a";
        this.ctx.font = ".85em 'Press Start 2P'";
        this.ctx.fillText('TOPSCORE-', this.posX, this.posY - 20);

        this.ctx.fillStyle = "#5aacc1";
        this.ctx.font = ".75em 'Press Start 2P'";
        this.ctx.fillText('SCORE-', this.posX, this.posY);

        this.ctx.fillStyle = "#fff";
        this.ctx.font = ".85em 'Press Start 2P'";
        this.ctx.fillText(this.score.toString().padStart(6, 0), this.posX + 125, this.posY - 20);

        this.ctx.font = ".75em 'Press Start 2P'";
        this.ctx.fillText(this.score.toString().padStart(6, 0), this.posX + 75, this.posY);

        // Bonus
        this.ctx.lineWidth = 2;
        this.ctx.rect(this.canvasWidth - 85, this.posY - 27, 68, 22);
        this.ctx.strokeStyle = "#e20f5a";
        this.ctx.stroke();

        this.ctx.closePath();
        this.ctx.beginPath();

        this.ctx.rect(this.canvasWidth - 90, this.posY - 38, 78, 38);
        this.ctx.strokeStyle = "#5aacc1";
        this.ctx.stroke();

        this.ctx.textAlign = "center";
        this.ctx.font = ".75em 'Press Start 2P'";

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 8;
        this.ctx.strokeText('BONUS', this.canvasWidth - 50, 20);
        this.ctx.fillStyle = '#e20f5a';
        this.ctx.fillText('BONUS', this.canvasWidth - 50, 20);

        this.ctx.font = ".95em 'Press Start 2P'";
        this.ctx.fillStyle = "#fff"
        this.ctx.fillText(this.bonusScore, this.canvasWidth - 50, this.posY - 8);
    }

    updateScore() {
        this.score += this.bonusScore;
        this.bonusScore = 0;
    }
}