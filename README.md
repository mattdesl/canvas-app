# canvas-app

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

The Easy Bake Oven of canvas rendering. Sets up a canvas for 2D or WebGL context, handling a few things like:

- CSS scaling for retina displays with a devicePixelRatio of > 1.0
- Boilerplate to safely grab 2D/webgl context
- resizes the canvas to full-screen on resize & device orientation change (by default)
- basic delta time calculation
- start/stop handling
- current FPS

Simplest use might look like this:

```js
//a simple render loop
function render(context, width, height, dt) {
	context.clearRect(0, 0, width, height);
	context.fillRect(20, 50, 25, 25);

	context.fillText("FPS: "+this.fps, 20, 20);
}

//defaults to a full-screen canvas
var app = require('canvas-app')(render);

//append to DOM
document.body.appendChild( app.canvas );

//start render loop
app.start();
```

For simple use like the above, you may want to use [canvas-testbed](https://github.com/mattdesl/canvas-testbed), which also handles DOM ready event, better body styling for full-screen canvas apps, and requestAnimationFrame polyfills.

## Usage

[![NPM](https://nodei.co/npm/canvas-app.png)](https://nodei.co/npm/canvas-app/)

Another example:

```js
var app = require('canvas-app')(renderHandler, {
	width: 256,
	height: 256,
	once: true, //only render once
	retina: false, //don't try to scale for retina displays
});

//renders a single frame
app.renderOnce();
```

The constructor can take two forms:

```js
canvasApp(renderHandler, options);
canvasApp(options);
```

### options

- `width` force a width of the canvas in pixels. If passed, resize events will be ignored
- `height` force a height of the canvas in pixels. If passed, resize events will be ignored
- `ignoreResize` if true, resize events will be ignored
- `retina` default true, whether to scale the canvas style and context for device pixel ratio
- `once` only renders a single frame, and then again on resize
- `canvas` the canvas element to use, otherwise creates a new element
- `context` the context to use, can be either 'webgl' or '2d', defaults to 2d
- `contextAttributes` passed to the getContext call
- `onResize` a function called on resize with arguments `width, height`
- `onRender` a function called on render with arguments `context, width, height, deltaTime` (can instead be passed as first argument to the constructor)

### methods

- `renderOnce()` renders a single frame
- `start()` starts the render loop
- `stop()` stops the current render loop
- `resize(width, height)` resizes the canvas to the given size. You should probably use `ignoreResize` if you want to manually handle resize events.

### properties

- `canvas` the canvas element
- `context` the 2D or WebGL rendering context
- `width`, `height` the current size, not scaled by devicePixelRatio
- `running` whether the loop is currently running

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/canvas-app/blob/master/LICENSE.md) for details.