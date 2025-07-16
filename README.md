Zynga Scroller
==============

A pure logic component for scrolling/zooming. It is independent of any specific kind of rendering or event system. 

The "demo" folder contains examples for usage with DOM and Canvas renderings which works both, on mouse and touch driven devices.


Demos
-----

See our demos online here: http://pbakaus.github.io/scroller/


Features
--------

* Customizable enabling/disabling of scrolling for x-axis and y-axis
* Deceleration (decelerates when user action ends in motion)
* Bouncing (bounces back on the edges)
* Paging (snap to full page width/height)
* Snapping (snap to an user definable pixel grid)
* Zooming (automatic centered zooming or based on a point in the view with configurable min/max zoom)
* Locking (locks drag direction based on initial movement)
* Pull-to-Refresh (Pull top out of the boundaries to start refresh of list)
* Configurable regarding whether animation should be used.

Options
-------

These are the available options with their defaults. Options can be modified using the second constructor parameter or during runtime by modification of `scrollerObj.options.optionName`.

* scrollingX = `true`
* scrollingY = `true`
* animating = `true`
* animationDuration = `250`
* bouncing = `true`
* locking = `true`
* paging = `false`
* snapping = `false`
* zooming = `false`
* minZoom = `0.5`
* maxZoom = `3`

Installation
------------

**Modern (npm):**
```bash
npm install scroller
```

**CDN (vanilla JS):**
```html
<!-- Full bundle (recommended) -->
<script src="https://unpkg.com/scroller/dist/scroller-full.min.js"></script>

<!-- Core only -->
<script src="https://unpkg.com/scroller/dist/scroller.min.js"></script>
```

Usage
-----

**ES6 Modules:**
```js
import { Scroller } from 'scroller';
```

**CommonJS:**
```js
const { Scroller } = require('scroller');
```

**Vanilla JS:**
```js
// Available as global Scroller after loading script
```

Callback (first parameter of constructor) is required. Options are optional. Defaults are listed above. The created instance must have proper dimensions using a `setDimensions()` call. Afterwards you can pass in event data or manually control scrolling/zooming via the API.

```js
var scrollerObj = new Scroller(function(left, top, zoom) {
	// apply coordinates/zooming
}, {
	scrollingY: false
});

// Configure to have an outer dimension of 1000px and inner dimension of 3000px
scrollerObj.setDimensions(1000, 1000, 3000, 3000);
```

**EasyScroller (Simplified API):**

EasyScroller provides a simplified, DOM-focused API that automatically handles scrolling and zooming for elements with data attributes.

**Auto-initialization:**
EasyScroller automatically initializes on elements with `data-scrollable` or `data-zoomable` attributes when the DOM is ready.

```html
<!-- Auto-initialized scrollable container -->
<div data-scrollable="y">
  <div>Your content here</div>
</div>

<!-- Auto-initialized zoomable container -->
<div data-zoomable="true">
  <div>Your zoomable content here</div>
</div>
```

**Manual initialization:**
```js
// ES6 Modules
import { EasyScroller } from 'scroller';

// Vanilla JS (full bundle only)
const easyScroller = new Scroller.EasyScroller(containerElement, options);

// Basic usage
const container = document.getElementById('my-container');
const easyScroller = new EasyScroller(container, {
  scrollingX: true,
  scrollingY: true,
  zooming: true
});
```

**DOM Structure Requirements:**
EasyScroller requires a specific DOM structure where the container element (with data attributes or passed to constructor) contains exactly one child element that holds the actual content:

```html
<div data-scrollable="true">  <!-- Container -->
  <div>                       <!-- Content wrapper (required) -->
    <!-- Your actual content here -->
  </div>
</div>
```

**Data Attribute Options:**
- `data-scrollable="true"` - Enable scrolling on both axes
- `data-scrollable="x"` - Enable horizontal scrolling only  
- `data-scrollable="y"` - Enable vertical scrolling only
- `data-zoomable="true"` - Enable zooming with default range (0.5x to 3x)
- `data-zoomable="min-max"` - Enable zooming with custom range (e.g., "0.5-2")

**EasyScroller API:**
```js
// Scroll to position
easyScroller.scrollTo(left, top, animate);

// Zoom to level
easyScroller.zoomTo(level, animate, originLeft, originTop);

// Get current values
const values = easyScroller.getValues(); // { left, top, zoom }

// Clean up
easyScroller.destroy();
```

Public API
----------

* Setup scroll object dimensions.  
  `scrollerObj.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);`
* Setup scroll object position (in relation to the document). Required for zooming to event position (mousewheel, touchmove).  
  `scrollerObj.setPosition(clientLeft, clientTop);`
* Setup snap dimensions (only needed when `snapping` is enabled)  
  `scrollerObj.setSnapSize(width, height);`
* Setup pull-to-refresh. Height of the info region plus three callbacks which are executed on the different stages.  
  `scrollerObj.activatePullToRefresh(height, activate, deactivate, start);`
* Stop pull-to-refresh session. Called inside the logic started by start callback for activatePullToRefresh call.  
  `scrollerObj.finishPullToRefresh();`
* Get current scroll positions and zooming.  
  `scrollerObj.getValues() => { left, top, zoom }`
* Zoom to a specific level. Origin defines the pixel position where zooming should centering to. Defaults to center of scrollerObj.  
  `scrollerObj.zoomTo(level, animate ? false, originLeft ? center, originTop ? center)`
* Zoom by a given amount. Same as `zoomTo` but by a relative value.  
  `scrollerObj.zoomBy(factor, animate ? false, originLeft ? center, originTop ? center);`
* Scroll to a specific position.  
  `scrollerObj.scrollTo(left, top, animate ? false);`
* Scroll by the given amount.  
  `scrollerObj.scrollBy(leftOffset, topOffset, animate ? false);`

Event API
---------

This API part can be used to pass event data to the `scrollerObj` to react on user actions. 

* `doMouseZoom(wheelDelta, timeStamp, pageX, pageY)`
* `doTouchStart(touches, timeStamp)`
* `doTouchMove(touches, timeStamp, scale)`
* `doTouchEnd(timeStamp)`

For a touch device just pass the native `touches` event data to the doTouch* methods. On mouse systems one can emulate this data using an array with just one element:

* Touch device: `doTouchMove(e.touches, e.timeStamp);`
* Mouse device: `doTouchMove([e], e.timeStamp);`

To zoom using the `mousewheel` event just pass the data like this:

* `doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);`

For more information about this please take a look at the demos.
