/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * College class according to Mediator pattern.
 *
 */

var util = require('util'),
    path = require('path'),
    EventsManager = require(path.resolve(__dirname, './EventsManager.js'));

function Subscriber(){};

//all the children will have methods of a Singleton EventsManager, which will refer to single EventEmitter.
Subscriber.prototype = EventsManager;

Subscriber.prototype.init = function () {
    var me = this;

    me.listening = {};
    me.setupListeneners();
};

//no default listeners. May be added in future.
Subscriber.prototype.setupListeneners = function () {};

//TODO: Deal with it.
Subscriber.on = function () {
    Subscriber.prototype.on.apply(this, arguments);

    this.listening[ arguments[0] ] = arguments[1];
};

Subscriber.prototype.removeAllLocalListeners = function () {
    var me = this,
        event,
        listener;

    for(event in me.listening){
        listener = me.listening[event];

        me.prototype.removeListener(event, listener);
    }
};

module.exports = Subscriber;
