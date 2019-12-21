class Platform {
    constructor(ctx, posX, posY, width, moveable = false, topLimit, bottomLimit) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = this.evaluateMoveable(moveable);

        this.width = width;
        this.height = 16;
        this.posX = posX;
        this.posY = posY;

        this.posYBase = posY;
        this.speed = .7;
        this.direction = 1;

        this.moveable = moveable;
        this.topLimit = topLimit;
        this.bottomLimit = bottomLimit;
    }

    draw() {

        this.ctx.save();

        this.ctx.fillStyle = this.ctx.createPattern(this.image, 'repeat');
        this.ctx.translate(this.posX, this.posY);
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.restore();
    }

    move() {
        if (!this.moveable) return;

        switch (this.moveable) {
            case 'x':
                this.animation('posX');
                break;
            case 'y':
                this.animation('posY');
                break;
        }
    }

    animation(axis) {
        this[axis] += this.speed * this.direction;
        if (this[axis] <= this.topLimit) this.direction = 1;
        if (this[axis] >= this.bottomLimit) this.direction = -1;
    }

    evaluateMoveable(axis) {
        if (axis === 'x')
            return 'images/scenario/platform_blue.png'
        else if (axis === 'y')
            return 'images/scenario/platform_yellow.png'
        else
            return 'images/scenario/platform_red.png'
    }
}