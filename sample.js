import { generateBlock } from './blocks.js';
import { Stack } from './stack.js';
import { Background } from './background.js';
import { Player } from './player.js';

const mainCanvas = document.getElementById('main');
const mainCtx = mainCanvas.getContext('2d');

// Size of the game Canvas based on window size
mainCanvas.width = window.innerWidth / 2;
mainCanvas.height = window.innerHeight / 1.2;

// Game's Canvas constants
const groundHeight = mainCanvas.height / 25;
const maxHeight = mainCanvas.height - groundHeight;
const maxWidth = mainCanvas.width;

// Game variables
let player = new Player();
let currentBlock = generateBlock(mainCtx, maxWidth);
let stack = new Stack(mainCtx, player);
let background = new Background(mainCtx, 0, maxHeight, maxWidth, groundHeight);

// Clears the entire Canvas for redraw on every frame
function clear() {
    mainCtx.clearRect(0,0,maxWidth, maxHeight);
}

// Draws game objects each frame
function update() {
    clear();

    background.draw();
    stack.draw();

    // The stack height has grown too high in the Canvas
    // Shift the Canvas' view to allow for continued growth
    if(maxHeight - stack.getHeight() < maxHeight / 2.5 || stack.shift) {
        stack.shift = true;
        background.hideBase();
        stack.shiftStackDown();
    }

    // While the stack is moving do not show the current block or allow movement
    if(!stack.shift) {
        currentBlock.draw();
        currentBlock.newPos();
    }

    // Score value determined by which collision occurs
    let score = stack.collision(currentBlock, maxHeight)
    
    if(score > 0) {
            // Valid block placement; generate new block and add score to running total
            currentBlock = generateBlock(mainCtx, maxWidth);
            player.changeScore(score);
        } else if (score === -1) {
            // Invalid block placement; game over - reset game
            player.gameOver();
            background.resetBg();
    }

    requestAnimationFrame(update); 
}

update();

function keydown(e) {
    currentBlock.move(e);
}

function keyup(e) {
    currentBlock.stop(e);
}

document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);