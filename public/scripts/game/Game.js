define(['gameLoop', 'Player', 'Keys'], function (gameLoop, Player, Keys) {
    /**************************************************
     ** GAME VARIABLES
     **************************************************/
    var canvas,			// Canvas DOM element
        ctx,			// Canvas rendering context
        keys,			// Keyboard input
        localPlayer,
        socket;	// Local player

    function Game() {}
    /**************************************************
     ** GAME INITIALISATION
     **************************************************/
    Game.prototype.init = function () {
        // Declare the canvas and rendering context
        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");


        //TODO: make a server
        socket = io( "http://127.0.0.1:8124", { transports: ["websocket"] } );

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


        remotePlayers = [];
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


        //old declarations
        //socket.on("connect", onSocketConnected);
        //socket.on("disconnect", onSocketDisconnect);
        //socket.on("new player", onNewPlayer);
        //socket.on("move player", onMovePlayer);
        //socket.on("remove player", onRemovePlayer);

        socket.on("connect", onSocketConnected);
        socket.on("server:update", onServerUpdate);

    };

    function playerById(id) {
        var i;
        for (i = 0; i < players.length; i++) {
            if (players[i].id == id)
                return players[i];
        };

        return false;
    };

    function onServerUpdate(){

    }

    function onSocketConnected() {
        console.log("Connected to server.");

        socket.emit( 'client:command', {
            name : "init",
            params : {
                name : "NAGIBATOR_" + Math.round(Math.random()*10000)
            }
        });

    };


    function onServerUpdate(update){
        var id;

        console.log( 'Update from server: ', update);
        for(id in update){
            processSingleEntityUpdate(id, update[id]);
        }

        //make a sync with delay of 1 sec. Emulates latency.
        setTimeout(function(){
            socket.emit("client:updateProceed");
        }, 1000);

    }

    function processSingleEntityUpdate(id, params){
        var className = params.className;

        if(className === "Character"){
            if( params.created ){

                params.created.id = id; //hack to match prev functionality.
                onNewPlayer(params.created);
            }

            if( params.position ){
                params.position.id = id;

                onMovePlayer(params.position);
            }
        }
    }

    function onSocketDisconnect() {
        console.log("Disconnected from socket server");
    };

    function onNewPlayer(data) {
        console.log("New player connected: "+data.id);
        var newPlayer = new Player(data.x, data.y);
        newPlayer.id = data.id;
        remotePlayers.push(newPlayer);
    };

    function onMovePlayer(data) {
        var movePlayer = playerById(data.id);

        // Player not found
        if (!movePlayer) {
            console.log("Player not found: "+data.id);
            return;
        }

        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);
    };

    function onRemovePlayer(data) {
        var removePlayer = playerById(this.id);

        if (!removePlayer) {
            util.log("Player not found: "+this.id);
            return;
        }

        players.splice(players.indexOf(removePlayer), 1);
        this.broadcast.emit("remove player", {id: this.id});
    };

    // Keyboard key down
    Game.prototype.onKeydown = function (e) {
        if (localPlayer) {
            keys.onKeyDown(e);
        }

        if (localPlayer.update(keys)) {
            socket.emit("client:command", {
                name : "move",
                params : {
                    x: localPlayer.getX(),
                    y: localPlayer.getY()
               }
           });
        }

    };

    // Keyboard key up
    Game.prototype.onKeyup = function (e) {
        if (localPlayer) {
            keys.onKeyUp(e);
        }
        if (localPlayer.update(keys)) {
            socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
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

        if (localPlayer.update(keys)) {
            //socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
        }
//        localPlayer.update(keys);
    };

    /**************************************************
     ** GAME DRAW
     **************************************************/
    Game.prototype.draw = function () {
        // Wipe the canvas clean
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var i;
        for (i = 0; i < remotePlayers.length; i++) {
            remotePlayers[i].draw(ctx);
        }

        // Draw the local player
        localPlayer.draw(ctx);
    };

    return Game;
});
