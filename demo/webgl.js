var clear = require('gl-clear')({ color: [1,0.5,0.5,1.0] })
var getGL = require('webgl-context')

require('domready')(function() {
	var glContext = getGL()

	//you can specify 'webgl' string, or a context that already exists
	var opt = {
		context: glContext
	}
    var app = require('../')(function(gl) {
        clear(gl)
    }, opt);

    //clear margin
    document.body.style.margin = '0'

    //append to DOM
    document.body.appendChild( app.canvas );
    
    //start render loop
    app.start();
});