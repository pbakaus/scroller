/* jQuery-based UI bindings */

var bindEvents = (function(win, doc) {

	// the active scroller
	var active;

	// event listeners shared between Scrollers

	function endscroll(e) {
		if (!active) { return; }

		try {
			active.doTouchEnd(e.timeStamp);
			e.preventDefault();

		} finally {
			active = null;
		}
	}

	function bindReflow(scroller, container, content) {
		var $container = $(container),
			$content = $(content),

			reflow = function() {	
				scroller.setDimensions(
					$container.innerWidth(), $container.innerHeight(),
					$content.outerWidth(true), $content.outerHeight(true));
			};

		$(win).bind('resize', reflow);
		$(doc).ready(reflow);
	}

	if ('ontouchstart' in doc) {
		// NOTE: touch events must use addEventListener

		doc.addEventListener('touchmove', function(e) {
			// suppress dragging of whole window on iOS
			e.preventDefault();

			if (!active) { return; }

			active.doTouchMove(e.touches, e.timeStamp, e.scale);

		}, false);

		doc.addEventListener('touchend', endscroll, false);
		doc.addEventListener('touchcancel', endscroll, false);

		return function(scroller, container, content) {
			bindReflow(scroller, container, content);

			container.addEventListener('touchstart', function(e) {
				// ignore if already scrolling or initial click on a form element
				if (active ||
					/input|textarea|select/i.exec((e.touches[0] && e.touches[0].target || {}).tagName)) {
					return;
				}

				active = scroller;

				scroller.doTouchStart(e.touches, e.timeStamp);
				e.preventDefault();

			}, false);
		};

	} else {
		var onmousedown = function(e) {
				// suppress inadvertent selection of text
				e.preventDefault();
			},
			onmousemove = function(e) {
				if (!active) { return; }
	
				active.doTouchMove([e], e.timeStamp);
	
				e.preventDefault();
			};

		if (doc.addEventListener) {
			doc.addEventListener('mousedown', onmousedown, false);
			doc.addEventListener('mousemove', onmousemove, true);
			doc.addEventListener('mouseup', endscroll, true);

		} else {
			// only incur overhead of jQuery events for older IE
			$(doc)
				.bind('mousedown', onmousedown)
				.bind('mousemove', onmousemove)
				.bind('mouseup', endscroll);
		}

		return function(scroller, container, content) {
			bindReflow(scroller, container, content);

			$(container)
				.bind('mousedown', function(e) {
					// ignore if already scrolling or initial click on a form element
					if (active ||
						/input|textarea|select/i.exec(e.target && e.target.tagName)) {
						return;
					}

					active = scroller;

					scroller.doTouchStart([e], e.timeStamp);
					e.preventDefault();
				})
				.bind('mousewheel', function(e) {
					// normal scroll-wheel scrolling
					scroller.scrollBy(0, -e.wheelDelta, true);
					e.preventDefault();
				});
		};
	}

})(window, document, jQuery);