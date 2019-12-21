class Player {
    constructor(ctx, canvasWidth, canvasHeight, posX = 40, posY = 50, game) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.game = game;

        this.isDying = false;
        this.isDead = false;

        this.imageWR = new Image();
        this.imageWR.src = "images/mario/walking_right.png";

        this.imageWL = new Image();
        this.imageWL.src = "images/mario/walking_left.png";

        this.imageCLIMB = new Image();
        this.imageCLIMB.src = "images/mario/climbing.png";

        this.imageJUMP = new Image();
        this.imageJUMP.src = "images/mario/jumping_right.png";

        this.imageDYING = new Image();
        this.imageDYING.src = "images/mario/rolling.png";

        this.imageDEAD = new Image();
        this.imageDEAD.src = "images/mario/dead.png";

        this.frames = 3;
        this.framesIndex = 0;

        this.width = 90 / this.frames;
        this.height = 32;
        this.posX = posX;
        this.posY = posY - this.height;

        this.posYBase = this.posY;
        this.posXSpeed = 3;
        this.posYSpeed = 3;
        this.climbSpeed = 1.5;

        this.currentPlatform = 0;

        this.directionX = 0;
        this.directionY = 0;
        this.jumpMaxHeight = 5.8;

        this.canClimb = false;

        this.onKeyDown = function(event) {
            switch (event.keyCode) {
                case 37: // left
                    this.directionX = -1;
                    break;
                case 39: // right
                    this.directionX = 1;
                    break;
                case 38:  // up
                    this.directionY = this.canClimb ? -1 : 0;
                    break;
                case 40:  // down
                    this.directionY = this.canClimb ? 1 : 0;
                    break;
                case 32: // space bar
                    if (this.posY >= this.posYBase) {
                        this.posY -= this.posYSpeed;
                        this.posYSpeed -= this.jumpMaxHeight;
                        this.game.soundPlayer.play(jumpSound);
                    }
                    break;
            }
        }

        this.onKeyUp = function () {
            this.directionX = 0;
            this.directionY = 0;
        }

        this.keyDownHandler = this.onKeyDown.bind(this);
        this.keyUpHandler = this.onKeyUp.bind(this);

        this.setListener();
    }

    move() {
        this.walk();
        this.jump();
        this.climb();
    }

    walk() {
        this.posX += this.posXSpeed * this.directionX;
        this.stageLimits();
    }

    climb() {
        this.posY += this.climbSpeed * this.directionY;
    }

    jump() {

        if (this.canClimb) return;

        if (this.posY > this.posYBase) {
            this.posYSpeed = .3;
            this.posY = this.posYBase;
        } else {
            this.posY += this.posYSpeed;
            this.posYSpeed += .4;
        }
    }

    stageLimits() {
        if (this.posX <= 0) this.posX = 1
        if (this.posX + this.width >= this.canvasWidth) this.posX = this.canvasWidth - this.width - 1;
    }

    draw(framesCounter) {

        if (this.isDying) {
            this.frames = this.isDead ? 1 : 4;
            this.width = (this.isDead ? 32 : 128) / this.frames;

            this.directionX = 0;
            this.directionY = 0;

            this.isDead ? this.drawImage(this.imageDEAD) : this.drawImage(this.imageDYING);
            this.removeListener();

            if (!this.isDead) {
                setTimeout(() => {
                    this.isDead = true;
                }, 2000);
            }
        }

        if (framesCounter % 10 === 0 && this.isDying) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 3 ? 0 : this.framesIndex;
        }

        if (this.isDying) return;

        (this.directionX < 0) ? this.drawImage(this.imageWL) : this.drawImage(this.imageWR);
        (this.directionY < 0) ? this.drawImage(this.imageCLIMB) : (this.directionY > 0) ? this.drawImage(this.imageCLIMB) : false;

        if (this.directionX !== 0 && framesCounter % 4 === 0) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 2 ? 0 : this.framesIndex;
        }

        if (this.directionY !== 0 && framesCounter % 4 === 0) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 1 ? 0 : this.framesIndex;
        }
    }

    drawImage(image) {
        if (image.src.indexOf('jump') > -1 || image.src.indexOf('dead') > -1) {
            this.ctx.drawImage(
                image,
                this.posX,
                this.posY,
                this.width,
                this.height
            );
        } else {
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
    }

    setListener() {
        document.addEventListener('keydown', this.keyDownHandler);
        document.addEventListener('keyup', this.keyUpHandler);
    }

    removeListener() {
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
    }
}