class ItemBag {
    constructor(ctx, canvasWidth, canvasHeight, posX, posY, items) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.posX = posX;
        this.posY = posY;

        this.items = items;

        Object.keys(this.items).forEach(item => {
            this.items[item].imageObject = new Image();
            this.items[item].imageObject.src = this.items[item].image;
        })
    }

    draw() {
        this.ctx.lineWidth = 1;

        Object.keys(this.items).forEach((itemKey, i) => {
            this.ctx.rect(this.posX + (i * 45), this.posY, 40, 40);

            let pX = this.posX + (i * 45) + (40 / 2) - (this.items[itemKey].width / 2);
            let pY = this.posY + (40 / 2) - (this.items[itemKey].height / 2);

            if (this.items[itemKey].collected)
                this.ctx.drawImage(this.items[itemKey].imageObject, pX, pY, this.items[itemKey].width, this.items[itemKey].height);
        });
    }

    getItem(keyName) {
        return this.items[keyName];
    }

    setItem(item) {
        this.items[item.name].collected = true;
    }

    checkItem(keyName) {
        return this.items[keyName].collected;
    }
}