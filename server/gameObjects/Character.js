/**
 * Created by alexey.moroz on 18.12.2014.
 *
 *
 * Describes an abstract character which may move to a destination point.
 */
var util = require('util'),
    u = getCustomUtils(),
    path = require('path'),

    Register = Singletones.Register,

    Entity = require( path.resolve( __dirname, '../gameObjects/Entity' ) ),
    BoundingBox = require( path.resolve( __dirname, '../core/collisions/BoundingShapes' ) ).BoundingBox,

    CHARACTER_CONFIG = require( path.resolve( EXE_PATH, './server/configs/character_default.json' ) )


function Character(){};
util.inherits(Character, Entity);

Character.constructor = function () {
    Character.super_.constructor.apply(this, arguments);
};


Character.prototype.init = function (params) {
    var me = this;
    Character.super_.prototype.init.apply(me, arguments);
    me.mv = { x : 0, y : 0 }; //normalized vector

    //TODO: utils.applyConfig method should be provided
    me.v = CHARACTER_CONFIG.velocity; //numerical value

    me.pos = params.position;
    me.dst = me.pos; // destination point

    me.pathLeft = 0;


    me.bBox = new BoundingBox();
    me.bBox.init(me, CHARACTER_CONFIG.hw, CHARACTER_CONFIG.hh);
};


Character.prototype.moveTo = function (x, y) {
    var me = this,
        dstPoint = { x : x, y : y },
        vec = { x : x - me.pos.x, y : y - me.pos.y};

    me.dst = dstPoint;
    me.pathLeft = u.vecLength(vec);

    me.mv = u.normalize(vec);

};

Character.prototype.shoot = function (x, y) {
    var me = this;

    return Register.createEntity( "Projectile", {
        direction : u.normalize( { x : x - me.pos.x, y : y - me.pos.y} ),
        velocity : 1,
        pos : {
            x : me.pos.x,
            y : me.pos.y
        },
        hw : 5,
        hh : 5
    });
};


Character.prototype.update = function (dt) {
    var me = this,
        dS; //delta distance


    if(me.pathLeft > 0){
        dS = me.v * dt/1000;

        me.pos.x += me.mv.x * dS;
        me.pos.y += me.mv.y * dS;

        me.pathLeft -= dS;

                                            //new cooridnates
        me.emit("entity:moveInitiated", me, { x : me.pos.x + 0, y : me.pos.y + 0 });
    }


};


module.exports = Character;