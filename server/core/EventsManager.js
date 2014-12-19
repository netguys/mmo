/**
 * Created by alexey.moroz on 18.12.2014.
 *
 * Mediator class according to Mediator pattern.
 *
 */

var util = require("util");
var events = require("events");

function EventsManager(){
    events.EventEmitter.call(this);
}

util.inherits(EventsManager, events.EventEmitter);


EventsManager.prototype.init = function () {};


//make it a singletone, using a Global variable.
module.exports = (function () {

    if(global.__EventsManager){
        return global.__EventsManager;
    }

    global.__EventsManager = new EventsManager();
    global.__EventsManager.init();

    return global.__EventsManager;
})();



