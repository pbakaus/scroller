/* 
==================================================================================================
  
	Copyright Zynga Inc

--------------------------------------------------------------------------------------------------

	Based on the work of:
	Jasy JavaScript Tooling Framework (http://github.com/wpbasti/jasy)
	License: MIT + Apache (V2)

	Inspired by: 
	https://github.com/inexorabletash/raf-shim/blob/master/raf.js

==================================================================================================
*/

(function(global) 
{
	if(global.requestAnimationFrame) {
		return;
	}
	
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
	
	// Vendor specific implementation
	if (prefix) {
		global.requestAnimationFrame = global[prefix+postfix];
		global.cancelRequestAnimationFrame = global[prefix+"Cancel"+postfix];
		
		return;
	}
	
	// Polyfill Date.now()
	var DateNow = Date.now || function() { 
		return +new Date(); 
	};
	
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
		if (timeoutHandle === null) {
			
			timeoutHandle = setTimeout(function() {
				
				var now = DateNow();
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
				
			}, 1000 / TARGET_FPS);
			
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

})(this);