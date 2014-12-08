define(['gameLoop', 'Player', 'Keys'], function (gameLoop, Player, Keys) {
    /**************************************************
     ** GAME VARIABLES
     **************************************************/
    var canvas,			// Canvas DOM element
        ctx,			// Canvas rendering context
        keys,			// Keyboard input
        localPlayer;	// Local player

    function Game() {}
    /**************************************************
     ** GAME INITIALISATION
     **************************************************/
    Game.prototype.init = function () {
        // Declare the canvas and rendering context
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");

        // Maximise the canvas
        // HACK for uncorrected windows
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 20;

        // Initialise keyboard controls
        keys = new Keys();

        // Calculate a random start position for the local player
        // The minus 5 (half a player size) stops the player being
        // placed right on the egde of the screen
        var startX = Math.round(Math.random()*(canvas.width-5)),
            startY = Math.round(Math.random()*(canvas.height-5));

        // Initialise the local player
        localPlayer = new Player(startX, startY);

        // Start listening for events
        this.setEventHandlers();
    };

    /**************************************************
     ** GAME EVENT HANDLERS
     **************************************************/
    Game.prototype.setEventHandlers = function() {
        // Keyboard
        window.addEventListener("keydown", this.onKeydown, false);
        window.addEventListener("keyup", this.onKeyup, false);

        // Window resize
        window.addEventListener("resize", this.onResize, false);
    };

    // Keyboard key down
    Game.prototype.onKeydown = function (e) {
        if (localPlayer) {
            keys.onKeyDown(e);
        }
    };

    // Keyboard key up
    Game.prototype.onKeyup = function (e) {
        if (localPlayer) {
            keys.onKeyUp(e);
        }
    };

    // Browser window resize
    Game.prototype.onResize = function (e) {
        // Maximise the canvas
        canvas.width = window.innerWidth - 1000;
        canvas.height = window.innerHeight - 1000;
    };

    /**************************************************
     ** GAME ANIMATION LOOP
     **************************************************/
    Game.prototype.animate = function () {
        this.update();
        this.draw();

        // Request a new animation frame using Paul Irish's shim
        gameLoop(this.animate.bind(this));
    };

    /**************************************************
     ** GAME UPDATE
     **************************************************/
    Game.prototype.update = function () {
        localPlayer.update(keys);
    };

    /**************************************************
     ** GAME DRAW
     **************************************************/
    Game.prototype.draw = function () {
        // Wipe the canvas clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the local player
        localPlayer.draw(ctx);
    };

    return Game;
});
