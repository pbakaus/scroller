/* DOM-based rendering (Uses 3D when available, falls back on margin when transform not available) */
var render = (function() {
	
	var perspectiveProperty = zynga.common.Style.property("perspective");
	var transformProperty = zynga.common.Style.property("transform");
	
	if (perspectiveProperty) {
		
		return function(left, top, zoom) {
			content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
		};	
		
	} else if (transformProperty) {
		
		return function(left, top, zoom) {
			content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
		};
		
	} else {
		
		return function(left, top, zoom) {
			content.style.marginLeft = left ? (-left) + 'px' : '';
			content.style.marginTop = top ? (-top) + 'px' : '';
			content.style.zoom = zoom || '';
		};
		
	}
})();

