/**
 * Created by alexey.moroz on 24.12.2014.
 *
 *
 *  Describes classes of Bounding Shapes which may interact between each other.
 */

var util = require('util'),
    path = require('path'),

    u = require('./server/utils'),

    Subscriber = require( path.resolve( __dirname, '../core/Subscriber' ) );


/**
 * BoundingCircle class.
 */

function BoundingCircle(){}
util.inherits(BoundingCircle, Subscriber);


BoundingCircle.constructor = function () {
    BoundingCircle.super_.constructor.apply(this, arguments);
};

BoundingCircle.prototype.init = function (entity, size) {
    var me = this;
    BoundingCircle.super_prototype.apply(me, arguments);

    me.master = entity;
    me.radius = size;
};


BoundingCircle.prototype.checkCollision = function (shape) {
    var me = this;

    if(shape instanceof BoundingCircle){
        return me.checkCircleCollision(shape);
    }

    if(shape instanceof BoundingBox){
        return me.checkBoxCollision(shape);

    }

};

BoundingCircle.prototype.checkCircleCollision = function (shape) {
    var me = this,
        deviation = .0,
        dV;


    if( deviation = ((me.radius + shape.radius) - u.calcDistance( me.master.pos, shape.master.pos) ) >= 0 ){
        return {x : 0, y: 0};
    }

    dV = u.normalize( me.master.pos.x - shape.master.pos.x, me.master.pos.y - shape.master.pos.y );

    dV.x *= deviation;
    dV.y *= deviation;

    return dV;
};

//TODO: implement
BoundingCircle.prototype.checkBoxCollision = function (shape) {
    return { x: 0, y: 0}
};


/**
 *
 * BoundingBox class.
 *
 */


function BoundingBox(){}
util.inherits(BoundingBox, Subscriber);


BoundingBox.constructor = function () {
    BoundingBox.super_.constructor.apply(this, arguments);
};

BoundingBox.prototype.init = function (entity, hw, hh) {
    var me = this;
    BoundingBox.super_prototype.apply(me, arguments);

    me.master = entity;
    me.hw = hw; //half width
    me.hh = hh; //half height
};


/**
 * Check collision with a different shapes.
 *
 *
 *
 *
 * @param shape
 * @returns {Object} correction Vector.
 */
BoundingBox.prototype.checkCollision = function (shape) {
    var me = this;

    if(shape instanceof BoundingCircle){
        return me.checkCircleCollision(shape);
    }

    if(shape instanceof BoundingBox){
        return me.checkBoxCollision(shape);

    }

};
//TODO: implement
BoundingBox.prototype.checkCircleCollision = function (shape) {
    return { x: 0, y: 0 };
};

BoundingBox.prototype.checkBoxCollision = function (shape) {
    var me = this,
        dx, dy;

    dx = Math.abs( me.master.x - shape.master.x ) - (me.hw + shape.hw);
    dy = Math.abs( me.master.y - shape.master.y ) - (me.hh + shape.hh);

    if(dx > dy){
        return { x: 0, y : dy}
    }
    else {
        return { x : dx, y : 0 }
    }

};

module.exports.BoundingBox = BoundingBox;
module.exports.BoundingCircle = BoundingCircle;