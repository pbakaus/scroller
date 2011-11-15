/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
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
