const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let plane = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 100,
    img: new Image(),
    initialAngle: -Math.PI/2,
    angle: 0,
    isExploded: false
};
plane.img.src = 'plane.webp';

let missile = {
    x: 0,
    y: 0,
    size: 30,
    speed: 5,
    isFired: false,
    isExploded: false,
    img: new Image(),
    initialAngle: 4/3*Math.PI,
    angle: 0,
};
missile.img.src = 'missile.png';

explosion = {
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    img: new Image()
}
explosion.img.src = 'explosion.png';

let lauching = new Audio('lauching.mp3')
let explosion_sound = new Audio('explosion.mp3')

let soundEnabled = true;

function toggleSound() {
    soundEnabled = !soundEnabled;
}

function resetExplosion(){
    plane.isExploded = false;
    plane.x = canvas.width / 2;
    plane.y = canvas.height / 2;
    missile.isExploded = false;
    missile.x = 0;
    missile.y = 0;
    
}

canvas.addEventListener('mousemove', (e) => {
    let dx = e.clientX - canvas.offsetLeft - plane.x;
    let dy = e.clientY - canvas.offsetTop - plane.y;
    plane.angle = Math.atan2(dy, dx);
    plane.x = e.clientX - canvas.offsetLeft;
    plane.y = e.clientY - canvas.offsetTop;
});

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if(!missile.isExploded)
        missile.isFired = true;
    if(soundEnabled){
        console.log("oii")
        lauching.play()
    }
});

function updateMissile() {
    if (missile.isFired) {
        let dx = plane.x - missile.x;
        let dy = plane.y - missile.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        missile.angle = Math.atan2(dy, dx);

        if (distance < plane.size / 2 + missile.size / 2) {
            missile.isFired = false;
            missile.isExploded = true;
            plane.isExploded = true;
            explosion.x = missile.x;
            explosion.y = missile.y;
            if(soundEnabled)
                explosion_sound.play()
        } else {
            missile.x += (dx / distance) * missile.speed;
            missile.y += (dy / distance) * missile.speed;
        }
    }
}

function drawImageRotated(ctx, img, x, y, width, height, angle, initialAngle, isExploded) {
    if( isExploded ){
        return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(initialAngle + angle + Math.PI/2); // Add Math.PI/2 to make the image face the direction of movement
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

function drawExplosion(isExploded, x, y, width, height, img){
    if(!isExploded){
        return;
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(img, -width / 2, -height / 2, width, height);
    ctx.restore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the plane using the image and rotate it
    drawImageRotated(ctx, plane.img, plane.x, plane.y, plane.size, plane.size, plane.angle,
        plane.initialAngle, plane.isExploded);

    // Draw the missile using the image and rotate it
    drawImageRotated(ctx, missile.img, missile.x, missile.y, missile.size, missile.size,
        missile.angle, missile.initialAngle, missile.isExploded);

    updateMissile();

    drawExplosion(plane.isExploded, explosion.x, explosion.y, explosion.width, explosion.height, explosion.img)

    // console.log(plane.isExploded)
        
    requestAnimationFrame(draw);
}

draw();
