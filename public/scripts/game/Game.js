define(['gameLoop', 'Player', 'Keys', 'Factory'], function (gameLoop, Player, Keys, Factory) {
    /**************************************************
     ** GAME VARIABLES
     **************************************************/
    var screenCanvas,			// Canvas DOM element
        screenCtx,

        bgCanvas,
        bgCtx,			// Canvas rendering context

        keys,			// Keyboard input

        entities = {},

        sectionsToDraw,
        socket;	// Local player

    function Game() {}
    /**************************************************
     ** GAME INITIALISATION
     **************************************************/
    Game.prototype.init = function () {
        // Declare the canvas and rendering context
        screenCanvas = document.getElementById("gameCanvas");
        screenCtx = screenCanvas.getContext("2d");

        // Maximise the canvas
        // HACK for uncorrected windows
        screenCanvas.width = window.innerWidth - 20;
        screenCanvas.height = window.innerHeight - 20;

        bgCanvas = document.createElement("canvas");
        bgCanvas.width = screenCanvas.width;
        bgCanvas.height = screenCanvas.height;

        bgCtx = bgCanvas.getContext("2d");

        //TODO: make a server
        socket = io( "http://localhost:8124", { transports: ["websocket"] } );

        // Initialise keyboard controls
        keys = new Keys();

        // Calculate a random start position for the local player
        // The minus 5 (half a player size) stops the player being
        // placed right on the egde of the screen

        remotePlayers = [];
        // Start listening for events
        this.setEventHandlers();
    };

    /**************************************************
     ** GAME EVENT HANDLERS
     **************************************************/
    Game.prototype.setEventHandlers = function() {
        // Keyboard
        //window.addEventListener("keydown", this.onKeydown, false);
        //window.addEventListener("keyup", this.onKeyup, false);

        window.addEventListener( 'mousedown', this.onMouseDown, false);
        //window.addEventListener( 'mousemove', this.onMouseMove, false);
        window.addEventListener( 'mouseup', this.onMouseUp, false);


        // Window resize
        window.addEventListener( 'resize', this.onResize, false);

        socket.on("connect", onSocketConnected);
        socket.on('server:initUpdate', onServerInitUpdate);
        socket.on("server:update", onServerUpdate);

        //debug info

        socket.on( 'debug:sectionsInfo', onSectionsInfo);

    };


    function onSectionsInfo(info){
        var w = info.w, h = info.h,
            sections = info.sections;

    };

    function playerById(id) {
        var i;
        for (i = 0; i < remotePlayers.length; i++) {
            if (remotePlayers[i].id == id)
                return remotePlayers[i];
        };

        return false;
    };


    function onSocketConnected() {
        console.log("Connected to server.");

        socket.emit( 'client:command', {
            name : "init",
            params : {
                name : "NAGIBATOR_" + Math.round(Math.random()*10000)
            }
        });

    };

    function onServerInitUpdate( update ){
        var id;

        for(id in update){
            processSingleEntityUpdate(id, update[id]);
        }

        socket.emit("client:updateProceed");


    };

    function onServerUpdate(update){
        var id;

        for(id in update){
            processSingleEntityUpdate(id, update[id]);
        }

        socket.emit("client:updateProceed");

    };


    function processSingleEntityUpdate(id, params){
        var entity = entities[id];

        //if destroy flag arrived from server, call destruction of client entity as well.
        if(entity && params.destroyed){
            entity.destroy();
            delete entities[id];
            return;
        }

        //creation of entity
        if(!entity){
            if(params.created){
                params.created.id = id;
                entities[id] = entity = Factory.createInstance(params.created);

                delete params.created; //no need for this flag any more
            }
        }

        //if any other updates are present.
        entity.serverUpdate( params );
    }

    function onSocketDisconnect() {
        console.log("Disconnected from socket server");
    };

    
    Game.prototype.onMouseMove = function (e) {
        e.preventDefault();

        //left mouse button click
        if(e.button === 0 && this.lbPressed){

            //socket.emit("client:command", {
            //    name : "shoot",
            //    params : {
            //        x: e.offsetX,
            //        y: e.offsetY
            //    }
            //});
            return;
        }

        //right mouse button click
        if(e.button === 2 && this.rbPressed){
            socket.emit("client:command", {
                name : "move",
                params : {
                    x: e.offsetX,
                    y: e.offsetY
                }
            });
            return;
        }

        return false;
    };

    Game.prototype.onMouseUp = function (e) {
        e.preventDefault();

        //left mouse button click
        if(e.button === 0 && this.lbPressed){
            this.lbPressed = false;
            return;
        }

        //right mouse button click
        if(e.button === 2 && this.rbPressed){
            this.rbPressed = false;
            return;
        }

        return false;
    };
    
    Game.prototype.onMouseDown = function (e) {
        e.preventDefault();

        //left mouse button click
        if(e.button === 0){
            this.lbPressed = true;
            socket.emit("client:command", {
                name : "shoot",
                params : {
                    x: e.offsetX,
                    y: e.offsetY
                }
            });
            return;
        }

        //right mouse button click
        if(e.button === 2){
            this.rbPressed = true;
            socket.emit("client:command", {
                name : "move",
                params : {
                    x: e.offsetX,
                    y: e.offsetY
                }
            });
            return;
        }

        return false;
    };

    // Browser window resize
    Game.prototype.onResize = function (e) {
        // Maximise the canvas
        screenCanvas.width = window.innerWidth - 1000;
        screenCanvas.height = window.innerHeight - 1000;

        bgCanvas.width = window.innerWidth - 1000;
        bgCanvas.height = window.innerHeight - 1000;
    };

    /**************************************************
     ** GAME ANIMATION LOOP
     **************************************************/
    Game.prototype.animate = function () {
        this.update();
        this.draw();

        // Request a new animation frame using Paul Irish's shim
        gameLoop( this.animate.bind(this) );
    };

    /**************************************************
     ** GAME UPDATE
     **************************************************/
    Game.prototype.update = function () {

        //if (localPlayer.update(keys)) {
        //    //socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
        //}
//        localPlayer.update(keys);
    };
    
    Game.prototype.setSectionsInfo = function (info) {
        this.sectionsInfo = info;
    }
    
    Game.prototype.drawTakenSections = function (ctx) {
        var me = this,
            sections, w, h,
            i, j;

        if(!me.sectionsInfo){
            return;
        }

        sections = me.sectionsInfo.sections;
        w = me.sectionsInfo.w;
        h = me.sectionsInfo.h;

        ctx.save();

        for( i = 0; i < sections.length; i++){
            for( j = 0; j < sections[i].length; j++){
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                if(sections[i][j].elements.length > 0){
                    ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
                }


            }
        }


    };

    /**************************************************
     ** GAME DRAW
     **************************************************/
    Game.prototype.draw = function () {
        bgCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
        screenCtx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

        this.drawTakenSections(bgCtx);

        var id;
        for(id in entities){
            entities[id].draw(bgCtx);
        }

        screenCtx.drawImage(bgCanvas, 0, 0);
    };

    return Game;
});
