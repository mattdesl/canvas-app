require('domready')(function() {
    var app = require('../')(function(context, width, height) {
        context.clearRect(0, 0, width, height);

        context.fillRect(20, 30, 55, 25);
        context.fillText("FPS: "+this.fps, 20, 20);
    });

    //append to DOM
    document.body.appendChild( app.canvas );

    //start render loop
    app.start();
});