class Player {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.imageWR = new Image();
        this.imageWR.src = "images/mario/walking_right.png";

        this.imageWL = new Image();
        this.imageWL.src = "images/mario/walking_left.png";

        this.imageJUMP = new Image();
        this.imageJUMP.src = "images/mario/walking_left.png";

        this.frames = 3;
        this.framesIndex = 0;

        this.width = 90 / this.frames;
        this.height = 32;
        this.posX = 40;
        this.posY = 50;
        this.posXSpeed = 3;
        this.posYSpeed = 3;

        this.lastAction = 'RIGHT';

        this.actions = {
            RIGHT: false,
            LEFT: false,
            JUMP: false
        };

        this.keys = {
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            LEFT: 37,
            a: 65
        };

        this.onKeyDown = function(event) {
            switch(event.keyCode) {
                case this.keys.RIGHT:
                    this.posX += this.posXSpeed;
                    this.lastAction = 'RIGHT';
                    changeAction(this.actions, 'RIGHT')
                    break;
                case this.keys.LEFT:
                    this.posX -= this.posXSpeed;
                    this.lastAction = 'LEFT';
                    changeAction(this.actions, 'LEFT')
                    break;
                case this.keys.a:
                    this.posY -= this.posYSpeed;
                    this.posYSpeed -= 10;
                    break;
            }
        }

        this.onKeyUp = function () {
            this.posX = this.posX;
            this.actions.RIGHT = false;
            this.actions.LEFT = false;
        }

        this.keyDownHandler = this.onKeyDown.bind(this);
        this.keyUpHandler = this.onKeyUp.bind(this);

        this.setListener();
    }

    draw(framesCounter) {

        let lastDirection = this.lastAction === 'RIGHT' ? this.imageWR : this.imageWL;

        this.drawImage(lastDirection);
        this.animatePlayer(framesCounter);
    }

    move() {

        let action = Object.keys(this.actions).filter(action => this.actions[action])[0];

        switch (action) {
            case 'RIGHT':
                this.drawImage(this.imageWR);
                break;
            case 'LEFT':
                this.drawImage(this.imageWL);
                break;
            case 'JUMP':
                this.drawImage(this.imageJUMP);
                break;
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

    animatePlayer(framesCounter) {
        if ((this.actions.RIGHT || this.actions.LEFT) && framesCounter % 8 === 0) {
            this.framesIndex++;
            this.framesIndex = this.framesIndex > 2 ? 0 : this.framesIndex;
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

function changeAction(actions, action) {
    Object.keys(actions).forEach(a => {
        actions[a] = a === action? true : false;
    });
}