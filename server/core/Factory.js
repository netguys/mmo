/**
 * Created by alexey.moroz on 18.12.2014.
 *
 *
 * Class intended for Entities creation, will assign ids and
 *
 */
var util = require('util');


function Factory(){}


Factory.prototype.init = function () {
    var me = this;

    me.entities = {};
    me.classMap = require( PATH.resolve( EXE_PATH, './server/configs/class_map.json' ) );

    //TODO: Make a global scope to avoid "require("path/to/class/file")" in all classes?
    //global.Game = me.classes;
};

Factory.prototype.createClassesDesc = function () {
    var me = this,
        className,
        pathToFile,
        desc;

    me.classes = {};

    for(className in me.classMap){
        //gets function description.
        pathToFile = PATH.resolve( PATH.resolve( PATH.dirname( require.main.filename ), me.classMap[ className ] ) );

        desc = require(pathToFile);
        if(typeof desc !== "function"){
            console.error("Class description is not a function. ClassName=%s", className);
        }
        else{
            me.classes[className] = desc;
        }

    }
};

Factory.prototype.createInstance = function (className, params) {
    var me = this,
        obj;

    if(! me.classes[ className ]){
        console.error('No such registered class: ', className);
        return;
    }

    obj = new me.classes[ className ];
    obj.init(params);

   return obj;
};


//make it a singletone, using a Global variable.
module.exports = createSingletoneExports(Factory);