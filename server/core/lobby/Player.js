/**
 * Created by frostik on 30.12.2014.
 */
var util = require('util'),
    ChangesManager = require( PATH.resolve( __dirname, './ChangesManager' ) ),
    Subscriber = require( PATH.resolve( EXE_PATH, './server/core/Subscriber' ) ),
    Register = require( PATH.resolve( EXE_PATH, "./server/core/Register" ) );


function Player(){}
util.inherits(Player, Subscriber);

Player.prototype.init = function (params) {
    var me = this;

    me.userId = params.userId;
    me.clientSocket = params.clientSocket;

    me.changes = new ChangesManager();
    me.changes.init({
        player : me
    });



    me.commands = {};
    me.readyForUpdate = false; // flush changes to client or not.

    Player.super_.prototype.init.apply(me, arguments);
    me.setupCommandHandlers();

};


Player.prototype.gameStart = function () {
    var me = this,
        //randomPos = { x : 50 Math.round( 200 * Math.random() ) , y : Math.round( 200 * Math.random() ) };
        randomPos = { x : 50 , y : 50 };

    me.character = Register.createEntity("Character", {
        charName : me.name,
        position : randomPos
    });
};

Player.prototype.setupListeners = function () {
    var me = this;

    //handling of entity changes.
    me.on( 'entity:created', me.onEntityInitialized.bind(me) );
    me.on( 'entity:destroyed', me.onEntityDestroyed.bind(me) );

    me.on( "entity:moveInitiated" , me.onEntityMoved.bind(me) );


    //attempt to flush possible changes on the end of update.
    me.on( "step:pulseEnd", me.flushChanges.bind(me) );


    //listening to socket events. (Client Actions)
    me.on( 'socket:' + me.userId + '.command', me.onCommand.bind(me) );
    me.on( 'socket:' + me.userId + '.updateProceed', me.onUpdateProceed.bind(me) );
};


/**
 * ===========================================
 * Commands from users handling related.
 */

Player.prototype.setupCommandHandlers = function () {
    var me = this;

    me.setCommandHandler('init', me.commandInit.bind(me));
    me.setCommandHandler('move', me.commandMove.bind(me));
    me.setCommandHandler('shoot', me.commandShoot.bind(me));
};


Player.prototype.commandInit = function ( params ) {
    var me = this;

    me.name = params.name;

    me.gameStart();
    me.readyForUpdate = true;
};

Player.prototype.commandMove = function ( params ) {
    this.character.moveTo( params.x, params.y );
};

Player.prototype.commandShoot = function ( params ) {
    this.character.shoot( params.x, params.y )
};


/**
 * ======================================
 * Changes detection section.
 *
 */
Player.prototype.onEntityInitialized = function (entity, params) {
    this.changes.appendChange( entity.id, entity.className, "created", params );
};

Player.prototype.onEntityDestroyed = function (entity) {
    this.changes.appendChange( entity.id, entity.className, "destroyed" );
};

Player.prototype.onEntityMoved = function (entity, newPos) {
    this.changes.appendChange( entity.id, entity.className, "pos", newPos )
};




/**
 * ======================================
 * User actions handling.
 */
Player.prototype.onCommand = function (command) {
    var me = this,
        handler;

    console.log("commend from player=%s : ", this.userId, command);
    if(handler = me.commands[command.name]){
        handler( command.params );
    }
};

Player.prototype.setCommandHandler = function (name, func) {
    this.commands[name] = func;
};


Player.prototype.onUpdateProceed = function () {
    this.readyForUpdate = true;
};



/**
 * ================================
 * Private methods.
 */
Player.prototype.flushChanges = function () {
    var me = this;

    if( !me.readyForUpdate || !me.changes.present() ){
        return;
    }

    me.readyForUpdate = false;

    me.clientSocket.send( 'server:update', me.changes.popChanges() );
};


Player.prototype.destroy = function () {
    var me = this;

    if(me.character){
        Register.destroyEntity(me.character);
    }

    me.removeAllLocalListeners();
    me.emit("player:destroyed", me);
};

module.exports = Player;