/**
 * Created by frostik on 30.12.2014.
 *
 * Represents an object holding info about changes of Entities the player is being subscribed onto.
 *
 *
 * change = {
 *      id : Number - entity id
 *      type : String - type of property being changed
 *      values - the value of property being canged
 * }
 *
 */

var ENTITY_CREATED = "created",
    ENTITY_DESTROYED = "destroyed";



function ChangesManager(){}


ChangesManager.prototype.init = function (params) {
    var me = this;

    me.player = params.player;

    me.changes = {};
};

/**
 * Appends a change to a changes obj. If provided change type was present for a given entity, rewrites it by a newer info.
 * @param id
 * @param type
 * @param values
 */
ChangesManager.prototype.appendChange = function (id, className, type, values) {
    var me = this,
        changes = me.changes;

    if(!changes[id]){
        changes[id] = {};
    }

    // case when entity was created, lived some time and destroyed but due to
    // Player latency, changes didn't flush to client in time, and he didn't
    // receive "creation" change, so he doesn't need "destroy" as well.

    if(changes[id][ENTITY_CREATED] && ( type === ENTITY_DESTROYED ) ){
        delete changes[id];
        return;
    }

    if(changes[id].destroyed ){
        console.log("!!! !!! !!! ALARM !!! !!! !!! Trying to append a change of a destroyed entity.");
        return;
    }

    changes[id][type] = values;
    changes[id][type].className = className;

    if(type === ENTITY_DESTROYED){
        changes[id] = {
            destroyed : true
        };
    }

};

/**
 * Returns if changes are present or not
 *
 */

ChangesManager.prototype.present = function () {
    var me = this,
        id;

    for(id in me.changes){
        return true;
    }
    return false;
};


ChangesManager.prototype.popChanges = function () {
    var me = this,
        oldChanges = me.changes,
        newObj = {},
        id;

    for(id in oldChanges){
        newObj[id] = oldChanges[id];
    }

    me.changes = {};

    return newObj;
};

module.exports = ChangesManager;