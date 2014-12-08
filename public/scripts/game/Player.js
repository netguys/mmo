/**************************************************
 ** GAME PLAYER CLASS
 **************************************************/

define(function() {

    function Player (startX, startY) {
        this.x = startX;
        this.y = startY;
        this.moveAmount = 2;
    }

    Player.prototype.update = function(keys) {
        // Up key takes priority over down
        if (keys.up) {
            this.y -= this.moveAmount;
        } else if (keys.down) {
            this.y += this.moveAmount;
        }

        // Left key takes priority over right
        if (keys.left) {
            this.x -= this.moveAmount;
        } else if (keys.right) {
            this.x += this.moveAmount;
        }
    };

    Player.prototype.draw = function(ctx) {
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
    };

    return Player;
});
