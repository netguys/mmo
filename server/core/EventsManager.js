/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Mediator class according to Mediator pattern.
 *
 */

var util = require('util');
var events = require('events');

function EventsManager(){
    events.EventEmitter.call(this);
}

util.inherits(EventsManager, events.EventEmitter);


EventsManager.prototype.init = function () {
    var me = this;

    me.setMaxListeners(100000);
};


//make it a singletone, using a Global variable.
module.exports = (function () {

    if(!global.Singletones){
        global.Singletones = {};
    }

    if(global.Singletones.EventsManager){
        return global.Singletones.EventsManager;
    }

    global.Singletones.EventsManager = new EventsManager();
    global.Singletones.EventsManager.init();

    return global.Singletones.EventsManager;
})();



