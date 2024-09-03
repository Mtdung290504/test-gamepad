class AimingControl {
    constructor(canvas, radius, callback) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.radius = radius;
        this.callback = callback;
        this.centerX = this.canvas.width - radius - 20;
        this.centerY = this.canvas.height - radius - 20;
        this.innerX = this.centerX;
        this.innerY = this.centerY;
        this.visible = true; // Thay đổi từ false thành true để luôn hiển thị

        this.setupEvents();
    }

    draw(innerX, innerY, angle) {
        let opacity = 1;

        if (!this.visible) {
            innerX = this.centerX;
            innerY = this.centerY;
            angle = 0;
            opacity = .5;
        }

        innerX ??= this.centerX;
        innerY ??= this.centerY;

        // Vẽ vòng ngoài với độ trong suốt cao hơn
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(135, 206, 235, ${0.25 * opacity})`; // Xanh da trời nhạt với độ trong suốt cao
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = `rgba(135, 206, 235, ${opacity})`; // Đường viền xanh da trời nhạt
        this.ctx.stroke();

        // Vẽ vòng tròn nhỏ di chuyển theo hướng vuốt
        this.ctx.beginPath();
        this.ctx.arc(innerX, innerY, this.radius * 0.33, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(100, 149, 237, ${0.4 * opacity})`; // Xanh da trời với độ trong suốt cao
        this.ctx.fill();

        // Vẽ mũi tên chỉ hướng
        this.drawArrow(innerX, innerY, angle, opacity);
    }

    drawArrow(x, y, angle, opacity) {
        const headlen = this.radius * 0.2; // Độ dài phần mũi tên
        const offset = this.radius * 0.33 * 0.65; // Khoảng cách từ hình tròn nhỏ để vẽ phần mũi tên
        const angleRad = angle * (Math.PI / 180); // Chuyển đổi góc sang radian

        // Tính tọa độ của điểm nơi vẽ phần mũi tên
        const arrowX = x + (this.radius * 0.33 + offset) * Math.cos(angleRad);
        const arrowY = y + (this.radius * 0.33 + offset) * Math.sin(angleRad);

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

        this.ctx.strokeStyle = `rgba(30, 144, 255, ${opacity})`; // Màu mũi tên xanh da trời đậm
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    calculateInnerPosition(touchX, touchY) {
        const angle = Math.atan2(touchY - this.centerY, touchX - this.centerX);
        const distance = Math.min(Math.hypot(touchX - this.centerX, touchY - this.centerY), this.radius * 1.1);

        // Tính vị trí hình tròn nhỏ
        const innerX = this.centerX + (distance - this.radius * 0.33) * Math.cos(angle);
        const innerY = this.centerY + (distance - this.radius * 0.33) * Math.sin(angle);

        // Chuyển đổi angle sang độ
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
    
                if (Math.hypot(touchX - this.centerX, touchY - this.centerY) <= this.radius) {
                    activeTouches.set(touch.identifier, { x: touchX, y: touchY });
                    this.visible = true;
    
                    const { innerX, innerY, angle } = this.calculateInnerPosition(touchX, touchY);
                    this.callback(innerX, innerY, angle);
                } else {
                    this.visible = false;
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
                    }
                    console.log('Shoot ended.');
                }
            }
        });
    }    
}