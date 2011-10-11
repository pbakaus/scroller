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
	scroller.setDimensions(1024, 768, 5000, 5000);

});

test("Query values", function() {

	var scroller = new Scroller();
	equal(typeof scroller, "object");	
	scroller.setDimensions(1024, 768, 5000, 5000);
	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 1);

});

test("Scrolling via API", function() {

	var scroller = new Scroller();
	equal(typeof scroller, "object");	
	scroller.setDimensions(1024, 768, 5000, 5000);
	scroller.scrollTo(300, 500);

	var values = scroller.getValues();
	equal(typeof values, "object");
	equal(values.left, 300);
	equal(values.top, 500);
	equal(values.zoom, 1);

});