/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 */
(function() {
	var nameCache = {};
	var helperElem = document.createElement('div');
	var helperStyle = helperElem.style;
	var undef;
	
	if (!window.zynga) {
		zynga = {};
	}
	

	if (!zynga.common) {
		zynga.common = {};
	}
	
	var vendorPrefix = {
		trident: 'ms',
		gecko: 'Moz',
		webkit: 'Webkit',
		presto: 'O'
	}[zynga.common.Engine.NAME];


	/**
	 * Generic style API for quering and modifiying style properties on 
	 * DOM elements.
	 * 
	 * Basic automatic fixing for cross browser differences through 
	 * vendor extensions is integrated (property name only).
	 */
	zynga.common.Style = {

		/** {Map} Caches CSS property names to browser specific names. Can be used as a fast lookup alternative to property(name). */
		names: nameCache,


		/**
		 * Returns the value of the given property property on the given element.
		 *
		 * Attention:
		 *
		 * In Internet Explorer there is no 100% possibility to have access to the computed value.
		 * We fallback to the only supported thing: cascaded properties. These are the actual value
		 * of the property as applied - non interpreted. This means that units are not translated
		 * to pixels etc. like which is normally the case in computed properties.
		 *
		 * @param elem {Element} DOM element to query
		 * @param name {String} Name of style property
		 * @param computed {Boolean?false} Whether the computed value should be returned
		 * @return {String} Returns the value of the given style property
		 */
		get: function(elem, name, computed) {
			// Find real name, use if supported
			var supported = name in helperStyle && name || nameCache[name] || this.property(name, true);

			// Fast-path: local styles
			if (!computed) {
				return elem.style[supported];
			}

			// Check support for computed style, fall back to cascaded styles
			// The solution is not 100% correct in IE, but as there is no 100% solution we omit the
			// whole thing here and just implement the basic fallback. Should be enough in most cases.
			var global = elem.ownerDocument.defaultView;
			if (global) {
				return global.getComputedStyle(elem, null)[supported];
			} else if (elem.currentStyle) {
				return elem.currentStyle[supported];
			}
		},


		/**
		 * Sets a new style property. If you want to modify
		 * multiple styles at once it's a lot faster to use a map
		 * as second argument.
		 *
		 * @param elem {Element} DOM element to modify
		 * @param name {String|Map} Style name or Map of styles/values to apply
		 * @param value {String} Style value
		 * @return {Module} Returns the module for further modifications
		 */
		set: function(elem, name, value) {
			var style = elem.style;
			var supported;

			if (typeof name === 'string') {

				// Find real name, apply if supported
				supported = name in helperStyle && name || nameCache[name] || this.property(name, true);
				if (supported) {
					style[supported] = value === null ? '' : value;
				}

			} else {

				for (var key in name) {

					// Find real name, apply if supported
					value = name[key];
					supported = key in helperStyle && key || nameCache[key] || this.property(key, true);
					if (supported) {
						style[supported] = value === null ? '' : value;
					}
				}

			}

			// Chaining support
			return this;
		},


		/**
		 * Detects a name of a CSS property in the current engine and returns it.
		 *
		 * @param name {String} Standard (or pre standard) name e.g. 'opacity', 'transform', ...
		 * @return {String} Vendor property name e.g. 'WebkitTransform'
		 */
		property: function(name, warn) {

			// Fast path, real native property
			if (name in helperStyle) {
				return name;
			}

			// Fixed name already cached?
			var fixedName = nameCache[name];
			if (fixedName !== undef) {
				return fixedName;
			}

			// Find vendor name
			var vendorName = vendorPrefix + name.charAt(0).toUpperCase() + name.slice(1);
			if (vendorName in helperStyle) {
				return (nameCache[name] = vendorName);
			}
		}
	};

})();

