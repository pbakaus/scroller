/* 
==================================================================================================

  Copyright Zynga Inc

==================================================================================================
*/

if (!global.zynga) {
	zynga = {};
}

/**
 * Helper class for doing cell distribution and paint callbacks on a predefined area when
 * location to render is being modified.
 */
zynga.CellDistribution = function() {
	
};


/**
 * This method is required to being called every time the cell, outer or inner dimensions are being modified.
 *
 * @param clientWidth {Number} Inner width of container
 * @param clientHeight {Number} Inner height of container
 * @param contentWidth {Number} Outer width of content
 * @param contentHeight {Number} Outer height of content
 * @param cellWidth {Number} Width of each cell to render
 * @param cellHeight {Number} Height of each cell to render
 */
zynga.CellDistribution.prototype.setup = function(clientWidth, clientHeight, contentWidth, contentHeight, cellWidth, cellHeight) {

	this.__clientWidth = clientWidth;
	this.__clientHeight = clientHeight;
	this.__contentWidth = contentWidth;
	this.__contentHeight = contentHeight;
	this.__cellWidth = cellWidth;
	this.__cellHeight = cellHeight;

};


/**
 * Renders the given location on the area defined by {@link #setup} by calling
 * `paint(row, column, left, top, width, height, zoom)` as needed.
 *
 * @param left {Number} Left position to render
 * @param top {Number} Top position to render
 * @param zoom {Number} Current zoom level (should be applied to `left` and `top` already)
 * @param paint {Function} Callback method for every cell to paint.
 */
zynga.CellDistribution.prototype.render = function(left, top, zoom, paint) {

	var clientHeight = this.__clientHeight;
	var clientWidth = this.__clientWidth;

	// Respect zooming
	var cellHeight = this.__cellHeight * zoom;
	var cellWidth = this.__cellWidth * zoom;

	// Compute starting rows/columns and support out of range scroll positions
	var startRow = Math.max(Math.floor(top / cellHeight), 0);
	var startCol = Math.max(Math.floor(left / cellWidth), 0);

	// Compute maximum rows/columns to render for content size
	var maxRows = (this.__contentHeight * zoom) / cellHeight;
	var maxCols = (this.__contentWidth * zoom) / cellWidth;

	// Compute initial render offsets
	// 1. Positive scroll position: We match the starting rows/cell first so we
	//    just need to take care that the half-visible cell is fully rendered
	//    and placed partly outside.
	// 2. Negative scroll position: We shift the whole render context
	//    (ignoring the cell dimensions) and effectively reduce the render
	//    dimensions by the scroll amount.
	var startTop = top >= 0 ? -top % cellHeight : -top;
	var startLeft = left >= 0 ? -left % cellWidth : -left;

	// Compute number of rows to render
	var rows = Math.floor(clientHeight / cellHeight);

	if ((top % cellHeight) > 0) {
		rows += 1;
	}

	if ((startTop + (rows * cellHeight)) < clientHeight) {
		rows += 1;
	}

	// Compute number of columns to render
	var cols = Math.floor(clientWidth / cellWidth);

	if ((left % cellWidth) > 0) {
		cols += 1;
	}

	if ((startLeft + (cols * cellWidth)) < clientWidth) {
		cols += 1;
	}

	// Limit rows/columns to maximum numbers
	rows = Math.min(rows, maxRows - startRow);
	cols = Math.min(cols, maxCols - startCol);

	// Initialize looping variables
	var currentTop = startTop;
	var currentLeft = startLeft;

	// Render new squares
	for (var row = startRow; row < (rows + startRow); row++) {
		for (var col = startCol; col < (cols + startCol); col++) {
			paint(row, col, currentLeft, currentTop, cellWidth, cellHeight, zoom);
			currentLeft += cellWidth;
		}

		currentLeft = startLeft;
		currentTop += cellHeight;
	}
	
};
