class Joystick {
    constructor(canvas, radius, callback) {
        /**@type {HTMLCanvasElement} */
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.radius = radius;
        this.innerRadius = radius * 0.33;
        this.callback = callback;
        this.deltaPlace = 15; // Khoảng cách từ rìa
        this.centerX = 0;
        this.centerY = 0;
        this.rootX = this.deltaPlace + radius;
        this.rootY = this.canvas.getBoundingClientRect().height - this.deltaPlace - radius;
        this.visible = false;

        this.setupEvents();
    }

    draw(innerX, innerY, angle) {
        let opacity = 1;

        if (!this.visible) {
            this.centerX = this.rootX;
            this.centerY = this.rootY;
            innerX = this.centerX;
            innerY = this.centerY;
            angle = 0;
            opacity = .5;
        }

        // Vẽ vòng ngoài với độ trong suốt cao hơn
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(135, 206, 235, ${0.25 * opacity})`; // Xanh da trời nhạt với độ trong suốt cao
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = `rgba(135, 206, 235, ${opacity})`; // Đường viền xanh da trời nhạt
        this.ctx.stroke();

        // Vẽ hình tròn nhỏ di chuyển theo hướng vuốt
        this.ctx.beginPath();
        this.ctx.arc(innerX, innerY, this.innerRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(100, 149, 237, ${0.4 * opacity})`; // Xanh da trời với độ trong suốt cao
        this.ctx.fill();

        // Vẽ mũi tên chỉ hướng bên ngoài hình tròn nhỏ
        this.drawArrow(innerX, innerY, angle, opacity);
    }

    drawArrow(x, y, angle, opacity) {
        const headlen = this.radius * 0.2;
        const offset = this.innerRadius * 0.65;
        const angleRad = angle * (Math.PI / 180);
        const curveRadius = this.innerRadius * 1.25;

        const arrowX = x + (this.innerRadius + offset) * Math.cos(angleRad);
        const arrowY = y + (this.innerRadius + offset) * Math.sin(angleRad);

        // Vẽ phần bo tròn phía trước mũi tên
        this.ctx.beginPath();
        this.ctx.arc(
            x, y,
            curveRadius * 0.9,
            angleRad - Math.PI / 2.8,
            angleRad + Math.PI / 2.8,
            false
        );
        this.ctx.strokeStyle = `rgba(30, 144, 255, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(
            x, y,
            curveRadius,
            angleRad - Math.PI / 2.6,
            angleRad + Math.PI / 2.6,
            false
        );
        this.ctx.strokeStyle = `rgba(30, 144, 255, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Vẽ phần mũi của mũi tên
        this.ctx.beginPath();
        this.ctx.moveTo(arrowX, arrowY);
        this.ctx.lineTo(
            arrowX - headlen * Math.cos(angleRad - Math.PI / 4),
            arrowY - headlen * Math.sin(angleRad - Math.PI / 4)
        );
        this.ctx.moveTo(arrowX, arrowY);
        this.ctx.lineTo(
            arrowX - headlen * Math.cos(angleRad + Math.PI / 4),
            arrowY - headlen * Math.sin(angleRad + Math.PI / 4)
        );

        this.ctx.strokeStyle = `rgba(30, 144, 255, ${opacity})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    calculateInnerPosition(touchX, touchY) {
        const angle = Math.atan2(touchY - this.centerY, touchX - this.centerX);
        const distance = Math.min(Math.hypot(touchX - this.centerX, touchY - this.centerY), this.radius - this.innerRadius * 0.3);

        const innerX = this.centerX + (distance - this.innerRadius) * Math.cos(angle);
        const innerY = this.centerY + (distance - this.innerRadius) * Math.sin(angle);

        const adjustedAngle = angle * (180 / Math.PI);

        return { innerX, innerY, angle: adjustedAngle };
    }

    setupEvents() {
        const activeTouches = new Map();
    
        this.canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            for (let touch of event.touches) {
                const touchX = touch.clientX;
                const touchY = touch.clientY;
    
                // Kiểm tra nếu chạm vào nửa trái canvas
                if (touchX <= this.canvas.width / 2) {
                    activeTouches.set(touch.identifier, { x: touchX, y: touchY });
    
                    // Cập nhật vị trí trung tâm của Joystick và hiển thị nó
                    this.centerX = Math.min(Math.max(touchX, this.radius + this.deltaPlace), this.canvas.width / 2 - this.radius - this.deltaPlace);
                    this.centerY = Math.min(Math.max(touchY, this.radius + this.deltaPlace), this.canvas.height - this.radius - this.deltaPlace);
                    
                    this.visible = true;
    
                    const { innerX, innerY, angle } = this.calculateInnerPosition(touchX, touchY);
                    this.callback(innerX, innerY, angle);
                }
            }
        });
    
        this.canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            for (let touch of event.touches) {
                if (activeTouches.has(touch.identifier)) {
                    const touchX = touch.clientX;
                    const touchY = touch.clientY;
                    const { innerX, innerY, angle } = this.calculateInnerPosition(touchX, touchY);
                    this.callback(innerX, innerY, angle);
                }
            }
        });
    
        this.canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            for (let touch of event.changedTouches) {
                if (activeTouches.has(touch.identifier)) {
                    activeTouches.delete(touch.identifier);
                    if (activeTouches.size === 0) {
                        this.visible = false;
                        this.callback(this.centerX, this.centerY, 0);
                    }
                    console.log('Move ended.');
                }
            }
        });
    }
}