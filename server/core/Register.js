/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Class which will hold all the GameRoom objects.
 */
var util = require('util'),
    path = require('path'),
    Factory = require( path.resolve( process.env.PATH, "./server/core/Factory" ) );



function Register(){}


Register.prototype.init = function () {
    var me = this;

    me.pool = [];
};

Register.prototype.createEntity = function () {

};




//make it a singletone, using a Global variable.
module.exports = (function () {

    if(!global.Singletones){
        global.Singletones = {};
    }

    if(global.Singletones.Register){
        return global.Singletones.Register;
    }

    global.Singletones.Register = new Register();
    global.Singletones.Register.init();

    return global.Singletones.Register;
})();



