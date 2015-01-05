/**
 * Created by frostik on 31.12.2014.
 *
 * Class which wraps SocketIO ClientSocket object to properly
 *
 */

var util = require('util'),
    Subscriber = require( PATH.resolve( EXE_PATH, './server/core/Subscriber' ) );


function ClientSocket(){}
util.inherits(ClientSocket, Subscriber);

ClientSocket.prototype.init = function ( params ) {
    var me = this;

    me.socket = params.socket;
    me.userId = params.userId;

    //setup socketIO socket listeners. works as a "bridge" between
    //"socketIO" events and internal "EventManager" events.
    me.socket.on( 'client:updateProceed', me.onUpdateProceed.bind(me) );
    me.socket.on( 'client:command', me.onCommand.bind(me) );

    me.socket.on( 'disconnect', me.onDisconnect.bind(me) );

};

ClientSocket.prototype.onCommand = function (command) {
    var me = this,
        event = "socket:" + me.userId + ".command";

    me.emit(event, command);
};

ClientSocket.prototype.onUpdateProceed = function () {
    var me = this,
        event = "socket:" + me.userId + ".updateProceed";

    me.emit(event);
};


ClientSocket.prototype.onDisconnect = function () {
   this.emit( 'socket:user.disconnect', this.userId );
};

/**
 * Dublicates socketIO Socket's emit method.
 *
 */
ClientSocket.prototype.send = function () {
    this.socket.emit.apply(this.socket, arguments);
};


module.exports = ClientSocket;
