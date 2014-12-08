/**************************************************
 ** GAME KEYBOARD CLASS
 **************************************************/

define(function() {

    function Keys(up, left, right, down) {
        this.up = up || false;
        this.left = left || false;
        this.right = right || false;
        this.down = down || false;
    }

    Keys.prototype.onKeyDown = function(e) {
        var that = this,
            c = e.keyCode;

        switch (c) {
            // Controls
            case 37: // Left
                that.left = true;
                break;
            case 38: // Up
                that.up = true;
                break;
            case 39: // Right
                that.right = true; // Will take priority over the left key
                break;
            case 40: // Down
                that.down = true;
                break;
        }
    };

    Keys.prototype.onKeyUp = function(e) {
        var that = this,
            c = e.keyCode;

        switch (c) {
            case 37: // Left
                that.left = false;
                break;
            case 38: // Up
                that.up = false;
                break;
            case 39: // Right
                that.right = false;
                break;
            case 40: // Down
                that.down = false;
                break;
        }
    };

    return Keys;
});