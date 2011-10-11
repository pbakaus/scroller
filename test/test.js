test("Basic Initialization", function() {
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

test("Scrolling via API", function() {

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

test("Zooming via API", function() {

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

test("Zooming + Scrolling via API", function() {

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

test("Scrolling + Zooming via API", function() {

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

test("Scrolling + Zooming via API (Auto Origin)", function() {

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

test("Scrolling + Zooming + Scrolling via API", function() {

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
