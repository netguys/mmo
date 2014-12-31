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

    Player.super_.prototype.init.apply(me, arguments);

    me.gameStart();
};


Player.prototype.gameStart = function () {
    var me = this,
        randomPos = { x : Math.round( 200 * Math.random() ) , y : Math.round( 200 * Math.random() ) };

    me.character = Register.createEntity("Character", {
        position : randomPos
    });
};

Player.prototype.setupListeners = function () {
    var me = this;

    me.on( 'entity:created', me.onEntityInitialized.bind(me) );
    me.on( 'entity:destroyed', me.onEntityDestroyed.bind(me) );

    me.on( "entity:moveInitiated" , me.onEntityMoved.bind(me) );


    me.on( "step:pulseEnd", me.flushChanges.bind(me) );


    me.on( 'socket:' + me.userId + '.command', me.onCommand.bind(me) );
    me.on( 'socket:' + me.userId + '.updateProceed', me.onUpdateProceed.bind(me) );
};

Player.prototype.onEntityInitialized = function (entity, params) {
    this.changes.appendChange( entity.id, "created", params );
};

Player.prototype.onEntityDestroyed = function (entity) {
    this.changes.appendChange( entity.id, "destroyed" );
};

Player.prototype.onEntityMoved = function (entity, newPos) {
    this.changes.appendChange( entity.id, "pos", newPos )
};


Player.prototype.onCommand = function (command) {

};

Player.prototype.onUpdateProceed = function () {
    this.readyForUpdate = true;
};



Player.prototype.flushChanges = function () {
    var me = this;

    if( !me.readyForUpdate || !me.changes.present() ){
        return;
    }

    me.clientSocket.send( "update", me.changes.popChanges() );
};


module.exports = Player;