/**
 * Created by alexey.moroz on 18.12.2014.
 */

/**
 * Global constants and functions declaration.
 */
global.PATH = require('path'); //path module
global.EXE_PATH = PATH.resolve( PATH.dirname( require.main.filename ) ); //folder of an executing script

//function returning ./server/utils class. (Needed to improve understanding)
global.getCustomUtils = function () {
    return require( PATH.resolve(EXE_PATH, './server/utils') );
};



//creation of singletones section
var Factory = require( PATH.resolve( EXE_PATH, "./server/core/Factory" ) ),
    Register = require( PATH.resolve( EXE_PATH, "./server/core/Register" ) );

//Needed to be called after init of all the Singletones, for ALL the classes to obtain a ref on them.
Factory.createClassesDesc();

var //u = require(path.resolve( process.env.PATH, './server/utils' )),
    io = require('socket.io'),
    Factory = require( PATH.resolve( EXE_PATH, "./server/core/Factory" ) ),

    Step = require('./server/core/Step'),
    Entity = require('./server/gameObjects/Entity'),


    execFolder;




console.log("MAIN Register: ", Register);

var char = Register.createEntity( "Character", {
        position : {
            x : 0,
            y : 0
        }
    }),
    proj;

char.moveTo(10, 10);

proj = char.shoot(-10, -10)

//console.log("char === ", char, "\n");
//console.log("proj === ", proj, "\n");

console.log("Reg: ", Register);
Register.destroy(0);
console.log("\n\nReg: ", Register);

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

