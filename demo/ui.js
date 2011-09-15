// Settings
var contentWidth = 2000;
var contentHeight = 2000;
var cellWidth = 100;
var cellHeight = 100;

// Intialize layout
var container = document.getElementById("container");
var content = document.getElementById("content");
var clientWidth = 0;
var clientHeight = 0;

// Initialize Scroller
this.scroller = new zynga.Scroller(function(left, top, zoom) {
	render(left, top, zoom);

	document.getElementById("scrollLeft").value = left.toFixed(2);
	document.getElementById("scrollTop").value = top.toFixed(2);
	document.getElementById("zoomLevel").value = zoom.toFixed(2);
}, {
	zooming: true
});

scroller.initElement(container);

var rect = container.getBoundingClientRect();
scroller.setPosition(rect.left + container.clientLeft, rect.top + container.clientTop);


// Reflow handling
var reflow = function() {
	clientWidth = container.clientWidth;
	clientHeight = container.clientHeight;
	scroller.setDimensions(clientWidth, clientHeight, contentWidth, contentHeight);
};

window.addEventListener("resize", reflow, false);
reflow();

$("#settings input[type=checkbox]").bind("change", function() {
	scroller.set(this.id, this.checked);
});

$("#settings #zoom").bind("click", function() {
	scroller.zoomTo(parseFloat(document.getElementById("zoomLevel").value));
});

$("#settings #zoomIn").bind("click", function() {
	scroller.zoomBy(1.2, true);
});

$("#settings #zoomOut").bind("click", function() {
	scroller.zoomBy(0.8, true);
});

$("#settings #scrollTo").bind("click", function() {
	scroller.scrollTo(parseFloat(document.getElementById("scrollLeft").value), parseFloat(document.getElementById("scrollTop").value), true);
});

$("#settings #scrollByUp").bind("click", function() {
	scroller.scrollBy(0, -150, true);
});

$("#settings #scrollByRight").bind("click", function() {
	scroller.scrollBy(150, 0, true);
});

$("#settings #scrollByDown").bind("click", function() {
	scroller.scrollBy(0, 150, true);
});

$("#settings #scrollByLeft").bind("click", function() {
	scroller.scrollBy(-150, 0, true);
});


if ('ontouchstart' in window) {

	container.addEventListener("touchstart", function(e) {
		var target = e.target;

		scroller.doTouchStart(e.touches, e.timeStamp);
		e.preventDefault();
	}, false);

	document.addEventListener("touchmove", function(e) {
		scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
	}, false);

	document.addEventListener("touchend", function(e) {
		scroller.doTouchEnd(e.touches, e.timeStamp, e.scale);
	}, false);

	document.addEventListener("touchcancel", function(e) {
		scroller.doTouchEnd(e.touches, e.timeStamp, e.scale);
	}, false);

} else {

	var mousedown = false;

	container.addEventListener("mousedown", function(e) {
		scroller.doTouchStart([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);

		mousedown = true;
	}, false);

	document.addEventListener("mousemove", function(e) {
		if (!mousedown) {
			return;
		}

		scroller.doTouchMove([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);

		mousedown = true;
	}, false);

	document.addEventListener("mouseup", function(e) {
		if (!mousedown) {
			return;
		}

		scroller.doTouchEnd([{
			pageX: e.pageX,
			pageY: e.pageY
		}], e.timeStamp);

		mousedown = false;
	}, false);

	container.addEventListener("mousewheel", function(e) {
		scroller.doMouseZoom(e.wheelDelta, e.timeStamp, e.pageX, e.pageY);
	}, false);

}