var getGL = require('webgl-context');

function CanvasApp(render, options) {
    if (!(this instanceof CanvasApp))
        return new CanvasApp(render, options);

    //allow options to be passed as first argument
    if (typeof render === 'object' && render) {
        options = render;
        render = null;
    }

    render = typeof render === 'function' ? render : options.onRender;

    options = options||{};
    options.retina = typeof options.retina === "boolean" ? options.retina : true;
    
    var hasWidth = typeof options.width === "number", 
        hasHeight = typeof options.height === "number";

    //if either width or height is specified, don't auto-resize to the window...
    if (hasWidth || hasHeight) 
        options.ignoreResize = true;

    options.width = hasWidth ? options.width : window.innerWidth;
    options.height = hasHeight ? options.height : window.innerHeight;

    var DPR = options.retina ? (window.devicePixelRatio||1) : 1; 

    //setup the canvas
    var canvas = options.canvas || document.createElement("canvas");
    canvas.width = options.width * DPR;
    canvas.height = options.height * DPR;

    if (options.retina) {
        canvas.style.width = options.width + 'px';
        canvas.style.height = options.height + 'px';
    }

    var context,
        attribs = options.contextAttributes||{};

    this.isWebGL = false;
    if (options.context === "webgl" || options.context === "experimental-webgl") {
        context = getGL({ canvas: canvas, attributes: attribs });
        if (!context) {
            throw "WebGL Context Not Supported -- try enabling it or using a different browser";
        }
        this.isWebGL = true;
    } else {
        context = canvas.getContext(options.context||"2d", attribs);
    }

    this.running = false;
    this.width = options.width;
    this.height = options.height;
    this.canvas = canvas;
    this.context = context;
    this.onResize = options.onResize;
    this._DPR = DPR;
    this._retina = options.retina;
    this._once = options.once;
    this._ignoreResize = options.ignoreResize;
    this._lastFrame = null;
    this._then = Date.now();

    if (!this._ignoreResize) {
        window.addEventListener("resize", function() {
            this.resize(window.innerWidth, window.innerHeight);
        }.bind(this));

        window.addEventListener("orientationchange", function() {
            this.resize(window.innerWidth, window.innerHeight);
        }.bind(this));
    }

    if (typeof render === "function") {
        this.onRender = render;   
    } else {
        //dummy render function
        this.onRender = function (context, width, height, dt) { };
    }

    this.renderOnce = function() {
        var now = Date.now();
        var dt = (now-this._then);

        if (!this.isWebGL) {
            this.context.save();
            this.context.scale(this._DPR, this._DPR);
        }
        
        this.onRender(this.context, this.width, this.height, dt);

        if (!this.isWebGL)
            this.context.restore();

        this._then = now;
    };

    this._renderHandler = function() {
        if (!this.running) 
            return;
        
        if (!this._once) {
            this._lastFrame = requestAnimationFrame(this._renderHandler);
        }

        this.renderOnce();
    }.bind(this);

    if (typeof options.onReady === "function") {
        options.onReady.call(this, context, this.width, this.height);
    }
}

CanvasApp.prototype.start = function() {
    if (this.running)
        return;
    
    if (this._lastFrame) 
        cancelAnimationFrame(this._lastFrame);

    this.running = true;
    this._then = Date.now();
    this._lastFrame = requestAnimationFrame(this._renderHandler);
};

CanvasApp.prototype.stop = function() {
    if (this._lastFrame) {
        cancelAnimationFrame(this._lastFrame);
        this._lastFrame = null;
    }
    this.running = false;
};

CanvasApp.prototype.resize = function(width, height) {
    var canvas = this.canvas;

    this.width = width;
    this.height = height;
    canvas.width = this.width * this._DPR;
    canvas.height = this.height * this._DPR;

    if (this._retina) {
        canvas.style.width = this.width + 'px';
        canvas.style.height = this.height + 'px';
    }

    if (this._once)
        requestAnimationFrame(this._renderHandler);
    if (typeof this.onResize === "function")
        this.onResize(this.width, this.height);
};

module.exports = CanvasApp;