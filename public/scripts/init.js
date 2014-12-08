
define(['Game'], function (Game) {
    return {
        initGame : function() {
            var game = new Game();

            game.init();
            game.animate();
        }
    }
});