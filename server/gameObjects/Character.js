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

    Entity = absRequire('./server/gameObjects/Entity' ) ,

    CHARACTER_CONFIG = absRequire( './server/configs/character_default.json' );


function Character(){};
util.inherits(Character, Entity);

Character.constructor = function () {
    Character.super_.constructor.apply(this, arguments);
};

Character.prototype.getClassName = function () {
    return 'Character';
};

Character.prototype.init = function (params) {
    var me = this;
    Character.super_.prototype.init.apply(me, arguments);


    me.mv = { x : 0, y : 0 }; //normalized vector

    //TODO: utils.applyConfig method should be provided
    me.v = CHARACTER_CONFIG.velocity; //numerical value

    me.pos = params.position;
    me.dst = me.pos; // destination point

    me.hits = 0;
    params.hits = me.hits;

    me.pathLeft = 0;

    me.charName = params.charName;

    me.createBoundingShape("BoundingCircle", {
        radius : 20
    });

    me.notifyCreation(params);
};

Character.prototype.createInitUpdateParams = function () {
    var me = this;

    return {
        position : me.pos,
        charName : me.charName,
        hits : me.hits
    };
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
    var me = this,
         direction = u.normalize( { x : x - me.pos.x, y : y - me.pos.y} );

    return Register.createEntity( "Projectile", {
        ownerId : me.id+0,
        direction : direction,
        velocity : 1000,
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

    me.pathLeft = u.calcDistance( me.pos, me.dst );
    me.mv = u.normalize( me.dst.x - me.pos.x, me.dst.y - me.pos.y );

    if(me.pathLeft > 0){
        dS = me.v * dt/1000;

        me.pos.x += me.mv.x * dS;
        me.pos.y += me.mv.y * dS;

        me.pathLeft -= dS;

        if( me.pathLeft < 0 ){
            me.pos = me.dst;
        }
                                            //new cooridnates
        me.emit("entity:moveInitiated", me, me.getPosition() );
    }
};

Character.prototype.decHp = function(value){
    var me = this,
        value = value ? value : 1;
    this.hits += value;

    this.emit( 'entity:paramChanged', me, "hits", this.hits );
};

Character.prototype.onCollisionDetected = function (entity, cv, initiator, firstOccurance) {
    var me = this;

    if( initiator && entity.getClassName() === "Projectile" && entity.ownerId != me.id ){
        me.decHp();
    }

    if( entity.getClassName() === "Character" ){
        me.pos.x += cv.x;
        me.pos.y += cv.y;

        me.emit("entity:moveInitiated", me, me.getPosition() );
    }
};

module.exports = Character;