/**
 * Created by frostik on 02.01.2015.
 *
 * Server entry point.
 *
 */

var util = require('util');

global.PATH = require('path'); //path module
global.EXE_PATH = PATH.resolve( PATH.dirname( require.main.filename ) ); //folder of an executing script

//function returning ./server/utils class. (Added for code simplicity)
global.getCustomUtils = function() {
    return require( PATH.resolve(EXE_PATH, './server/utils') );
};

//creation of singletones section
var Factory = require( PATH.resolve( EXE_PATH, "./server/core/Factory" ) ),
    Register = require( PATH.resolve( EXE_PATH, "./server/core/Register" ) );

//Needed to be called after init of all the Singletones, for ALL the classes to obtain a ref on them.
Factory.createClassesDesc();

var Server = require( PATH.resolve( EXE_PATH, './server/core/Server') ),

    app = require('express')(),
    httpServer = require('http').Server(app),
    io = require('socket.io')( httpServer, {
        'transports' : [ 'websocket' ]
    }),
    server = new Server();

server.init({
    io : io,
    app : app,
    httpServer : httpServer
});

server.start(8124);



