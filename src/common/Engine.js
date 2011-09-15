/* 
==================================================================================================
  
	Copyright Zynga Inc

--------------------------------------------------------------------------------------------------

	Based on the work of:
	Jasy JavaScript Tooling Framework (http://github.com/wpbasti/jasy)
	License: MIT + Apache (V2)

==================================================================================================
*/

if (!window.zynga) {
	zynga = {};
}

if (!zynga.common) {
	zynga.common = {};
}

/**
 * Basic engine detection. Useful for vendor extensions etc. Do not rely on user agent string.
 */
zynga.common.Engine = {
	
	NAME : (function(global) {

		var engine;
		var doc = global.document;
		var docStyle = doc.documentElement.style;

		if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
			engine = 'presto';
		} else if ('MozAppearance' in docStyle) {
			engine = 'gecko';
		} else if ('WebkitAppearance' in docStyle) {
			engine = 'webkit';
		} else if (typeof navigator.cpuClass === 'string') {
			engine = 'trident';
		}

		return engine;

	}(this))
	
};
