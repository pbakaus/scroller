test("Initialization", function() {
	var scroller1 = new Scroller();
	equal(typeof scroller1, "object");

	var scroller2 = new Scroller(function(left, top, zoom) {});
	equal(typeof scroller2, "object");

	var scroller3 = new Scroller(null, {
		scrollingY: false
	});
	equal(typeof scroller3, "object");

	var scroller4 = new Scroller(function(left, top, zoom) {}, {
		scrollingY: false
	});
	equal(typeof scroller4, "object");
});

test("Setting up dimensions", function() {

	var scroller = new Scroller();
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);

});

test("Query values", function() {

	var scroller = new Scroller();
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 1);

});

test("Scroll", function() {

	var scroller = new Scroller();
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 500);

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 300);
	equal(values.top, 500);
	equal(values.zoom, 1);

});

test("Zoom", function() {

	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2.45);

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.zoom, 2.45);

});

test("Zoom + Scroll", function() {

	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(1.7);
	scroller.scrollTo(300, 500);

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 300);
	equal(values.top, 500);
	equal(values.zoom, 1.7);

});

test("Scroll + Zoom", function() {

	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 500);
	scroller.zoomTo(1.7, false, 0, 0); // origin is top/left corner

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left / 1.7, 300);
	equal(values.top / 1.7, 500);
	equal(values.zoom, 1.7);

});

test("Scroll + Zoom (Auto Origin)", function() {

	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 500);
	scroller.zoomTo(1.7);
	
	var originLeft = 1000 / 2;
	var originTop = 600 / 2;

	// Compute center zooming
	var newLeft = ((originLeft + 300) * 1.7 / 1) - originLeft;
	var newTop = ((originTop + 500) * 1.7 / 1) - originTop;

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, newLeft);
	equal(values.top, newTop);
	equal(values.zoom, 1.7);

});

test("Scroll + Zoom + Scroll", function() {

	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 500);
	scroller.zoomTo(1.7);
	scroller.scrollTo(500, 700);
	
	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 500);
	equal(values.top, 700);
	equal(values.zoom, 1.7);

});

test("Snapping", function() {
	
	var scroller = new Scroller(null, {
		snapping: true
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.setSnapSize(50, 100);
	
	scroller.scrollTo(200, 400);
	var values = scroller.getValues();
	equal(values.left, 200);
	equal(values.top, 400);

	scroller.scrollTo(237, 124);
	var values = scroller.getValues();
	equal(values.left, 250);
	equal(values.top, 100);
	
});

test("Paging", function() {
	
	var scroller = new Scroller(null, {
		paging: true
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	
	scroller.scrollTo(1000, 600);
	var values = scroller.getValues();
	equal(values.left, 1000);
	equal(values.top, 600);

	scroller.scrollTo(1400, 1100);
	var values = scroller.getValues();
	equal(values.left, 1000);
	equal(values.top, 1200);
	
});

test("ZoomBy", function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	
	scroller.zoomBy(1.5);
	var values = scroller.getValues();
	equal(values.zoom, 1.5);

	scroller.zoomBy(1.2);
	var values = scroller.getValues();
	equal(values.zoom, 1.5 * 1.2);
	
});

test("ScrollBy", function() {
	
	var scroller = new Scroller();
	scroller.setDimensions(1000, 600, 5000, 5000);
	
	scroller.scrollBy(200, 300);
	var values = scroller.getValues();
	equal(values.left, 200);
	equal(values.top, 300);
	
	scroller.scrollBy(300, 400);
	var values = scroller.getValues();
	equal(values.left, 500);
	equal(values.top, 700);
	
});

test("Out Of Boundaries", function() {
	
	var scroller = new Scroller();

	// Scroll without dimensions
	scroller.scrollTo(200, 300);
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	
	// Setup
	scroller.setDimensions(1000, 600, 5000, 5000);
	
	// Scroll out of max
	scroller.scrollTo(10000, 10000);
	var values = scroller.getValues();
	equal(values.left, 4000);
	equal(values.top, 4400);

	// Scroll out of min
	scroller.scrollTo(-30, -100);
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	
});


test("Scroll Axis Limited", function() {
	
	var scroller = new Scroller(null, {
		scrollingX: false
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400);
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 400);
	
	var scroller = new Scroller(null, {
		scrollingY: false
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400);
	var values = scroller.getValues();
	equal(values.left, 300);
	equal(values.top, 0);	
	
});

test("Zoom Limits", function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);

	scroller.zoomTo(2);
	var values = scroller.getValues();
	equal(values.zoom, 2);

	scroller.zoomTo(20);
	var values = scroller.getValues();
	equal(values.zoom, 3);

	scroller.zoomTo(0.1);
	var values = scroller.getValues();
	equal(values.zoom, 0.5);
	
});

asyncTest("Scroll Animated", 3, function() {
	
	var left, top;
	var scroller = new Scroller(function(l, t, z) {
		left = l;
		top = t;
	});
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	equal(typeof scroller, "object");
	window.setTimeout(function() {
		equal(left, 300);
		equal(top, 400);
		start();
	}, 500);
	
})




