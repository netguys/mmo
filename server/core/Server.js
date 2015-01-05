/**
 * Created by frostik on 02.01.2015.
 *
 * Main server class. Serves as a warp for the "socketio" server and static server.
 *
 */

var u = getCustomUtils(),
    util = require('util'),
    Factory = require( PATH.resolve( EXE_PATH, "./server/core/Factory" ) ),
    express = require('express'),
    Step = require( PATH.resolve( EXE_PATH, './server/core/Step') ),
    ClientSocket = require( PATH.resolve( EXE_PATH, "./server/core/connection/ClientSocket" ) ),
    Subscriber = require( PATH.resolve( EXE_PATH, "./server/core/Subscriber" ) );

function Server(){}
util.inherits(Server, Subscriber);


Server.prototype.init = function (params) {
    var me = this;
    Server.super_.prototype.init.apply(me, arguments);

    me.io = params.io; //socket io object
    me.app = params.app; //express app
    me.httpServer = params.httpServer; //http server

    me.step = new Step();
    me.step.init();

    me.users = {};

    //listeners on express app.
    me.app.use("/game", express.static( PATH.resolve( EXE_PATH, './public' ) ));

    //listeners for SocketIO global object
    me.io.on( 'connection', me.onConnection.bind(me) );

    //listeners to common EventManager
    me.on( 'socket:user.disconnect', me.onDisconnect.bind(me) );
};


Server.prototype.start = function (port) {
    var me = this;

    me.httpServer.listen(port);
    me.step.start();
};

Server.prototype.onConnection = function (socket) {
    var me = this,
        userId = "u" + u.getId(),
        clientSocket,
        newPlayer;

    console.log("Player connected: ", userId);

    clientSocket = Factory.createInstance( "ClientSocket", {
        userId : userId,
        socket : socket
    });

    newPlayer = Factory.createInstance( "Player", {
        userId : userId,
        clientSocket : clientSocket
    });

    me.users[userId] = newPlayer;


    console.log("Register after user Connected", global.Singletones.Register);

};

Server.prototype.onDisconnect = function (userId) {
    var me = this,
        player = me.users[userId];

    player.destroy();

    delete me.users[userId];

    console.log("Register after user Disconnect", global.Singletones.Register);
};

module.exports = Server;