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

    me.io = params.io; //socket io object
    me.app = params.app; //express app

    me.step = new Step();
    me.step.init();

    me.users = {};

    me.app.use("/game", express.static( PATH.resolve( EXE_PATH, './public' ) ));

    me.io.on( 'connection', me.onConnection.bind(me) );
};


Server.prototype.start = function (port) {
    var me = this;

    me.app.listen(port);
    //me.step.start();
};

Server.prototype.onConnection = function (socket) {
    var me = this,
        userId = "u" + u.getId(),
        clientSocket = Factory.create("ClientSocket", {
            userId : userId,
            socket : socket
        }),
        newPlayer;

    console.log("Socket connected : ", socket);

    console.log("Player connected: ", userId);

    newPlayer = Factory.create("Player", {
        userId : userId,
        clientSocket : clientSocket
    });

    me.users[userId] = newPlayer;
};


module.exports = Server;