/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */
(function(global) {
	
	var time = Date.now || function() { 
		return +new Date(); 
	};
	
	var desiredFrames = 60;
	var millisecondsPerSecond = 1000;
	
	// Polyfill missing requestAnimationFrame
	
	if (global.requestAnimationFrame) {

		// pass
		
	} else {
		
		// requestAnimationFrame polyfill
		// http://webstuff.nfshost.com/anim-timing/Overview.html

		var postfix = "RequestAnimationFrame";
		var prefix = (function() {
			var all = "webkit,moz,o,ms".split(",");
			for (var i=0; i<4; i++) {
				if (global[all[i]+postfix] != null) {
					return all[i];
				}
			}
		})();
		
		if (prefix) {

			// Vendor specific implementation
			global.requestAnimationFrame = global[prefix+postfix];
			global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];

		} else {

			// Custom implementation
			var requests = {};
			var rafHandle = 1;
			var timeoutHandle = null;

			global.requestAnimationFrame = function(callback, root) 
			{
				var callbackHandle = rafHandle++;

				// Store callback
				requests[callbackHandle] = callback;

				// Create timeout at first request
				if (timeoutHandle === null) {

					timeoutHandle = setTimeout(function() {

						var now = time();
						var currentRequests = requests;

						var keys = [];
						for (var key in currentRequests) {
							keys.push(key);
						}

						// Reset data structure before executing callbacks
						requests = {};
						timeoutHandle = null;

						// Process all callbacks
						for (var i=0, l=keys.length; i<l; i++) {
							currentRequests[keys[i]](now);
						}

					}, millisecondsPerSecond / desiredFrames);

				}

				return callbackHandle;
			};

			global.cancelRequestAnimationFrame = function(handle) {
				delete requests[handle];

				// Stop timeout if all where removed
				for (var key in requests) {
					return;
				}

				clearTimeout(timeoutHandle);
				timeoutHandle = null;
			};
		}
	}


	var running = {};
	var counter = 1;

	if (!window.zynga) {
		zynga = {};
	}


	/**
	 * Generic animation class with support for dropped frames both optional easing and duration.
	 *
	 * Optional duration is useful when the lifetime is defined by another condition than time
	 * e.g. speed of an animating object, etc.
	 *
	 * Dropped frame logic allows to keep using the same updater logic independent from the actual
	 * rendering. This eases a lot of cases where it might be pretty complex to figure out the state
	 * on the pure time difference.
	 */
	zynga.Animate = {

		/**
		 * Stops the given animation.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation was stopped (aka, was running before)
		 */
		stop: function(id) {
			var cleared = running[id] != null;
			if (cleared) {
				running[id] = null;
			}

			return cleared;
		},


		/**
		 * Whether the given animation is still running.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation is still running
		 */
		isRunning: function(id) {
			return running[id] != null;
		},


		/**
		 * Start the animation.
		 *
		 * @param stepCallback {Function} Pointer to function which is executed on every step.
		 *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
		 * @param verifyCallback {Function} Executed before every animation step.
		 *   Signature of the method should be `function() { return continueWithAnimation; }`
		 * @param completedCallback {Function}
		 *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
		 * @param duration {Integer} Milliseconds to run the animation
		 * @param easingMethod {Function} Pointer to easing function
		 *   Signature of the method should be `function(percent) { return modifiedValue; }`
		 * @param root {Element ? document.body} Render root, when available. Used for internal
		 *   usage of requestAnimationFrame.
		 * @return {Integer} Identifier of animation. Can be used to stop it any time.
		 */
		start: function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {

			var start = time();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in running) {
					newRunning[usedId] = true;
				}
				running = newRunning;
			}

			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {

				// Normalize virtual value
				var render = virtual !== true;

				// Get current time
				var now = time();

				// Verification is executed before next animation step
				if (!running[id] || (verifyCallback && !verifyCallback(id))) {

					running[id] = null;
					completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
					return;

				}

				// For the current rendering to apply let's update omitted steps in memory.
				// This is important to bring internal state variables up-to-date with progress in time.
				if (render) {

					var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
					for (var j = 0; j < droppedFrames; j++) {
						step(true);
						dropCounter++;
					}

				}

				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}

				// Execute step callback, then...
				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					running[id] = null;
					completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration == null);
				} else if (render) {
					lastFrame = now;
					requestAnimationFrame(step, root);
				}
			};

			// Mark as running
			running[id] = true;

			// Init first step
			requestAnimationFrame(step, root);

			// Return unique animation ID
			return id;
		}
	};
})(this);

