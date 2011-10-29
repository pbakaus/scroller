/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
var domRender = (function(bodyStyle) {

	'use strict';

	var prefix =
			('WebkitTransform' in bodyStyle) ? 'Webkit' :
			('MozTransform' in bodyStyle) ? 'Moz' :
			('msTransform' in bodyStyle) ? 'ms' :
			('OTransform' in bodyStyle) ? 'O' : '',
		transform = prefix ? prefix+'Transform' : 'transform',
		perspective = prefix ? prefix+'Perspective' : 'perspective';

	if (perspective in bodyStyle) {
		return function(content, left, top, zoom) {
			content.style[transform] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
		};

	} else if (transform in bodyStyle) {
		return function(content, left, top, zoom) {
			content.style[transform] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
		};

	} else {
		return function(content, left, top, zoom) {
			content.style.marginLeft = left ? (-left) + 'px' : '';
			content.style.marginTop = top ? (-top) + 'px' : '';
			content.style.zoom = zoom || '';
		};
	}

})(document.body.style);