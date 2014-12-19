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
};



Step.prototype.pulse = function () {
    var me = this,
        currentTime = Date.now();

    //console.log('PULSE: ', currentTime);

    me.emit('step:pulse', currentTime);

    //setTimeout sets a function to be executed with delay on a main EventLoop, so this will be executed asynchronously.
    setTimeout(function () {
        me.pulse();
    }, me.stepTimeout);

};



Step.prototype.start = function () {
    this.pulse();
};


module.exports = Step;
