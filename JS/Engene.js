// const WIDTH = 10;
// const HEIGHT = 20;

var curTet = 0;
let playFieldMask = new Array(WIDTH);

for (let x = 0; x < WIDTH; x++) {
    playFieldMask[x] = new Array(HEIGHT);
    for (let y = 0; y < HEIGHT; y++) {
        playFieldMask[x][y] = 0;
    }
}

class Score {
    constructor() {
        this.score = 0;
        this.scoreArr = ["0", "0", "0", "0"];
    }
    add(count) {
        this.score += count;
        if (this.score > 9999) this.score = 9999;
        this.scoreArr[3] = this.score % 10;
        this.scoreArr[2] = Math.floor((this.score % 100) / 10);
        this.scoreArr[1] = Math.floor((this.score % 1000) / 100);
        this.scoreArr[0] = Math.floor(this.score / 1000);
        document.querySelector('#score').textContent = this.scoreArr.join("");
    }
}
var score = new Score();

class GameTicker {
    constructor(rate, onTick) {
        this.rate = rate;
        this.onTick = onTick;
        this.tickLength = 1000 / rate;
        this.lastTime = performance.now();
    }
    start(context, onStop) {
        this.Tick(context);
        this.onStop = onStop;
    }

    Tick(context) {
        this.lastTime = performance.now();
        if (this.onTick(context)) {
            this.onStop();
            return;
        };
        (playFieldMask);
        const nextDelay = Math.max(0, this.tickLength - (performance.now() - this.lastTime));
        setTimeout(() => this.Tick(context), nextDelay);
    }
}

class TetPul {
    constructor() {
        this.TETROMINO_CLASSES = [
            I_type, O_type, T_type,
            S_type, Z_type, J_type, L_type
        ];
        this.current = this.getRandomPiece();
        this.next = this.getRandomPiece();
    }
    getRandomPiece() {
        const Cls = this.TETROMINO_CLASSES[Math.floor(Math.random() * this.TETROMINO_CLASSES.length)];
        return new Cls(1);
    }
    SpawnTet() {
        undrawTet(window.nextfield, this.current);
        if (checkNoCollision(this.current, 4, this.current.position.y)) {
            window.curTet = this.current;
            window.curTet.position.x = 4;

            drawTet(window.playfield, window.curTet);
            drawTet(window.nextfield, this.next);

            this.current = this.next;
            this.next = this.getRandomPiece();
            return true;
        }
        else {

            return false;
        }
    }
}



function Play() {
    let ticker = new GameTicker(1, tickUpdate);
    let TetStack = new TetPul();
    let GameOver = false;


    function playLoop() {
        if (GameOver) return;
        if (TetStack.SpawnTet()) {
            setTimeout(ticker.start(playfield, playLoop), 1000);
        } else {
            ("Game over!");
            clearTimeout();
            GameOver = true;
            document.removeEventListener("keydown", keys);
        }
    }
    playLoop();

}












function moveRight(tet) {
    if (checkNoCollision(tet, tet.position.x + 1, tet.position.y)) {
        tet.position.x = tet.position.x + 1;
        if (checkNoCollision(tet, tet.position.x, tet.position.y + 1))
            tet.cantMoveDown = false;
    }

}

function moveLeft(tet) {
    if (checkNoCollision(tet, tet.position.x - 1, tet.position.y)) {
        tet.position.x = tet.position.x - 1;
        if (checkNoCollision(tet, tet.position.x, tet.position.y + 1))
            tet.cantMoveDown = false;
    }

}

function moveDown(tet) {
    let res = checkNoCollision(tet, tet.position.x, tet.position.y + 1);
    (res);
    if (res) {
        tet.position.y = tet.position.y + 1;
    } else {
        tet.cantMoveDown = true;
    }
}

function leftRotate(tet) {
    undrawTet(playfield, tet);
    tet.rotateLeft();
    if (!checkNoCollision(tet, tet.position.x, tet.position.y)) {

        tet.rotateRight();
    }
    drawTet(playfield, tet);
}

function rightRotate(tet) {
    undrawTet(playfield, tet);
    tet.rotateRight();
    if (!checkNoCollision(tet, tet.position.x, tet.position.y)) {


        tet.rotateLeft();
    }
    drawTet(playfield, tet);
}




function drawCell(context, _x, _y) {
    let target = context.querySelector(`.cell[data-index = "${_x}${_y}"]`);
    if (context === playfield) { playFieldMask[_x][_y] = 1; }
    target.classList.add("tet");
}

function undrawCell(context, _x, _y) {
    let target = context.querySelector(`.cell[data-index = "${_x}${_y}"]`);
    if (context === playfield) { playFieldMask[_x][_y] = 0; }
    target.classList.remove("tet");
}

function drawTet(context, tet) {
    let _x = tet.position.x;
    let _y = tet.position.y;
    drawCell(context, _x, _y);
    for (let i = 0; i < tet.blocks.length; i++) {
        drawCell(context, _x + tet.blocks[i].x, _y + tet.blocks[i].y);
    }
}

function undrawTet(context, tet) {
    let _x = tet.position.x;
    let _y = tet.position.y;
    undrawCell(context, _x, _y);
    for (let i = 0; i < tet.blocks.length; i++) {
        undrawCell(context, _x + tet.blocks[i].x, _y + tet.blocks[i].y);
    }
}

function redrawPlayField(context) {
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let cell = context.querySelector(`.cell[data-index="${x}${y}"]`);
            if (playFieldMask[x][y] === 1) {
                cell.classList.add("tet");
            } else {
                cell.classList.remove("tet");
            }
        }
    }
}

function clearLines() {
    let strick = 0;
    for (let y = HEIGHT - 1; y >= 0; y--) {
        let notClear = true; for (let x = 0; x < WIDTH; x++) {
            if (playFieldMask[x][y] === 0) {
                notClear = false; break;
            }
        } if (notClear) {
            for (let x = 0; x < WIDTH; x++) {
                playFieldMask[x][y] = 0;
            }
            for (let curLine = y; curLine > 0; curLine--) {
                for (let x = 0; x < WIDTH; x++) {
                    playFieldMask[x][curLine] = playFieldMask[x][curLine - 1];
                }
            }
            strick++;
            y++;
        }
    }
    window.score.add((10 * strick * strick));
    redrawPlayField(playfield);
}


function tickUpdate() {
    if (window.curTet.cantMoveDown === true) {
        clearLines();
        return true;
    } else {
        undrawTet(playfield, window.curTet);
        moveDown(window.curTet);
        drawTet(playfield, window.curTet);
        return false;
    }
}



function checkNoCollision(tet, _x, _y) {

    for (let block of tet.blocks) {
        (`x:${_x + block.x}, y:${_y + block.y}`)
        if ((_x + block.x < 0) || (_x + block.x > 9) || (_y + block.y > 19) || (playFieldMask[_x + block.x][_y + block.y] === 1)) {
            return false;
        }
    }
    if (playFieldMask[_x][_y] == 1) return false;
    return true;
}


let is_rotation = false;
document.addEventListener("keydown", keys);

document.addEventListener("keyup", (Event) => {

    if (Event.key == "ArrowUp") { is_rotation = false; }
});

let playB = document.querySelector("#start");
playB.addEventListener("mousedown", (Event) => {
    Event.target.style.display = "none";
    Play();
});



function keys(Event) {
    switch (Event.key) {
        case "ArrowLeft":

            if (is_rotation) {

                leftRotate(curTet);

            } else {

                undrawTet(playfield, window.curTet);
                moveLeft(curTet);
                drawTet(playfield, window.curTet);
            }
            break;
        case "ArrowRight":
            if (is_rotation) {

                rightRotate(curTet);

            } else {
                undrawTet(playfield, window.curTet);
                moveRight(curTet);
                drawTet(playfield, window.curTet);
            }
            break;
        case "ArrowDown":
            undrawTet(playfield, window.curTet);
            moveDown(window.curTet);
            drawTet(playfield, window.curTet);
            break;
        case "ArrowUp":

            is_rotation = true;
            break;
    }
}


let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
    const touch = e.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, false);

document.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
            undrawTet(playfield, window.curTet);
            moveRight(curTet);
            drawTet(playfield, window.curTet);
        } else if (dx < -30) {
            undrawTet(playfield, window.curTet);
            moveLeft(curTet);
            drawTet(playfield, window.curTet);
        }
    } else {
        if (dy > 30) {
            undrawTet(playfield, window.curTet);
            moveDown(window.curTet);
            drawTet(playfield, window.curTet);
        } else if (dy < -30) {
            rightRotate(curTet);
        }
    }
}, false);