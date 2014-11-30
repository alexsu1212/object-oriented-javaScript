var LEFTMOST = 0, // The leftmost x of entities
    RIGHTMOST = 606,  // The rightmost x of entities
    TOPMOST = -12,  // The topmost x of entities
    BOTTOMMOST = 403,  // The bottommost x of entities
    X_DIST = 101,  // The horizontal distance between every block
    Y_DIST = 83;  // The vertical distance between every block

// Create a random integer between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Pick a random property in an object
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return obj[result];
}

// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = getRandomInt(100, 500);
    // console.log(this.speed);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.x < RIGHTMOST + X_DIST) {
        this.x += this.speed * dt;
    } else {
        this.x = LEFTMOST - X_DIST;
        this.speed = getRandomInt(100, 500);
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-boy.png';
    this.x = x;
    this.y = y;
}

// Set the player's position to original
Player.prototype.update = function() {
    this.x = LEFTMOST + 3*X_DIST;
    this.y = TOPMOST + 5*Y_DIST;
}

//Render player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left':
            if(this.x > LEFTMOST) {
                this.x -= X_DIST;
            }
            break;
        case 'up':
            if(this.y > TOPMOST ) {
                this.y -= Y_DIST;
            }
            break;
        case 'right':
            if(this.x < RIGHTMOST) {
                this.x += X_DIST;
            }
            break;
        case 'down':
            if(this.y < TOPMOST + Y_DIST*5) {
                this.y += Y_DIST;
            }
            break;
    }
    // Check if the player hit the treasure
    if(this.x === game.treasureLoc[0] && this.y === game.treasureLoc[1]) {
        game.scores += game.currTreasure.scores;
        // If the player hit the heart, get one more life
        if(game.lives < 3) {
            game.lives += game.currTreasure.lives;
        }
        // If the player hit the start, he become invincible for 10 seconds
        if(game.currTreasure.path === 'images/Star.png') {
            game.invincible = true;
            game.lastInvincibleTime = Date.now();
        }
        game.showTreasure = false;
        game.lastChange = Date.now();
    }
    // If the player hit the water, he dies
    if(this.y < TOPMOST + Y_DIST) {
        game.die();
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var Game = function() {
    this.lives = 3;
    this.scores = 0;
    this.invincible = false; // When true, the player will not be killed by the bugs
    this.lastInvincibleTime; // The time when invincible starts
    this.treasures = {
        'gemBlue': {
            'path': 'images/Gem-Blue.png',
            'scores': 100,
            'lives': 0
        },
        'gemGreen': {
            'path': 'images/Gem-Green.png',
            'scores': 200,
            'lives': 0
        },
        'gemOrange': {
            'path': 'images/Gem-Orange.png',
            'scores': 300,
            'lives': 0
        },
        'star': {
            'path': 'images/Star.png',
            'scores': 0,
            'lives': 0
        },
        'heart': {
            'path': 'images/Heart.png',
            'scores': 0,
            'lives': 1
        }
    };
    this.lastChange = Date.now();  // The time when the treasure last changes
    this.showTreasure = true;
    this.currTreasure = pickRandomProperty(this.treasures);
    // Pick a random position for the current treasure
    this.treasureLoc = [LEFTMOST + getRandomInt(0, 6)*X_DIST, TOPMOST + getRandomInt(1, 3)*Y_DIST];
}

Game.prototype.init = function() {
    this.player = new Player(LEFTMOST + 3*X_DIST, TOPMOST + 5*Y_DIST);
    this.allEnemies = [];
    this.allEnemies.push(new Enemy(LEFTMOST - 3*X_DIST, TOPMOST + Y_DIST));
    this.allEnemies.push(new Enemy(LEFTMOST - X_DIST, TOPMOST + Y_DIST));
    this.allEnemies.push(new Enemy(LEFTMOST - 3*X_DIST, TOPMOST + 2*Y_DIST));
    this.allEnemies.push(new Enemy(LEFTMOST - X_DIST, TOPMOST + 2*Y_DIST));
    this.allEnemies.push(new Enemy(LEFTMOST - 3*X_DIST, TOPMOST + 3*Y_DIST));
    this.allEnemies.push(new Enemy(LEFTMOST - X_DIST, TOPMOST + 3*Y_DIST));
}

// When the player hit the bugs or water, he dies
Game.prototype.die = function() {
    if(this.lives > 1 ) {
        this.lives--;
        this.init();
    } else {
        alert('Game Over!\n' + 'Total score: ' + game.scores);
        this.lives = 3;
        this.scores = 0;
        game.init();
    }
}

// Change the treasure and its positon
Game.prototype.updateTreasure = function() {
    this.currTreasure = pickRandomProperty(game.treasures);
    // change treasure's location if it's the same as the player's location
    do {
        x = LEFTMOST + getRandomInt(0, 6)*X_DIST;
        y = TOPMOST + getRandomInt(1, 2)*Y_DIST;
    } while(x === game.player.x && y === game.player.y); 
    game.treasureLoc = [x, y];
}

var game = new Game();
game.init();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    game.player.handleInput(allowedKeys[e.keyCode]);
});
