/**
 * Created by alexey.moroz on 18.12.2014.
 *
 *
 * Class intended for Entities creation, will assign ids and
 *
 */
var util = require('util'),
    path = require('path');


function Factory(){}


Factory.prototype.init = function () {
    var me = this;

    me.entities = {};
    me.classMap = require( path.resolve( process.env.PATH, './configs/class_map.json' ) );

    me.createClassesDesc( me.classMap );

    //TODO: Make a global scope to avoid "require("path/to/class/file")" in all classes?
    //global.Game = me.classes;
};

Factory.prototype.createClassesDesc = function () {
    var me = this,
        className,
        desc;

    me.classes = {};

    for(className in me.classMap){
        //gets function description.
        desc = require( path.resolve( process.env.PATH, me.classMap[ className ] ) );

        me.classes[className] = desc;
    }
};

Factory.prototype.create = function (className, params) {
    var me = this,
        obj;

    if(! me.classes[ className ]){
        console.error("No such registered class: ", className);
        return;
    }

    obj = new me.classes[ className ];
    obj.init(params);

   return obj;
};


//make it a singletone, using a Global variable.
module.exports = (function () {

    if(!global.Singletones){
        global.Singletones = {};
    }

    if(global.Singletones.Factory){
        return global.Singletones.Factory;
    }

    global.Singletones.Factory = new Factory();
    global.Singletones.Factory.init();

    return global.Singletones.Factory;
})();





