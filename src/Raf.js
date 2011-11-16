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
 * 
 * Inspired by: https://github.com/inexorabletash/raf-shim/blob/master/raf.js
 */
(function(global) 
{
	if(global.requestAnimationFrame) {
		return;
	}
	
	// Basic emulation of native methods for internal use
	
	var now = Date.now || function() {
		return +new Date;
	};
	
	var getKeys = Object.keys || function(obj) {
		
		var keys = {};
		for (var key in obj) {
			keys[key] = true;
		}
		
		return keys;
		
	};
	
	var isEmpty = Object.empty || function(obj) {
		
		for (var key in obj) {
			return false;
		}
		
		return true;
		
	};
	
	
	// requestAnimationFrame polyfill
	// http://webstuff.nfshost.com/anim-timing/Overview.html

	var postfix = "RequestAnimationFrame";
	var prefix = (function() 
	{
		var all = "webkit,moz,o,ms".split(",");
		for (var i=0; i<4; i++) {
			if (global[all[i]+postfix] != null) {
				return all[i];
			}
		}
	})();
	
	// Vendor specific implementation
	if (prefix) 
	{
		global.requestAnimationFrame = global[prefix+postfix];
		global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];
		return;
	}

	// Custom implementation
	var TARGET_FPS = 60;
	var requests = {};
	var rafHandle = 1;
	var timeoutHandle = null;

	global.requestAnimationFrame = function(callback, root) 
	{
		var callbackHandle = rafHandle++;
		
		// Store callback
		requests[callbackHandle] = callback;

		// Create timeout at first request
		if (timeoutHandle === null) 
		{
			timeoutHandle = setTimeout(function() 
			{
				var time = now();
				var currentRequests = requests;
				var keys = getKeys(currentRequests);

				// Reset data structure before executing callbacks
				requests = {};
				timeoutHandle = null;

				// Process all callbacks
				for (var i=0, l=keys.length; i<l; i++) {
					currentRequests[keys[i]](time);
				}
			}, 1000 / TARGET_FPS);
		}

		return callbackHandle;
	};

	global.cancelRequestAnimationFrame = function(handle) 
	{
		delete requests[handle];

		// Stop timeout if all where removed
		if (isEmpty(requests)) 
		{
			clearTimeout(timeoutHandle);
			timeoutHandle = null;
		}
	};

})(this);