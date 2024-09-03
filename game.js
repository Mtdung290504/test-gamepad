class Game {
    constructor(canvas, joystickRadius, aimingControlRadius) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.joystick = new Joystick(canvas, joystickRadius, this.handleJoystickUpdate.bind(this));
        this.joystickDrawInfo = {
            innerX: undefined,
            innerY: undefined,
            angle: 0,
        }

        this.aimingControl = new AimingControl(canvas, aimingControlRadius, this.handleAimingControlUpdate.bind(this));
        this.aimingControlDrawInfo = {
            innerX: undefined,
            innerY: undefined,
            angle: 0,
        }

        this.animFrameId = null;

        this.updateCanvas();
    }

    handleJoystickUpdate(innerX, innerY, angle) {
        const joystickDrawInfo = this.joystickDrawInfo;
        joystickDrawInfo.innerX = innerX;
        joystickDrawInfo.innerY = innerY;
        joystickDrawInfo.angle = angle;
        console.log('move angle:', angle);
    }

    handleAimingControlUpdate(innerX, innerY, angle) {
        const aimingControlDrawInfo = this.aimingControlDrawInfo;
        aimingControlDrawInfo.innerX = innerX;
        aimingControlDrawInfo.innerY = innerY;
        aimingControlDrawInfo.angle = angle;
        console.log('shoot angle:', angle);
    }

    updateCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.joystick.draw(this.joystickDrawInfo.innerX, this.joystickDrawInfo.innerY, this.joystickDrawInfo.angle);
        this.aimingControl.draw(this.aimingControlDrawInfo.innerX, this.aimingControlDrawInfo.innerY, this.aimingControlDrawInfo.angle);

        this.animFrameId = requestAnimationFrame(() => this.updateCanvas());
    }

    stopAnimation() {
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
        }
    }
}

const canvas = document.getElementById('gamepad');
const joystickRadius = 70;
const aimingControlRadius = 40;
const game = new Game(canvas, joystickRadius, aimingControlRadius);