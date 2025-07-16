/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */

var time = Date.now || (() => +new Date());
var desiredFrames = 60;
var millisecondsPerSecond = 1000;
var running = {};
var counter = 1;

export const Animate = {
	/**
	 * A requestAnimationFrame wrapper / polyfill.
	 *
	 * @param callback {Function} The callback to be invoked before the next repaint.
	 * @param root {HTMLElement} The root element for the repaint
	 */
	requestAnimationFrame: (() => {
		// Cross-environment global reference
		var globalScope = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};

		// Check for request animation Frame support
		var requestFrame =
			globalScope.requestAnimationFrame ||
			globalScope.webkitRequestAnimationFrame ||
			globalScope.mozRequestAnimationFrame ||
			globalScope.oRequestAnimationFrame;
		var isNative = !!requestFrame;

		if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
			isNative = false;
		}

		if (isNative) {
			return (callback, root) => {
				requestFrame(callback, root);
			};
		}

		var TARGET_FPS = 60;
		var requests = {};
		var requestCount = 0;
		var rafHandle = 1;
		var intervalHandle = null;
		var lastActive = +new Date();

		return (callback, root) => {
			var callbackHandle = rafHandle++;

			// Store callback
			requests[callbackHandle] = callback;
			requestCount++;

			// Create timeout at first request
			if (intervalHandle === null) {
				intervalHandle = setInterval(() => {
					var time = +new Date();
					var currentRequests = requests;

					// Reset data structure before executing callbacks
					requests = {};
					requestCount = 0;

					for (var key in currentRequests) {
						if (Object.hasOwn(currentRequests, key)) {
							currentRequests[key](time);
							lastActive = time;
						}
					}

					// Disable the timeout when nothing happens for a certain
					// period of time
					if (time - lastActive > 2500) {
						clearInterval(intervalHandle);
						intervalHandle = null;
					}
				}, 1000 / TARGET_FPS);
			}

			return callbackHandle;
		};
	})(),

	/**
	 * Stops the given animation.
	 *
	 * @param id {Integer} Unique animation ID
	 * @return {Boolean} Whether the animation was stopped (aka, was running before)
	 */
	stop: (id) => {
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
	isRunning: (id) => running[id] != null,

	/**
	 * Start the animation.
	 *
	 * @param stepCallback {Function} Pointer to function which is executed on every step.
	 *   This is called with the signature: `function(percent, now, virtual) { return continueWithAnimation; }`
	 * @param verifyCallback {Function} Executed before every animation step.
	 *   This is called with the signature: `function() { return continueWithAnimation; }`
	 * @param completedCallback {Function} Signature: `function(droppedFrames, finishedAnimation) {}`
	 * @param duration {Integer} Milliseconds to run the animation
	 * @param easingMethod {Function} Pointer to easing function
	 *   Signature: `function(percent) { return modifiedValue; }`
	 * @param root {Element ? document.body} Render root, when available. Used for internal
	 *   usage of requestAnimationFrame.
	 * @return {Integer} Identifier of animation. Can be used to stop it any time.
	 */
	start: (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) => {
		var start = time();
		var lastFrame = start;
		var percent = 0;
		var dropCounter = 0;
		var id = counter++;
		var newRunning;
		var usedId;
		var droppedFrames;
		var j;
		var renderRoot = root || document.body;

		// Compacting running db automatically every few new animations
		if (id % 20 === 0) {
			newRunning = {};
			for (usedId in running) {
				newRunning[usedId] = true;
			}
			running = newRunning;
		}

		// This is the internal step method which is called every few milliseconds
		var step = (virtual) => {
			// Normalize virtual value
			var render = virtual !== true;

			// Get current time
			var now = time();

			// Verification is executed before next animation step
			var shouldContinue = true;
			try {
				shouldContinue = !verifyCallback || verifyCallback(id);
			} catch (error) {
				// Handle verify function errors gracefully
				shouldContinue = false;
			}
			
			if (!running[id] || !shouldContinue) {
				running[id] = null;
				completedCallback?.(desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond), id, false);
				return;
			}

			// For the current rendering to apply let's update omitted steps in memory.
			// This is important to bring internal state variables up-to-date with progress.
			if (render) {
				droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
				for (j = 0; j < Math.min(droppedFrames, 4); j++) {
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
			var stepResult = false;
			try {
				stepResult = stepCallback(value, now, render);
			} catch (error) {
				// Handle step function errors gracefully
				stepResult = false;
			}
			
			if ((stepResult === false || percent === 1) && render) {
				running[id] = null;
				completedCallback?.(
					desiredFrames - dropCounter / ((now - start) / millisecondsPerSecond),
					id,
					percent === 1 || duration == null
				);
			} else if (render) {
				lastFrame = now;
				Animate.requestAnimationFrame(step);
			}
		};

		// Mark as running
		running[id] = true;

		// Init first step
		Animate.requestAnimationFrame(step);

		// Return unique animation ID
		return id;
	},
};
