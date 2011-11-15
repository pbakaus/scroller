// ========================================================================
module("Basics");
// ========================================================================

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


// ========================================================================
module("Scrolling/Zooming");
// ========================================================================

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




// ========================================================================
module("Snapping/Paging");
// ========================================================================

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




// ========================================================================
module("Scroll/Zoom Relative");
// ========================================================================

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





// ========================================================================
module("Boundaries");
// ========================================================================

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




// ========================================================================
module("Animations");
// ========================================================================

asyncTest("Scroll Animated", 4, function() {
	
	var scroller = new Scroller();
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	setTimeout(function() {
		var values = scroller.getValues();
		equal(values.left, 300);
		equal(values.top, 400);
		equal(values.zoom, 1);
		start();
	}, 400);
	
});

asyncTest("Zoom Animated", 4, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});

	equal(typeof scroller, "object");
	
	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2, true);
	
	setTimeout(function() {
		var values = scroller.getValues();
		
		// zooming is centered automatically
		equal(values.left, 500);
		equal(values.top, 300);
		equal(values.zoom, 2);
		start();
	}, 400);
	
});

asyncTest("Scroll + Zoom Animated", 8, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	
	var max = scroller.getScrollMax();
	equal(max.left, 5000-1000);
	equal(max.top, 5000-600);
	
	scroller.scrollTo(300, 400, true, 2);
	
	setTimeout(function() {
		var values = scroller.getValues();
		equal(values.left, 600);
		equal(values.top, 800);
		equal(values.zoom, 2);

		var max = scroller.getScrollMax();
		equal(max.left, (5000*2)-1000);
		equal(max.top, (5000*2)-600);

		start();
	}, 400);
	
});




// ========================================================================
module("Animation Interrupted");
// ========================================================================

asyncTest("Scroll Animated + Scroll Animated", 4, function() {
	
	var scroller = new Scroller();
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	setTimeout(function() {
		scroller.scrollTo(500, 800, true);
	}, 150);
	
	setTimeout(function() {
		var values = scroller.getValues();
		equal(values.left, 500);
		equal(values.top, 800);
		equal(values.zoom, 1);
		start();
	}, 500);
	
});

asyncTest("Scroll Animated + Zoom Animated", 6, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	setTimeout(function() {
		scroller.zoomTo(2, true);
	}, 150);
	
	setTimeout(function() {
		var values = scroller.getValues();
		
		// Scroll position can not have reached final position yet
		notEqual(values.left, 300);
		notEqual(values.top, 400);
		equal(values.zoom, 2);
		
		// Scroll max need have values based on final zoom
		var max = scroller.getScrollMax();
		equal(max.left, (5000*2)-1000);
		equal(max.top, (5000*2)-600);
				
		start();
	}, 500);
	
});

asyncTest("Zoom Animated + Zoom Animated", 2, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2, true);
	
	setTimeout(function() {
		scroller.zoomTo(3, true);
	}, 150);
	
	setTimeout(function() {
		var values = scroller.getValues();
		equal(values.zoom, 3);
		start();
	}, 500);
	
});

asyncTest("Zoom Animated +  Scroll Animated", 6, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2, true);
	
	setTimeout(function() {
		scroller.scrollTo(300, 400, true);
	}, 150);
	
	setTimeout(function() {
		var values = scroller.getValues();

		// Zoom level can not have reached final position yet
		equal(values.left, 300);
		equal(values.top, 400);
		notEqual(values.zoom, 2);
		
		// Scroll max need have values different as 
		// they must not be based of final zoom, but current zoom
		var max = scroller.getScrollMax();
		notEqual(max.left, (5000*2)-1000);
		notEqual(max.top, (5000*2)-600);
				
		start();
	}, 500);
	
});

asyncTest("Scroll Animated + Scroll Static", 4, function() {
	
	var scroller = new Scroller();
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	setTimeout(function() {
		scroller.scrollTo(500, 800);

		var values = scroller.getValues();
		equal(values.left, 500);
		equal(values.top, 800);
		equal(values.zoom, 1);
		start();
	}, 150);
	
});

asyncTest("Scroll Animated + Zoom Static", 6, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.scrollTo(300, 400, true);
	
	setTimeout(function() {
		scroller.zoomTo(2);

		var values = scroller.getValues();
		
		// Scroll position can not have reached final position yet
		notEqual(values.left, 300);
		notEqual(values.top, 400);
		equal(values.zoom, 2);
		
		// Scroll max need have values based on final zoom
		var max = scroller.getScrollMax();
		equal(max.left, (5000*2)-1000);
		equal(max.top, (5000*2)-600);
				
		start();
	}, 150);
	
});

asyncTest("Zoom Animated + Zoom Static", 2, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2, true);
	
	setTimeout(function() {
		scroller.zoomTo(3);

		var values = scroller.getValues();
		equal(values.zoom, 3);
		start();
	}, 150);
	
});

asyncTest("Zoom Animated + Scroll Static", 6, function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	equal(typeof scroller, "object");

	scroller.setDimensions(1000, 600, 5000, 5000);
	scroller.zoomTo(2, true);
	
	setTimeout(function() {
		scroller.scrollTo(300, 400);

		var values = scroller.getValues();

		// Zoom level can not have reached final position yet
		equal(values.left, 300);
		equal(values.top, 400);
		notEqual(values.zoom, 2);
		
		// Scroll max need have values different as 
		// they must not be based of final zoom, but current zoom
		var max = scroller.getScrollMax();
		notEqual(max.left, (5000*2)-1000);
		notEqual(max.top, (5000*2)-600);
				
		start();
	}, 150);
	
});



// ========================================================================
module("Events");
// ========================================================================

asyncTest("Scroll via Move Events and Acceleration", function() {
	
	var scroller = new Scroller();
	scroller.setDimensions(1000, 600, 5000, 5000);
	
	var now = 0;
	
	scroller.doTouchStart([{
		pageX: 500,
		pageY: 700
	}], now+=40);

	scroller.doTouchMove([{
		pageX: 490,
		pageY: 690
	}], now+=40);

	// Measurement between these two
	// Initial movement is ignored

	scroller.doTouchMove([{
		pageX: 470,
		pageY: 670
	}], now+=40);

	scroller.doTouchEnd(now);
	
	var values = scroller.getValues();
	equal(values.left, 20);
	equal(values.top, 20);
	
	window.setTimeout(function() {
		var values = scroller.getValues();
		equal(Math.round(values.left), 185);
		equal(Math.round(values.top), 185);
		start();
	}, 2000);
	
});

test("Zoom via Wheel Events", function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	scroller.setDimensions(1000, 600, 5000, 5000);

	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 1);
	
	scroller.doMouseZoom(3, null, 0, 0);
	
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 0.97);

	scroller.doMouseZoom(-3, null, 0, 0);
		
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 0.9991);
	
	
	
	// Reset
	scroller.zoomTo(1);
	
	scroller.doMouseZoom(-3, null, 200, 200);
	
	var values = scroller.getValues();
	equal(values.left, 6.463917525773184);
	equal(values.top, 6.278350515463927);
	equal(values.zoom, 1.03);


	// Reset
	scroller.zoomTo(1);
	scroller.scrollTo(0, 0);
	
	scroller.doMouseZoom(-3, null, 200, 200);
	scroller.doMouseZoom(-3, null, 200, 200);
	scroller.doMouseZoom(-3, null, 200, 200);
	
	var values = scroller.getValues();
	equal(values.left, 18.5454);
	equal(values.top, 18.5454);
	equal(values.zoom, 1.092727);

});

test("Zoom via Touch Events", function() {
	
	var scroller = new Scroller(null, {
		zooming: true
	});
	
	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 1);
	
	var now = 0;
	
	var first = {
		pageX: 250,
		pageY: 300
	};
	
	var second = {
		pageX: 350,
		pageY: 400
	};
	
	// Connect first finger
	scroller.doTouchStart([first], now+=20);
	
	// Connect second finger
	scroller.doTouchStart([first, second], now+=20);
	
	// Move fingers by 20px to middle (equal movement)
	first.pageX = 270;
	first.pageY = 320;
	second.pageX = 330;
	second.pageY = 380;
	
	scroller.doTouchMove([first, second], now+=20);
	
	scroller.doTouchEnd(now);

	var values = scroller.getValues();
	equal(values.left, 0);
	equal(values.top, 0);
	equal(values.zoom, 1);
		
	
});


asyncTest("Pull-to-Refresh", function() {
	
	var scroller = new Scroller(null, {
		scrollingX: false
	});
	
	var phase = 0;
	
	// Activate => Start => Done => Deactivate
	
	var activateFunc = function() {
		equal(phase, 0);
		phase = 1;
	};
	
	var deactivateFunc = function() {
		equal(phase, 3);
		phase = 4;
		start();
	};
	
	var startFunc = function() {
		equal(phase, 1);
		phase = 2;
		
		setTimeout(function() {
			equal(phase, 2);
			phase = 3;

			scroller.finishPullToRefresh();
		}, 1000);
	};

	scroller.activatePullToRefresh(50, activateFunc, deactivateFunc, startFunc);

	var now = 0;
	
	scroller.doTouchStart([{
		pageX: 250,
		pageY: 300
	}], now+=20);
	
	scroller.doTouchMove([{
		pageX: 250,
		pageY: 310
	}], now+=20);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 330
	}], now+=20);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 350
	}], now+=100);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 370
	}], now+=100);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 390
	}], now+=100);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 410
	}], now+=100);

	scroller.doTouchMove([{
		pageX: 250,
		pageY: 430
	}], now+=100);
	
	scroller.doTouchEnd(now);

});

