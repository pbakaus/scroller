/*
 * Scroller - Full Bundle (with EasyScroller)
 * http://github.com/pbakaus/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/pbakaus/scroller/master/MIT-LICENSE.txt
 */

import { EasyScroller } from "./EasyScroller.js";
import { Scroller } from "./Scroller.js";

// Export Scroller as default for vanilla JS compatibility
// but also attach EasyScroller to the Scroller constructor
Scroller.EasyScroller = EasyScroller;

export default Scroller;
