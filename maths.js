// 1. Trigonometric Functions
console.log("Math.sin(π/2):", Math.sin(Math.PI / 2)); // 1
console.log("Math.cos(π):", Math.cos(Math.PI)); // -1
console.log("Math.tan(π/4):", Math.tan(Math.PI / 4)); // 1
console.log("Math.asin(1):", Math.asin(1)); // π/2
console.log("Math.acos(0):", Math.acos(0)); // π/2
console.log("Math.atan(1):", Math.atan(1)); // π/4

// Math.atan2(y, x) trả về góc (theo radian) giữa trục x dương và đường thẳng từ gốc tọa độ (0, 0) đến điểm (x, y)
console.log("Math.atan2(1, 1):", Math.atan2(1, 1)); // π/4

// 2. Exponential and Square Root Functions
console.log("Math.sqrt(16):", Math.sqrt(16)); // 4
console.log("Math.pow(2, 3):", Math.pow(2, 3)); // 8
console.log("Math.exp(1):", Math.exp(1)); // ~2.718 (e)
console.log("Math.log(Math.E):", Math.log(Math.E)); // 1

// 3. Rounding Functions
console.log("Math.floor(4.7):", Math.floor(4.7)); // 4
console.log("Math.ceil(4.1):", Math.ceil(4.1)); // 5
console.log("Math.round(4.5):", Math.round(4.5)); // 5
console.log("Math.trunc(4.9):", Math.trunc(4.9)); // 4

// 4. Absolute Value Function
console.log("Math.abs(-5):", Math.abs(-5)); // 5

// 5. Hypotenuse Function (Trả về căn a^2 - b^2)
console.log("Math.hypot(3, 4):", Math.hypot(3, 4)); // 5

// 6. Random Functions
console.log("Math.random():", Math.random()); // Random number between 0 and 1

// 7. Min and Max Functions
console.log("Math.max(1, 3, 2):", Math.max(1, 3, 2)); // 3
console.log("Math.min(1, 3, 2):", Math.min(1, 3, 2)); // 1

// 8. Other Functions (Trả về dấu, nếu âm trả về -1, dương trả về 1, bằng 0 trả về 0)
console.log("Math.sign(-8):", Math.sign(-8)); // -1

// 9. Distance Calculation
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
console.log("distance(0, 0, 3, 4):", distance(0, 0, 3, 4)); // 5

// 10. Angle and Direction
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}
console.log("degreesToRadians(180):", degreesToRadians(180)); // π

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}
console.log("radiansToDegrees(π):", radiansToDegrees(Math.PI)); // 180

// 11. Clamp Function (giới hạn biến x trong khoảng [min, max])
function clamp(x, min, max) {
    return Math.max(min, Math.min(x, max));
}
console.log("clamp(10, 0, 5):", clamp(10, 0, 5)); // 5
console.log("clamp(-5, 0, 5):", clamp(-5, 0, 5)); // 0
console.log("clamp(3, 0, 5):", clamp(3, 0, 5)); // 3