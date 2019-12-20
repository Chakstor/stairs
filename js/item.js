class Item {
    constructor(ctx, canvasWidth, canvasHeight, itemProperties, game) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.game = game;

        this.item = itemProperties;

        this.image = new Image();
        this.image.src = this.item.image;

        this.width = this.item.width;
        this.height = this.item.height;
        this.posX = this.item.posX;
        this.posY = this.item.posY;
    }

    draw() {
        this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height);

        if (this.wasItemCollected()) {
            this.game.collectItem(this.item);
        }
    }

    wasItemCollected() {
        return (
            this.game.player.posX + this.game.player.width > this.posX &&
            this.posX + this.width > this.game.player.posX &&
            this.game.player.posY + this.game.player.height > this.posY &&
            this.posY + this.height > this.game.player.posY
        )
    }
}