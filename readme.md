Event Scroller
==============

A pure logic component for scrolling/zooming. Independent of any specific kind of rendering or event system. 

The "demo" folder contains examples for usage with DOM and Canvas renderings which works both, on mouse and touch driven devices.

The component supports advanced features like:

* Customizable enabling/disabling of scrolling for x-axis and y-axis
* Deceleration (decelerates when user action ends in motion)
* Bouncing (bounces back on the edges)
* Paging (snap to full page width/height)
* Snapping (snap to an user definable pixel grid)
* Zooming (automatic centered zooming or based on a point in the view with configurable min/max zoom)
* Locking (locks drag direction based on initial movement)
* Configurable regarding whether animation should be used.

It uses our acceleration class which is based on requestAnimationFrame (or an automatic polyfill) with:
 
* Automatic dropped frame handling
* Frames per second are computed (and returned on complete event). Target frame rate is 60.
* Animations with duration or infinite animations
* Custom easing methods are supported
* Callbacks for:
  * each step (containing the current percent position)
  * completion (with reached frame rate and info about whether the animation was completed)
  * validation to continue animation (useful for endless animations)
* The animation can be cancelled by the ID returned by calling start()
