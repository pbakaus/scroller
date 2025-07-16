// Test setup and mocks
import { jest } from '@jest/globals';

// Mock performance.now()
global.performance = {
  now: jest.fn(() => Date.now())
};

// Mock requestAnimationFrame and cancelAnimationFrame
let animationId = 1;
const animationCallbacks = new Map();

// Enhanced requestAnimationFrame mock
let rafCallbacks = [];
global.requestAnimationFrame = jest.fn((callback) => {
  rafCallbacks.push(callback);
  return rafCallbacks.length; // Return a fake ID
});

global.cancelAnimationFrame = jest.fn((id) => {
  // Simple implementation for testing
});

// Helper to manually trigger RAF callbacks for testing
global.triggerAnimationFrame = (timestamp = Date.now()) => {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  callbacks.forEach(callback => {
    try {
      callback(timestamp);
    } catch (error) {
      // Silently handle errors in animation callbacks during testing
    }
  });
};

// Mock console methods to reduce test noise
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Enhanced DOM element mock with comprehensive style support
global.createMockElement = function(tagName = 'div') {
  const element = {
    tagName: tagName.toUpperCase(),
    style: {
      transform: '',
      transformOrigin: '',
      marginLeft: '',
      marginTop: '',
      zoom: '',
      // Mock vendor-prefixed properties with all capitalization variants
      WebkitTransform: '',
      webkitTransform: '',
      WebkitTransformOrigin: '',
      webkitTransformOrigin: '',
      WebkitPerspective: '',
      webkitPerspective: '',
      MozTransform: '',
      mozTransform: '',
      MozTransformOrigin: '',
      mozTransformOrigin: '',
      msTransform: '',
      OTransform: '',
      oTransform: '',
      // Support property setting with bracket notation
      setProperty: jest.fn(),
      getPropertyValue: jest.fn()
    },
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    setAttribute: jest.fn(),
    getAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    hasAttribute: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    insertBefore: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    getBoundingClientRect: jest.fn(() => ({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0
    })),
    // Common properties
    clientLeft: 0,
    clientTop: 0,
    clientWidth: 100,
    clientHeight: 100,
    offsetLeft: 0,
    offsetTop: 0,
    offsetWidth: 100,
    offsetHeight: 100,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 200,
    scrollHeight: 200,
    parentNode: null,
    childNodes: [],
    children: [],
    firstChild: null,
    lastChild: null,
    nextSibling: null,
    previousSibling: null,
    nodeType: 1,
    nodeName: tagName.toUpperCase(),
    textContent: '',
    innerHTML: '',
    id: '',
    className: '',
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(() => false),
      toggle: jest.fn()
    },
    dataset: {},
    attributes: {
      getNamedItem: jest.fn((name) => {
        if (name === 'data-scrollable') return { value: 'true' };
        if (name === 'data-zoomable') return { value: 'true' };
        return null;
      })
    }
  };
  
  // Add support for dynamic style property setting
  const originalStyle = element.style;
  element.style = new Proxy(originalStyle, {
    set(target, property, value) {
      target[property] = value;
      return true;
    },
    get(target, property) {
      return target[property] || '';
    }
  });
  
  return element;
};

// Mock document object
global.document = {
  documentElement: {
    style: {
      MozAppearance: '',
      WebkitAppearance: ''
    }
  },
  
  body: global.createMockElement('body'),
  
  createElement: jest.fn((tagName) => {
    const element = global.createMockElement(tagName);
    // Ensure transform properties are available for feature detection
    element.style.WebkitPerspective = '';
    element.style.WebkitTransform = '';
    element.style.webkitPerspective = '';
    element.style.webkitTransform = '';
    return element;
  }),
  
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => [])
};

// Simulate touch support in test environment
// global.window.ontouchstart = {}; // Comment out to force mouse events in tests

// Enhanced document mock - handle documentElement properly
Object.defineProperty(global.document, 'documentElement', {
  value: global.createMockElement('html'),
  writable: false,
  configurable: true
});

// Set webkit appearance for browser detection
global.document.documentElement.style.WebkitAppearance = '';
global.document.documentElement.style.WebkitPerspective = ''; // Support perspective detection
global.document.documentElement.style.WebkitTransform = '';   // Support transform detection

// Mock browser detection properties
global.window.opera = undefined;
global.navigator.cpuClass = undefined;

// Mock window object
global.window = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  
  // For browser detection
  opera: undefined,
  
  // Animation frame functions
  requestAnimationFrame: global.requestAnimationFrame,
  cancelAnimationFrame: global.cancelAnimationFrame
};

// Store original mocks that we want to preserve
const originalMocks = {
  documentAddEventListener: global.document.addEventListener,
  windowAddEventListener: global.window.addEventListener,
  requestAnimationFrame: global.requestAnimationFrame,
  cancelAnimationFrame: global.cancelAnimationFrame,
  performanceNow: global.performance.now
};

// Clean up function for tests
global.beforeEach(() => {
  // Only clear specific mocks, not all mocks
  // This preserves the DOM method mocks that need to persist
  
  // Reset animation state
  animationCallbacks.clear();
  animationId = 1;
  
  // Restore critical mocks that might get cleared
  global.document.addEventListener = originalMocks.documentAddEventListener;
  global.window.addEventListener = originalMocks.windowAddEventListener;
  global.requestAnimationFrame = originalMocks.requestAnimationFrame;
  global.cancelAnimationFrame = originalMocks.cancelAnimationFrame;
  global.performance.now = originalMocks.performanceNow;
});

// Utility functions for tests
global.createMockCallback = () => jest.fn();

global.createMockTouchEvent = (touches = []) => ({
  touches,
  changedTouches: touches,
  targetTouches: touches,
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  timeStamp: Date.now()
});

global.createMockTouch = (pageX = 0, pageY = 0) => ({
  pageX,
  pageY,
  clientX: pageX,
  clientY: pageY,
  identifier: Math.random()
});

// Create mock container with content for EasyScroller tests
global.createMockContainerWithContent = () => {
  const container = global.createMockElement('div');
  const content = global.createMockElement('div');
  
  // Explicitly set up parent-child relationship
  content.parentNode = container;
  container.children = [content];
  
  // Add content dimensions
  content.scrollWidth = 2000;
  content.scrollHeight = 1600;
  content.clientWidth = 1000;
  content.clientHeight = 800;
  
  return { container, content };
}; 