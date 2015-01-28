/**
 * Created by alexey.moroz on 20.01.2015.
 */


function Debugger(){}

Debugger.prototype.init = function () {
    this.info = {};
    this.setEnabled(false);

    return this;
};

Debugger.prototype.writeInfo = function (key, value) {
    if(!this.enabled){
        return;
    }
    this.info[key] = value;
};

Debugger.prototype.getInfo = function () {
    return this.info;
};

Debugger.prototype.do = function (func) {
    if(!this.enabled){
        return;
    }

    func();
};

Debugger.prototype.setEnabled = function (isEnabled) {
    this.enabled = isEnabled;
};

module.exports = new Debugger();