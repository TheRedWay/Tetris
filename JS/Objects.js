class Tetromino {
    constructor(_x, _y) {
        this.position = { x: _x, y: _y };
        this.blocks = [];
        this.cantMoveDown = false;
    }

    rotateRight() {
        this.blocks.forEach(block => {
            const oldX = block.x;
            block.x = -block.y;
            block.y = oldX;
        });
    }

    rotateLeft() {
        this.blocks.forEach(block => {
            const oldX = block.x;
            block.x = block.y;
            block.y = -oldX;
        });
    }
};

class T_type extends Tetromino {
    constructor(_x) {
        super(_x, 1);
        this.type = 'T';
        this.blocks = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 }
        ]
    }
};
class O_type extends Tetromino {
    constructor(_x,) {
        super(_x, 0);
        this.type = 'O';
        this.blocks = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 }
        ]
    }
};
class L_type extends Tetromino {
    constructor(_x) {
        super(_x, 1);
        this.type = 'L';
        this.blocks = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: -1 }
        ]
    }
};
class J_type extends Tetromino {
    constructor(_x) {
        super(_x, 1);
        this.type = 'J';
        this.blocks = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: -1 }
        ]
    }
};
class Z_type extends Tetromino {
    constructor(_x) {
        super(_x, 1);
        this.type = 'Z';
        this.blocks = [
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: -1 }
        ]
    }
};
class S_type extends Tetromino {
    constructor(_x) {
        super(_x, 1);
        this.type = 'S';
        this.blocks = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: -1 }
        ]
    }
};
class I_type extends Tetromino {
    constructor(_x) {
        super(_x, 2);
        this.type = 'I';
        this.blocks = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 0, y: -2 }
        ]
    }
};