/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Class which will hold all the GameRoom objects.
 */
var util = require('util'),
    path = require('path'),
    Factory = require( path.resolve( EXE_PATH, "./server/core/Factory" ) );


function Register(){}


Register.prototype.init = function () {
    var me = this;

    me.pool = {};
};

Register.prototype.createEntity = function (className, params) {
    var me = this,
        obj = Factory.createInstance(className, params);

    me.pool[ obj.id ] = obj;

    return obj;
};

Register.prototype.destroy = function () {
    var me = this,
        arg0 = arguments[0];

    if( typeof(arg0) === "number" ){
        arg0 = me.pool[arg0];
    }

    arg0.destroy();
    delete me.pool[arg0.id];
};




//make it a singletone, using a Global variable.
module.exports = (function () {

    console.log("Register required.");
    if(!global.Singletones){
        global.Singletones = {};
        console.log("Creating Singletones obj.")
    }

    if(global.Singletones.Register){
        console.log("Register exists. Returning.");
        return global.Singletones.Register;
    }

    console.log("Creating new Register.");
    global.Singletones.Register = new Register();
    global.Singletones.Register.init();

    return global.Singletones.Register;
})();



