/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Class which fires a pulse event on 'at least' given timeout.
 * (Large amount of code being executed, or large amount of synchronous
 *  code may delay the execution of 'step:pulse' event )
 *
 */

var util = require('util'),
    path = require('path'),
    Subscriber = require( path.resolve( __dirname, './Subscriber' ) );


function Step(){}
util.inherits(Step, Subscriber);

Step.constructor = function () {
    Step.super_.constructor.apply(this, arguments);
};

Step.prototype.init = function (timeout) {
    var me = this;
    Step.super_.prototype.init.apply(me, arguments);

    me.stepTimeout = timeout;
    me.stopped = true;
};



Step.prototype.pulse = function () {
    var me = this,
        currentTime = Date.now();


    me.emit( 'step:pulse', currentTime );

    //handled by a Collider.
    me.emit( 'step:collisionUpdate' );

    me.emit( 'step:pulseEnd' ); //will be handled only by Player class objects.
    if(me.stopped){
       return;
    }
    //setImmediate sets a function to be executed on a next iteration of an EventLoop,
    //setting it in queue with other I\O or timeout callbacks in order of acceptance.
    //kind of analog for the browser "RequestAnimationFrame"
    setImmediate(function () {
        me.pulse();
    });

};



Step.prototype.start = function () {
    this.stopped = false;
    this.pulse();
};

Step.prototype.stop = function () {
    this.stopped = true;
};


module.exports = Step;
