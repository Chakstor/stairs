class Paulette {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, game) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.game = game;

        this.image = new Image();
        this.image.src = "images/paulette/paulette.png";

        this.frames = 2;
        this.framesIndex = 0;

        this.width = 60 / this.frames;
        this.height = 44;
        this.posX = posX;
        this.posY = posY - this.height;

        this.jailX = this.posX - 60;
        this.jailY = this.posY + 180;
        this.jailWidth = 150;
        this.jailHeight = 74;
    }

    says(text) {
        this.ctx.font = ".6em 'Press Start 2P'";
        this.ctx.textAlign = "center";

        switch(text) {
            case 'missing key':
                this.ctx.fillText('You need the key!', this.posX + this.width / 2, this.posY - 13);
        }
    }

    draw(framesCounter) {

        this.drawImage(this.image);
        this.drawJail();

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

    drawJail() {
        this.ctx.closePath();
        this.ctx.beginPath();

        this.ctx.lineWidth = 2;

        this.ctx.rect(this.jailX, this.jailY, this.jailWidth, this.jailHeight);
        this.ctx.strokeStyle = "#5aacc1";
        this.ctx.stroke();

        for (let i = 0; i < 6; i++) {
            this.ctx.moveTo(this.posX - 40 + (21.6 * i), this.posY - this.height + 13);
            this.ctx.lineTo(this.posX - 40 + (21.6 * i), this.posY - this.height + 87);
        }

        this.ctx.stroke();
    }

    openJail() {
        this.ctx.clearRect(this.posX + (30 * 2), this.posY - this.height + 15, 20, 72);
    }
}