/**
 * Created by alexey.moroz on 18.12.2014.
 */
var util = require('util'),
    path = require('path');

global.EXE_PATH = path.resolve( path.dirname( require.main.filename ) );
global.PATH = path;
global.getCustomUtils = function () {
    return require( PATH.resolve(EXE_PATH, './server/utils') );
};

var //u = require(path.resolve( process.env.PATH, './server/utils' )),
    io = require('socket.io'),
    Step = require('./server/core/Step'),
    Entity = require('./server/gameObjects/Entity'),

    Register = require('./server/core/Register'),
    execFolder;




var obj = Register.createEntity( "Character", {
    position : {
        x : 0,
        y : 0
    }
});

console.log("obj", obj);

obj.moveTo(10, 10);


console.log("obj after", obj);
//startPing();
//
//step.start();
//
//var step = new Step(),
//    entitiesNum =
// 100,
//    entities = [],
//    entity,
//    i;
//
//
//
//
//for(i = 0; i < entitiesNum; i++ ){
//    entity = new Entity();
//    entity.init();
//
//    entities.push(entity);
//}
//
//var startPing = (function(){
//    var counter = 0,
//        pingFunc = function (){
//            console.log("PING! ", counter);
//            counter++;
//            setTimeout(function () {
//                pingFunc();
//            }, 1000);
//        };
//
//    return pingFunc;
//})();


//step.init(1000);
//entity.init();
//

