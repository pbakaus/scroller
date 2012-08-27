var EasyScroller = function(content, options) {
	
	this.content = content;
	this.container = content.parentNode;
	this.options = options || {};

	// create Scroller instance
	var that = this;
	this.scroller = new Scroller(function(left, top, zoom) {
		that.render(left, top, zoom);
	}, options);

	// bind events
	this.bindEvents();

	// the content element needs a correct transform origin for zooming
	this.content.style[EasyScroller.vendorPrefix + 'TransformOrigin'] = "left top";

	// reflow for the first time
	this.reflow();

};

EasyScroller.prototype.render = (function() {
	
	var docStyle = document.documentElement.style;
	
	var engine;
	if (window.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
		engine = 'presto';
	} else if ('MozAppearance' in docStyle) {
		engine = 'gecko';
	} else if ('WebkitAppearance' in docStyle) {
		engine = 'webkit';
	} else if (typeof navigator.cpuClass === 'string') {
		engine = 'trident';
	}
	
	var vendorPrefix = EasyScroller.vendorPrefix = {
		trident: 'ms',
		gecko: 'Moz',
		webkit: 'Webkit',
		presto: 'O'
	}[engine];
	
	var helperElem = document.createElement("div");
	var undef;
	
	var perspectiveProperty = vendorPrefix + "Perspective";
	var transformProperty = vendorPrefix + "Transform";
	
	if (helperElem.style[perspectiveProperty] !== undef) {
		
		return function(left, top, zoom) {
			this.content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
		};
		
	} else if (helperElem.style[transformProperty] !== undef) {
		
		return function(left, top, zoom) {
			this.content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
		};
		
	} else {
		
		return function(left, top, zoom) {
			this.content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
			this.content.style.marginTop = top ? (-top/zoom) + 'px' : '';
			this.content.style.zoom = zoom || '';
		};
		
	}
})();

EasyScroller.prototype.reflow = function() {

	// set the right scroller dimensions
	this.scroller.setDimensions(this.container.clientWidth, this.container.clientHeight, this.content.offsetWidth, this.content.offsetHeight);

	// refresh the position for zooming purposes
	var rect = this.container.getBoundingClientRect();
	this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
	
};

EasyScroller.prototype.bindEvents = function() {

	var that = this;
	var mousedown;

	this.__listeners = {

		resize: function() {
			that.reflow();
		},

		touchstart: function(e) {

			// Don't react if initial down happens on a form element
			if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			that.scroller.doTouchStart(e.touches, e.timeStamp);
			e.preventDefault();

		},

		touchmove: function(e) {
			that.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
		},

		touchend: function(e) {
			that.scroller.doTouchEnd(e.timeStamp);
		},

		touchcancel: function(e) {
			that.scroller.doTouchEnd(e.timeStamp);
		},

		mousedown: function(e) {

			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}
		
			that.scroller.doTouchStart([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;
			e.preventDefault();

		},

		mousemove: function(e) {

			if (!mousedown) {
				return;
			}
			
			that.scroller.doTouchMove([{
				pageX: e.pageX,
				pageY: e.pageY
			}], e.timeStamp);

			mousedown = true;

		},

		mouseup: function(e) {

			if (!mousedown) {
				return;
			}
			
			that.scroller.doTouchEnd(e.timeStamp);

			mousedown = false;

		},

		mousewheel: function(e) {
			if (that.options.zooming) {
				that.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
				e.preventDefault();
			}
		}
	};

	// reflow handling
	window.addEventListener("resize", this.__listeners.resize, false);

	// touch devices bind touch events
	if ('ontouchstart' in window) {

		this.container.addEventListener("touchstart", this.__listeners.touchstart, false);

		document.addEventListener("touchmove", this.__listeners.touchmove, false);

		document.addEventListener("touchend", this.__listeners.touchend, false);

		document.addEventListener("touchcancel", this.__listeners.touchcancel, false);

	// non-touch bind mouse events
	} else {
		
		mousedown = false;

		this.container.addEventListener("mousedown", this.__listeners.mousedown, false);

		document.addEventListener("mousemove", this.__listeners.mousemove, false);

		document.addEventListener("mouseup", this.__listeners.mouseup, false);

		this.container.addEventListener("mousewheel", this.__listeners.mousewheel, false);

	}
};

EasyScroller.prototype.unBindEvents = function() {

	// touch devices unbind touch events
	if ('ontouchstart' in window) {

		this.container.removeEventListener("touchstart", this.__listeners.touchstart, false);

		document.removeEventListener("touchmove", this.__listeners.touchmove, false);

		document.removeEventListener("touchend", this.__listeners.touchend, false);

		document.removeEventListener("touchcancel", this.__listeners.touchcancel, false);

	// non-touch unbind mouse events
	} else {

		this.container.removeEventListener("mousedown", this.__listeners.mousedown, false);

		document.removeEventListener("mousemove", this.__listeners.mousemove, false);

		document.removeEventListener("mouseup", this.__listeners.mouseup, false);

		this.container.removeEventListener("mousewheel", this.__listeners.mousewheel, false);

	}

};

// automatically attach an EasyScroller to elements found with the right data attributes
document.addEventListener("DOMContentLoaded", function() {
	
	var elements = document.querySelectorAll('[data-scrollable],[data-zoomable]'), element;
	for (var i = 0; i < elements.length; i++) {

		element = elements[i];
		var scrollable = element.dataset.scrollable;
		var zoomable = element.dataset.zoomable || '';
		var zoomOptions = zoomable.split('-');
		var minZoom = zoomOptions.length > 1 && parseFloat(zoomOptions[0]);
		var maxZoom = zoomOptions.length > 1 && parseFloat(zoomOptions[1]);

		new EasyScroller(element, {
			scrollingX: scrollable === 'true' || scrollable === 'x',
			scrollingY: scrollable === 'true' || scrollable === 'y',
			zooming: zoomable === 'true' || zoomOptions.length > 1,
			minZoom: minZoom,
			maxZoom: maxZoom
		});

	}

}, false);