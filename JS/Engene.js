const WIDTH = 10;
const HEIGHT = 20;

var curTet = 0;
var playFieldMask = new Array(HEIGHT); ////////////////////////////////ЛОМАЕТСЯ ИСПРАВИТЬ



for (let i = 0; i < HEIGHT; i++) {
    playFieldMask[i] = new Array(WIDTH);
}

for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
        playFieldMask[i][j] = 0;
    }
}

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
        console.log(playFieldMask);
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
            console.log("Cannot spawn");
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
            console.log("Game over!");
            clearTimeout();
            GameOver = true;
        }
    }
    playLoop();

}












function moveRight(tet) {
    if (checkNoCollision(tet, tet.position.x + 1, tet.position.y)) {
        tet.position.x = tet.position.x + 1;
    }

}

function moveLeft(tet) {
    if (checkNoCollision(tet, tet.position.x - 1, tet.position.y)) {
        tet.position.x = tet.position.x - 1;
    }

}

function moveDown(tet) {
    let res = checkNoCollision(tet, tet.position.x, tet.position.y + 1);
    console.log(res);
    if (res) {
        tet.position.y = tet.position.y + 1;
    } else {
        tet.cantMoveDown = true;
    }
}

function leftRotate(tet) {
    undrawTet(playfield,tet);
    tet.rotateLeft();
    if (!checkNoCollision(tet, tet.position.x, tet.position.y)) {
        console.log("Cannot rotate");
        tet.rotateRight();
    }
    drawTet(playfield,tet);
}

function rightRotate(tet) {
    undrawTet(playfield,tet);
    tet.rotateRight();
    if (!checkNoCollision(tet, tet.position.x, tet.position.y)) {
        console.log("Cannot rotate");

        tet.rotateLeft();
    }
    drawTet(playfield,tet);
}
// function fallDown(tet) { \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\Доделать
//     if(checkNoCollision(tet,tet.position.x, tet.position.y)){
//     tet.position.y = tet.position.y + 1;
//     }
// }



function drawCell(context, _x, _y) {
    let target = context.querySelector(`.cell[data-index = "${_x}${_y}"]`);
    playFieldMask[_x][_y] = 1;
    target.classList.add("tet");
}

function undrawCell(context, _x, _y) {
    let target = context.querySelector(`.cell[data-index = "${_x}${_y}"]`);
    playFieldMask[_x][_y] = 0;
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
    for (let y = HEIGHT - 1; y >= 4; y--) {
        let full = true;

        for (let x = 0; x < WIDTH; x++) {
            if (playFieldMask[x][y] === 0) {
                full = false;
                break;
            }
        }

        if (full) {
            // Сдвигаем строки вниз
            for (let curLine = y; curLine > 0; curLine--) {
                for (let x = 0; x < WIDTH; x++) {
                    playFieldMask[x][curLine] = playFieldMask[x][curLine - 1];
                }
            }

            // Обнуляем верхнюю строку
            for (let x = 0; x < WIDTH; x++) {
                playFieldMask[x][0] = 0;
            }

            // Проверяем ту же строку снова (после сдвига)
            y++;
        }
    }

    // Перерисовываем только один раз в конце
    redrawPlayField(playfield);
}


function tickUpdate() {
    if (window.curTet.cantMoveDown === true) {
        //clearLines();
        return true;
    } else {
        undrawTet(playfield, window.curTet);
        moveDown(window.curTet);
        drawTet(playfield, window.curTet);
        return false;
    }
}

function createGrid(width, height, parentEl) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = (i % width).toString() + (Math.trunc(i / width)).toString();
        fragment.appendChild(cell);
    }
    parentEl.appendChild(fragment);
}

function checkNoCollision(tet, _x, _y) {
    if (playFieldMask[_x][_y] == 1) return false;
    for (let block of tet.blocks) {
        console.log(`x:${_x + block.x}, y:${_y + block.y}`)
        if ((_x + block.x < 0) || (_x + block.x > 9) || (_y + block.y > 19) || (playFieldMask[_x + block.x][_y + block.y] == 1)) {
            return false;
        }
    }
    return true;
}


let is_rotation = false;
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":

            if (is_rotation) {

                leftRotate(curTet);

            } else {
                console.log("left");
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
            console.log("Rotation");
            is_rotation = true;
            break;
    }
});

document.addEventListener("keyup", (e) => {

    if (e.key == "ArrowUp") { is_rotation = false; }
});