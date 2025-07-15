import { Scroller } from "./Scroller.js";

var EasyScroller = function (content, options) {
	this.content = content;
	this.container = content.parentNode;
	this.options = options || {};
	this.scroller = new Scroller((left, top, zoom) => {
		this.render(left, top, zoom);
	}, options);

	// bind events
	this.bindEvents();

	// the content element needs a correct transform origin for zooming
	this.content.style[`${EasyScroller.vendorPrefix}TransformOrigin`] = "left top";

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
			this.content.style[transformProperty] = `translate3d(${-left}px,${-top}px,0) scale(${zoom})`;
		};
	}
	if (helperElem.style[transformProperty] !== undef) {
		return function (left, top, zoom) {
			this.content.style[transformProperty] = `translate(${-left}px,${-top}px) scale(${zoom})`;
		};
	}
	return function (left, top, zoom) {
		this.content.style.marginLeft = left ? `${-left / zoom}px` : "";
		this.content.style.marginTop = top ? `${-top / zoom}px` : "";
		this.content.style.zoom = zoom || "";
	};
})();

EasyScroller.prototype.reflow = function () {
	// set the right scroller dimensions
	this.scroller.setDimensions(
		this.container.clientWidth,
		this.container.clientHeight,
		this.content.offsetWidth,
		this.content.offsetHeight
	);

	// refresh the position for zooming purposes
	var rect = this.container.getBoundingClientRect();
	this.scroller.setPosition(rect.left + this.container.clientLeft, rect.top + this.container.clientTop);
};

EasyScroller.prototype.bindEvents = function () {
	var mousedown = false;

	// reflow handling
	window.addEventListener(
		"resize",
		() => {
			this.reflow();
		},
		false
	);

	// touch devices bind touch events
	if ("ontouchstart" in window) {
		this.container.addEventListener(
			"touchstart",
			(e) => {
				// Don't react if initial down happens on a form element
				if (e.touches[0]?.target?.tagName.match(/input|textarea|select/i)) {
					return;
				}

				// reflow since the container may have changed
				this.reflow();

				this.scroller.doTouchStart(e.touches, e.timeStamp);
			},
			false
		);

		this.container.addEventListener(
			"touchmove",
			(e) => {
				e.preventDefault();
				this.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
			},
			false
		);

		this.container.addEventListener(
			"touchend",
			(e) => {
				this.scroller.doTouchEnd(e.timeStamp);
			},
			false
		);

		this.container.addEventListener(
			"touchcancel",
			(e) => {
				this.scroller.doTouchEnd(e.timeStamp);
			},
			false
		);

		// non-touch bind mouse events
	} else {
		this.container.addEventListener(
			"mousedown",
			(e) => {
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
			},
			false
		);

		document.addEventListener(
			"mousemove",
			(e) => {
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
			},
			false
		);

		document.addEventListener(
			"mouseup",
			(e) => {
				if (!mousedown) {
					return;
				}

				this.scroller.doTouchEnd(e.timeStamp);

				mousedown = false;
			},
			false
		);

		this.container.addEventListener(
			"mousewheel",
			(e) => {
				if (this.options.zooming) {
					this.scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
					e.preventDefault();
				}
			},
			false
		);
	}
};

// automatically attach an EasyScroller to elements found with the right data attributes
export { EasyScroller };

document.addEventListener(
	"DOMContentLoaded",
	() => {
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
			minZoom = zoomOptions.length > 1 && Number.parseFloat(zoomOptions[0]);
			maxZoom = zoomOptions.length > 1 && Number.parseFloat(zoomOptions[1]);

			new (typeof EasyScroller !== "undefined" ? EasyScroller : Scroller.EasyScroller)(element, {
				scrollingX: scrollable === "true" || scrollable === "x",
				scrollingY: scrollable === "true" || scrollable === "y",
				zooming: zoomable === "true" || zoomOptions.length > 1,
				minZoom: minZoom,
				maxZoom: maxZoom,
			});
		}
	},
	false
);
