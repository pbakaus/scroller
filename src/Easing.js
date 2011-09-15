/* 
==================================================================================================

	Copyright Zynga Inc

--------------------------------------------------------------------------------------------------

	Based on the work of:
	Easing Equations (c) 2003 Robert Penner, all rights reserved.
	Open source under the BSD License.

==================================================================================================
*/

if (!global.zynga) {
	zynga = {};
}

zynga.Easing = {

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInQuad: function(pos) {
		return Math.pow(pos, 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutQuad: function(pos) {
		return -(Math.pow((pos - 1), 2) - 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutQuad: function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 2);
		}

		return -0.5 * ((pos -= 2) * pos - 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInCubic: function(pos) {
		return Math.pow(pos, 3);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutCubic: function(pos) {
		return (Math.pow((pos - 1), 3) + 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutCubic: function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 3);
		}

		return 0.5 * (Math.pow((pos - 2), 3) + 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInQuart: function(pos) {
		return Math.pow(pos, 4);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutQuart: function(pos) {
		return -(Math.pow((pos - 1), 4) - 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutQuart: function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 4);
		}

		return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInQuint: function(pos) {
		return Math.pow(pos, 5);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutQuint: function(pos) {
		return (Math.pow((pos - 1), 5) + 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutQuint: function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 5);
		}

		return 0.5 * (Math.pow((pos - 2), 5) + 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInSine: function(pos) {
		return -Math.cos(pos * (Math.PI / 2)) + 1;
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutSine: function(pos) {
		return Math.sin(pos * (Math.PI / 2));
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutSine: function(pos) {
		return (-0.5 * (Math.cos(Math.PI * pos) - 1));
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInExpo: function(pos) {
		return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutExpo: function(pos) {
		return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutExpo: function(pos) {
		if (pos === 0) {
			return 0;
		}

		if (pos === 1) {
			return 1;
		}

		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(2, 10 * (pos - 1));
		}

		return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInCirc: function(pos) {
		return -(Math.sqrt(1 - (pos * pos)) - 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutCirc: function(pos) {
		return Math.sqrt(1 - Math.pow((pos - 1), 2));
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutCirc: function(pos) {
		if ((pos /= 0.5) < 1) {
			return -0.5 * (Math.sqrt(1 - pos * pos) - 1);
		}

		return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutBounce: function(pos) {
		if ((pos) < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
		} else if (pos < (2.5 / 2.75)) {
			return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
		} else {
			return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
		}
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInBack: function(pos) {
		var s = 1.70158;
		return (pos) * pos * ((s + 1) * pos - s);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeOutBack: function(pos) {
		var s = 1.70158;
		return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeInOutBack: function(pos) {
		var s = 1.70158;
		if ((pos /= 0.5) < 1) {
			return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));
		}

		return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	elastic: function(pos) {
		return -1 * Math.pow(4, - 8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	swingFromTo: function(pos) {
		var s = 1.70158;
		return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
			0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	swingFrom: function(pos) {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	swingTo: function(pos) {
		var s = 1.70158;
		return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	bounce: function(pos) {
		if (pos < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
		} else if (pos < (2.5 / 2.75)) {
			return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
		} else {
			return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
		}
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	bouncePast: function(pos) {
		if (pos < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
		} else if (pos < (2.5 / 2.75)) {
			return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
		} else {
			return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
		}
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeFromTo: function(pos) {
		if ((pos /= 0.5) < 1) {
			return 0.5 * Math.pow(pos, 4);
		}

		return -0.5 * ((pos -= 2) * Math.pow(pos, 3) - 2);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeFrom: function(pos) {
		return Math.pow(pos, 4);
	},

	/**
	 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
	**/
	easeTo: function(pos) {
		return Math.pow(pos, 0.25);
	}
};
