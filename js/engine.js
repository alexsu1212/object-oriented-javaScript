var Engine = (function(global) {
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 707;
    canvas.height = 670;
    doc.body.appendChild(canvas);

    function main() {
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        lastTime = now;
        win.requestAnimationFrame(main);
    };

    function init() {

        reset();
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    // Check if two objects get close within half of their horizontal distance
    function checkCollisions(obj1, obj2) {
        return (Math.abs(obj1.x - obj2.x) <= X_DIST/2) && (Math.abs(obj1.y - obj2.y) <= Y_DIST/2);
    }

    function updateEntities(dt) {
        game.allEnemies.forEach(function(enemy) {
            if(checkCollisions(game.player, enemy) && !game.invincible){
                game.die();
            }
            enemy.update(dt);
        });
    }

    function render() {
        reset();
        // Render hearts
        for(var i = 0; i < game.lives; i++) {
            ctx.drawImage(Resources.get('images/Heart-small.png'), i * 36, 0);
        }
        // Render star if the player is invincible
        if(game.invincible) {
            ctx.drawImage(Resources.get('images/Star-small.png'), game.lives * 36, 0);
        }
        // Render scores
        ctx.font = "24px Arial";
        ctx.textAlign = 'right';
        ctx.fillStyle = 'black';
        ctx.fillText("Scores: " + game.scores, RIGHTMOST, 40);

        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png',
            ],
            numRows = 6,
            numCols = 7,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, (row + 0.1) * 83);
            }
        }
        var now = Date.now(),
            countInvincibleTime = Math.ceil((now - game.lastInvincibleTime) / 1000), // the passing seconds since invincible starts
            countTreasureTime = Math.ceil((now - game.lastChange) / 1000),  // the passing seconds since the treasure changed last time
            x, y;

        // When the player is invincible for 10 secondes, he becomes vulnerble again
        if(countInvincibleTime === 10) {
            game.invincible = false;
        }

        // Every treasure shows up for 5 seconds
        if(countTreasureTime === 5) {
            game.showTreasure = true;
            game.updateTreasure();
            game.lastChange = Date.now();
        };

        // After showing up for 3 seconds, the treasure becomes more transparent
        if(game.showTreasure) {
            if(countTreasureTime > 3) {
                ctx.globalAlpha = 0.5;
            }
            renderTreasure(game.currTreasure);
            ctx.globalAlpha = 1;
        };
        renderEntities();
    }

    function renderTreasure(treasure) {  
        ctx.drawImage(Resources.get(treasure.path), game.treasureLoc[0], game.treasureLoc[1]);
    }

    function renderEntities() {
        game.allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        game.player.render();
    }

    function reset() {
        canvas.width = canvas.width;
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Heart-small.png',
        'images/Gem-Blue-small.png',
        'images/Heart.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Star.png',
        'images/Star-small.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);