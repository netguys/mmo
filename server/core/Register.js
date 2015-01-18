/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Class which will hold all the GameRoom objects.
 */
var util = require('util'),
    path = require('path'),
    Factory = require( path.resolve( EXE_PATH, "./server/core/Factory" ) ),
    Subscriber = require( path.resolve( EXE_PATH, "./server/core/Subscriber" ) );


function Register(){}
util.inherits(Register, Subscriber)


Register.prototype.init = function () {
    var me = this;
    Register.super_.prototype.init.apply(me, arguments);

    me.pool = {};
};

Register.prototype.setupListeners = function () {
    var me = this;
    Register.super_.prototype.setupListeners.apply(me, arguments);

    me.on( 'entity:destroyed', me.onEntitySelfDestruction.bind(me) );
};

Register.prototype.createEntity = function (className, params) {
    var me = this,
        obj = Factory.createInstance(className, params);

    me.pool[ obj.id ] = obj;

    return obj;
};


//TODO: Remove.
Register.prototype.destroyEntity = function () {
    var me = this,
        arg0 = arguments[0];

    if( typeof(arg0) === "number" ){
        arg0 = me.pool[arg0];
    }

    arg0.destroy();
};

Register.prototype.onEntitySelfDestruction = function (entity) {
    console.log("Removing form register.", entity.id);
    delete this.pool[entity.id];
};


Register.prototype.getEntitiesList = function () {
    var me = this,
        list = [];

    for(id in me.pool){
        list.push(me.pool[id]);
    }

    return list;
};



//make it a singletone, using a Global variable.
module.exports = createSingletoneExports(Register);



