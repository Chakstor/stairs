class Player {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.JUMPDISTANCE = 40;

        this.imageWR = new Image();
        this.imageWR.src = "images/mario/walking_right.png";

        this.imageWL = new Image();
        this.imageWL.src = "images/mario/walking_left.png";

        this.imageJUMP = new Image();
        this.imageJUMP.src = "images/mario/jumping_right.png";

        this.frames = 3;
        this.framesIndex = 0;

        this.width = 90 / this.frames;
        this.height = 32;
        this.posX = 40;
        this.posY = 50;
        this.posYBase = 50;
        this.posXSpeed = 3;
        this.posYSpeed = .3;
        this.landingPos = 0;
        this.gravity = .4;

        this.lastAction = 'RIGHT';
        this.actions = {
            RIGHT: false,
            LEFT: false,
            JUMP: false,
            JUMPRIGHT: false,
            JUMPLEFT: false
        };

        this.keysPressed = [];
        this.keys = {
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            LEFT: 37,
            JUMP: 65, // a
        };

        this.onKeyDown = function(event) {

            if (this.isJumping()) return;

            this.keysPressed[event.keyCode] = true;

            console.log(Object.keys(this.keysPressed));

            // if ( this.keysPressed[39] && this.keysPressed[65] ) {
            //     this.landingPos = this.posX + this.JUMPDISTANCE;

            //     if (this.posY >= this.posYBase) {
            //         this.posY -= this.posYSpeed;
            //         this.posYSpeed -= 5;

            //         this.posX += 1.5;
            //         this.posXSpeed += .1;
            //     }

            //     changeAction(this.actions, 'JUMPRIGHT');
            //     this.lastAction = 'JUMPRIGHT';
            //     return;
            // }

            // if (this.keysPressed[37] && this.keysPressed[65]) {
            //     this.landingPos = this.posX - this.JUMPDISTANCE;

            //     if (this.posY >= this.posYBase) {
            //         this.posY -= this.posYSpeed;
            //         this.posYSpeed -= 5;

            //         this.posX -= 1.5;
            //         this.posXSpeed -= .1;
            //     }

            //     changeAction(this.actions, 'JUMPLEFT');
            //     this.lastAction = 'JUMPLEFT';
            //     return;
            // }

            let action = Object.entries(this.keys).filter(entry => entry.includes(event.keyCode))[0][0];

            changeAction(this.actions, action);
            this.lastAction = action;

            switch(event.keyCode) {
                case this.keys.RIGHT:
                    this.posX += this.posXSpeed;
                    break;
                case this.keys.LEFT:
                    this.posX -= this.posXSpeed;
                    break;
                case this.keys.JUMPRIGHT:
                    this.landingPos = this.posX + this.JUMPDISTANCE;

                    if (this.posY >= this.posYBase) {
                        this.posY -= this.posYSpeed;
                        this.posYSpeed -= 5;

                        this.posX += 1.5;
                        this.posXSpeed += .1;
                    }
                    break;
                case this.keys.JUMPLEFT:
                    this.landingPos = this.posX - this.JUMPDISTANCE;

                    if (this.posY >= this.posYBase) {
                        this.posY -= this.posYSpeed;
                        this.posYSpeed -= 5;

                        this.posX -= 1.5;
                        this.posXSpeed -= .1;
                    }
                    break;
                case this.keys.JUMP:
                    if (this.posY >= this.posYBase) {
                        this.posY -= this.posYSpeed;
                        this.posYSpeed -= 5;
                    }
                    break;
            }
        }

        this.onKeyUp = function (event) {
            this.posX = this.posX;
            this.actions.RIGHT = false;
            this.actions.LEFT = false;

            this.keysPressed = [];
        }

        this.keyDownHandler = this.onKeyDown.bind(this);
        this.keyUpHandler = this.onKeyUp.bind(this);

        this.setListener();
    }

    isJumping() {
        return this.posY !== this.posYBase;
    }

    resetActions(actions) {
        Object.keys(actions).forEach(key => {
            actions[key] = false;
        })
    }

    draw(framesCounter) {

        let lastDirection = '';

        if (this.lastAction === 'RIGHT') lastDirection = this.imageWR;
        if (this.lastAction === 'LEFT') lastDirection = this.imageWL;
        if (this.lastAction.indexOf('JUMP') > -1) lastDirection = this.imageJUMP;

        this.drawImage(lastDirection);
        this.animateWalking(framesCounter);
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
            case 'JUMPRIGHT':
                this.drawImage(this.imageJUMP);
                if (this.posY <= this.posYBase) {
                    this.posY += this.posYSpeed;
                    this.posYSpeed += this.gravity;
                    this.posX += 1.5;
                    this.posXSpeed += .1;
                } else {
                    this.posYSpeed = .3;
                    this.posY = this.posYBase;
                    this.posX = this.landingPos;
                    this.posXSpeed = 3;
                }
                break;
            case 'JUMPLEFT':
                this.drawImage(this.imageJUMP);
                if (this.posY <= this.posYBase) {
                    this.posY += this.posYSpeed;
                    this.posYSpeed += this.gravity;
                    this.posX -= 1.5;
                    this.posXSpeed -= .1;
                } else {
                    this.posYSpeed = .3;
                    this.posY = this.posYBase;
                    this.posX = this.landingPos;
                    this.posXSpeed = 3;
                }
                break;
            case 'JUMP':
                this.drawImage(this.imageJUMP);
                if (this.posY <= this.posYBase) {
                    this.posY += this.posYSpeed;
                    this.posYSpeed += this.gravity;
                } else {
                    this.posYSpeed = .3;
                    this.posY = this.posYBase;
                }
                break;
        }
    }

    drawImage(image) {
        if (image.src.indexOf('jump') > -1) {
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

    animateWalking(framesCounter) {
        if ((this.actions.RIGHT || this.actions.LEFT) && framesCounter % 4 === 0) {
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