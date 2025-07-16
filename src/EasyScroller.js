import { Scroller } from "./Scroller.js";

var EasyScroller = function (container, options) {
	this.container = container;
	this.content = container.firstElementChild;
	this.options = options || {};
	this.scroller = new Scroller((left, top, zoom) => {
		this.render(left, top, zoom);
	}, options);

	// bind events
	this.bindEvents();

	// the content element needs a correct transform origin for zooming
	if (this.content && this.content.style) {
		this.content.style[`${EasyScroller.vendorPrefix}TransformOrigin`] = "left top";
	}

	// reflow for the first time
	this.reflow();
};

EasyScroller.prototype.render = (() => {
	var docStyle = document.documentElement.style;

	var engine;
	if (window.opera && Object.prototype.toString.call(opera) === "[object Opera]") {
		engine = "presto";
	} else if ("MozAppearance" in docStyle) {
		engine = "gecko";
	} else if ("WebkitAppearance" in docStyle) {
		engine = "webkit";
	} else if (typeof navigator.cpuClass === "string") {
		engine = "trident";
	}

	EasyScroller.vendorPrefix = {
		trident: "ms",
		gecko: "Moz",
		webkit: "Webkit",
		presto: "O",
	}[engine];
	var vendorPrefix = EasyScroller.vendorPrefix;

	var helperElem = document.createElement("div");
	var undef;

	var perspectiveProperty = `${vendorPrefix}Perspective`;
	var transformProperty = `${vendorPrefix}Transform`;

	if (helperElem.style[perspectiveProperty] !== undef) {
		return function (left, top, zoom) {
			if (this.content && this.content.style) {
				this.content.style[transformProperty] = `translate3d(${-left}px,${-top}px,0) scale(${zoom})`;
			}
		};
	}
	if (helperElem.style[transformProperty] !== undef) {
		return function (left, top, zoom) {
			if (this.content && this.content.style) {
				this.content.style[transformProperty] = `translate(${-left}px,${-top}px) scale(${zoom})`;
			}
		};
	}
	// Fallback for testing environments - use standard transform
	if (helperElem.style.transform !== undef) {
		return function (left, top, zoom) {
			if (this.content && this.content.style) {
				this.content.style.transform = `translate3d(${-left}px,${-top}px,0) scale(${zoom})`;
			}
		};
	}
	return function (left, top, zoom) {
		this.content.style.marginLeft = left ? `${-left / zoom}px` : "";
		this.content.style.marginTop = top ? `${-top / zoom}px` : "";
		this.content.style.zoom = zoom || "";
	};
})();

EasyScroller.prototype.reflow = function () {
	// Validate that we have proper DOM elements
	if (!this.container || !this.content) {
		return; // Cannot reflow without proper DOM elements
	}

	// set the right scroller dimensions
	this.scroller.setDimensions(
		this.container.clientWidth,
		this.container.clientHeight,
		this.content.offsetWidth,
		this.content.offsetHeight
	);

	// refresh the position for zooming purposes
	var rect = this.container.getBoundingClientRect();
	var scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
	var scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
	this.scroller.setPosition(
		rect.left + this.container.clientLeft + scrollX, 
		rect.top + this.container.clientTop + scrollY
	);
};

// Delegate methods to internal scroller
EasyScroller.prototype.scrollTo = function (left, top, animate, zoom) {
	return this.scroller.scrollTo(left, top, animate, zoom);
};

EasyScroller.prototype.zoomTo = function (level, animate, originLeft, originTop, callback) {
	return this.scroller.zoomTo(level, animate, originLeft, originTop, callback);
};

EasyScroller.prototype.getValues = function () {
	return this.scroller.getValues();
};

EasyScroller.prototype.destroy = function () {
	// Remove event listeners if container has removeEventListener
	if (this.container && typeof this.container.removeEventListener === 'function') {
		// Remove touch events
		this.container.removeEventListener("touchstart", this._touchStartHandler);
		this.container.removeEventListener("touchmove", this._touchMoveHandler);
		this.container.removeEventListener("touchend", this._touchEndHandler);
		this.container.removeEventListener("touchcancel", this._touchCancelHandler);
		
		// Remove mouse events
		this.container.removeEventListener("mousedown", this._mouseDownHandler);
		this.container.removeEventListener("mousemove", this._mouseMoveHandler);
		this.container.removeEventListener("mouseup", this._mouseUpHandler);
		this.container.removeEventListener("wheel", this._wheelHandler);
	}
	
	// Remove window resize listener
	if (typeof window !== 'undefined' && window.removeEventListener) {
		window.removeEventListener("resize", this._resizeHandler);
	}
	
	// Clear references
	this.container = null;
	this.content = null;
	this.scroller = null;
};

EasyScroller.prototype.cleanup = function () {
	return this.destroy();
};

EasyScroller.prototype.bindEvents = function () {
	var mousedown = false;

	// Check if container has addEventListener method
	if (!this.container || typeof this.container.addEventListener !== 'function') {
		return;
	}

	// reflow handling
	this._resizeHandler = () => {
		this.reflow();
	};
	window.addEventListener("resize", this._resizeHandler, false);

	// touch devices bind touch events
	if ("ontouchstart" in window) {
		this._touchStartHandler = (e) => {
			// Don't react if initial down happens on a form element
			if (e.touches[0]?.target?.tagName.match(/input|textarea|select/i)) {
				return;
			}

			// reflow since the container may have changed
			this.reflow();

			this.scroller.doTouchStart(e.touches, e.timeStamp);
		};

		this._touchMoveHandler = (e) => {
			e.preventDefault();
			this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
		};

		this._touchEndHandler = (e) => {
			this.scroller.doTouchEnd(e.timeStamp);
		};

		this._touchCancelHandler = (e) => {
			this.scroller.doTouchEnd(e.timeStamp);
		};

		this.container.addEventListener("touchstart", this._touchStartHandler, false);
		this.container.addEventListener("touchmove", this._touchMoveHandler, false);
		this.container.addEventListener("touchend", this._touchEndHandler, false);
		this.container.addEventListener("touchcancel", this._touchCancelHandler, false);

		// non-touch bind mouse events
	} else {
		this._mouseDownHandler = (e) => {
			if (e.target.tagName.match(/input|textarea|select/i)) {
				return;
			}

			this.scroller.doTouchStart(
				[
					{
						pageX: e.pageX,
						pageY: e.pageY,
					},
				],
				e.timeStamp
			);

			mousedown = true;

			// reflow since the container may have changed
			this.reflow();

			e.preventDefault();
		};

		this._mouseMoveHandler = (e) => {
			if (!mousedown) {
				return;
			}

			this.scroller.doTouchMove(
				[
					{
						pageX: e.pageX,
						pageY: e.pageY,
					},
				],
				e.timeStamp
			);

			mousedown = true;
		};

		this._mouseUpHandler = (e) => {
			if (!mousedown) {
				return;
			}

			this.scroller.doTouchEnd(e.timeStamp);

			mousedown = false;
		};

		this._wheelHandler = (e) => {
			if (this.options.zooming) {
				this.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
				e.preventDefault();
			}
		};

		this.container.addEventListener("mousedown", this._mouseDownHandler, false);
		document.addEventListener("mousemove", this._mouseMoveHandler, false);
		document.addEventListener("mouseup", this._mouseUpHandler, false);
		this.container.addEventListener("mousewheel", this._wheelHandler, false);
	}
};

// Auto-initialization function for elements with data attributes
EasyScroller.autoInit = function() {
	var elements = document.querySelectorAll("[data-scrollable],[data-zoomable]");
	var element;
	var i;
	var scrollable;
	var zoomable;
	var zoomOptions;
	var minZoom;
	var maxZoom;

	for (i = 0; i < elements.length; i++) {
		element = elements[i];
		scrollable = element.attributes.getNamedItem("data-scrollable")
			? element.attributes.getNamedItem("data-scrollable").value
			: null;
		zoomable = element.attributes.getNamedItem("data-zoomable")
			? element.attributes.getNamedItem("data-zoomable").value
			: "";
		zoomOptions = zoomable.split("-");
		minZoom = zoomOptions.length > 1 ? Number.parseFloat(zoomOptions[0]) : undefined;
		maxZoom = zoomOptions.length > 1 ? Number.parseFloat(zoomOptions[1]) : undefined;

		// Create options object, only including zoom limits if they were explicitly provided
		var options = {
			scrollingX: scrollable === "true" || scrollable === "x",
			scrollingY: scrollable === "true" || scrollable === "y",
			zooming: zoomable === "true" || zoomOptions.length > 1,
		};
		
		// Only set zoom limits if they were explicitly provided and are valid numbers
		if (minZoom !== undefined && !isNaN(minZoom)) {
			options.minZoom = minZoom;
		}
		if (maxZoom !== undefined && !isNaN(maxZoom)) {
			options.maxZoom = maxZoom;
		}

		new (typeof EasyScroller !== "undefined" ? EasyScroller : Scroller.EasyScroller)(element, options);
	}
};

// automatically attach an EasyScroller to elements found with the right data attributes
export { EasyScroller };

document.addEventListener("DOMContentLoaded", EasyScroller.autoInit, false);
