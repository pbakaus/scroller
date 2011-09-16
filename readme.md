Zynga Scroller
==============

A pure logic component for scrolling/zooming. It is independent of any specific kind of rendering or event system. 

The "demo" folder contains examples for usage with DOM and Canvas renderings which works both, on mouse and touch driven devices.

Features
--------

* Customizable enabling/disabling of scrolling for x-axis and y-axis
* Deceleration (decelerates when user action ends in motion)
* Bouncing (bounces back on the edges)
* Paging (snap to full page width/height)
* Snapping (snap to an user definable pixel grid)
* Zooming (automatic centered zooming or based on a point in the view with configurable min/max zoom)
* Locking (locks drag direction based on initial movement)
* Configurable regarding whether animation should be used.

Options
-------

These are the available options with their defaults. Options can be modified using the second constructor parameter or during runtime by modification of `scrollerObj.options.optionName`.

* scrollingX = `true`
* scrollingY = `true`
* animating = `true`
* bouncing = `true`
* locking = `true`
* paging = `false`
* snapping = `false`
* zooming = `false`
* minZoom = `0.5`
* maxZoom = `3`

Usage
-----

Callback (first parameter of constructor) is required. Options are optional. Defaults are listed above. The created instance must have proper dimensions using a `setDimensions()` call. Afterwards you can pass in event data or manually control scrolling/zooming via the API.

```js
var scrollerObj = Scroller(function(left, top, zoom) {
	// apply coordinates/zooming
}, {
	scrollingY: false
});

// Configure to have an outer dimension of 1000px and inner dimension of 3000px
scrollerObj.setDimensions(1000, 1000, 3000, 3000);
```

Public API
----------

* Setup scroll object dimensions.
  `scrollerObj.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);`
* Setup scroll object position (in relation to the document)
  `scrollerObj.setPosition(clientLeft, clientTop);`
* XXX



Zynga Animate
=============

The Zynga Scroller uses our Zynga Animate class. This class uses requestAnimationFrame (or an automatic polyfill).

Features
--------
 
* Automatic dropped frame handling
* Frames per second are computed (and returned on complete event). Target frame rate is 60.
* Animations with duration or infinite animations
* Custom easing methods are supported
* Callbacks for:
  * each step (containing the current percent position)
  * completion (with reached frame rate and info about whether the animation was completed)
  * validation to continue animation (useful for endless animations)
* The animation can be cancelled by the ID returned by calling start()

Usage
-----

