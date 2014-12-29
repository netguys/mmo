/**
 * Created by alexey.moroz on 19.12.2014.
 *
 * Class for collision handling.
 *
 */

var util = require('util'),
    path = require('path'),
    Subscriber = require( path.resolve( __dirname, '../core/Subscriber' ) );


function Collider(){}
util.inherits(Collider, Subscriber);


Collider.constructor = function () {
    Collider.super_.constructor.apply(this, arguments);
};


Collider.init();