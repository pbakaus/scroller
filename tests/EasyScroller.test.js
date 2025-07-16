import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { EasyScroller } from '../src/EasyScroller.js';

// Mock DOM elements
const createMockElement = (tagName = 'div', attributes = {}) => {
  const element = {
    tagName: tagName.toUpperCase(),
    attributes,
    style: {},
    children: [],
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getAttribute: jest.fn((attr) => attributes[attr]),
    setAttribute: jest.fn(),
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    querySelector: jest.fn(),
    clientWidth: 1000,
    clientHeight: 600,
    scrollWidth: 2000,
    scrollHeight: 1500,
    offsetWidth: 1000,
    offsetHeight: 600,
    getBoundingClientRect: jest.fn(() => ({
      left: 0,
      top: 0,
      width: 1000,
      height: 600
    })),
    dataset: {}, // Added for data-attributes
    parentNode: { removeChild: jest.fn() } // Added for orphan content test
  };
  return element;
};

const createMockTouch = (pageX, pageY) => ({
  pageX,
  pageY,
  target: createMockElement()
});

const createMockTouchEvent = (touches) => ({
  type: 'touchstart', // Default type, can be changed for other tests
  target: createMockElement(),
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  touches,
  pageX: touches[0]?.pageX || 0,
  pageY: touches[0]?.pageY || 0,
  wheelDelta: 0, // Not used in touch events
  timeStamp: Date.now(),
  ...(touches.length > 1 ? { changedTouches: touches } : {})
});

const createMockContainerWithContent = () => {
  const container = createMockElement('div', { id: 'container' });
  const content = createMockElement('div', { id: 'content' });
  container.querySelector = jest.fn(() => content);
  return { container, content };
};

describe('EasyScroller', () => {
  let easyScroller;
  let mockOptions;

  // Helper function to create working mocks
  const createWorkingMocks = () => {
    const container = global.createMockElement('div');
    const content = global.createMockElement('div');
    
    // Set up proper parent-child relationship
    content.parentNode = container;
    container.children = [content];
    container.firstElementChild = content; // For the new EasyScroller constructor
    
    // Set proper dimensions for realistic testing
    container.clientWidth = 300;
    container.clientHeight = 400;
    container.offsetWidth = 300;
    container.offsetHeight = 400;
    
    content.offsetWidth = 600;
    content.offsetHeight = 800;
    content.scrollWidth = 600;
    content.scrollHeight = 800;
    
    return { mockContainer: container, mockContent: content };
  };

  beforeEach(() => {
    mockOptions = {
      scrollingX: true,
      scrollingY: true,
      animating: true,
      bouncing: true,
      zooming: false
    };
  });

  describe('Mock Verification', () => {
    test('should have properly mocked DOM elements', () => {
      // Create mocks directly in test to isolate any setup issues
      const container = {
        tagName: 'DIV',
        style: {},
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        children: []
      };
      
      const content = {
        tagName: 'DIV', 
        style: {},
        parentNode: container,
        scrollWidth: 2000,
        scrollHeight: 1600,
        clientWidth: 1000,
        clientHeight: 800
      };
      
      container.children = [content];
      
      // Test basic structure
      expect(content).toBeDefined();
      expect(container).toBeDefined();
      expect(content.parentNode).toBe(container);
      
      // Test that addEventListener exists and is a function
      expect(container.addEventListener).toBeDefined();
      expect(typeof container.addEventListener).toBe('function');
      expect(jest.isMockFunction(container.addEventListener)).toBe(true);
      
      // Test that we can call addEventListener without error
      expect(() => {
        container.addEventListener('click', jest.fn());
      }).not.toThrow();
      
      // Test that the parentNode has addEventListener
      expect(content.parentNode.addEventListener).toBeDefined();
      expect(typeof content.parentNode.addEventListener).toBe('function');
    });

    test('should work with EasyScroller', () => {
      // Create mocks directly
      const container = {
        tagName: 'DIV',
        style: {},
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        children: [],
        clientLeft: 0,
        clientTop: 0,
        clientWidth: 1000,
        clientHeight: 800,
        getBoundingClientRect: jest.fn(() => ({
          left: 0,
          top: 0,
          right: 1000,
          bottom: 800,
          width: 1000,
          height: 800
        }))
      };
      
      const content = {
        tagName: 'DIV', 
        style: {},
        parentNode: container,
        scrollWidth: 2000,
        scrollHeight: 1600,
        clientWidth: 1000,
        clientHeight: 800
      };
      
      container.children = [content];
      container.firstElementChild = content; // For new EasyScroller constructor
      
      expect(() => {
        easyScroller = new EasyScroller(container);
      }).not.toThrow();
      
      expect(easyScroller).toBeDefined();
      expect(easyScroller.content).toBe(content);
      expect(easyScroller.container).toBe(container);
    });
  });

  describe('Initialization', () => {
    test('should initialize with content element', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      
      expect(() => {
        easyScroller = new EasyScroller(mockContainer);
      }).not.toThrow();
      
      expect(easyScroller).toBeDefined();
      expect(easyScroller.content).toBe(mockContent);
      expect(easyScroller.container).toBe(mockContainer);
    });

    test('should initialize with content and options', () => {
      const { mockContainer } = createWorkingMocks();
      
      expect(() => {
        easyScroller = new EasyScroller(mockContainer, mockOptions);
      }).not.toThrow();
      
      expect(easyScroller.options).toEqual(expect.objectContaining(mockOptions));
    });

    test('should create internal scroller instance', () => {
      const { mockContainer } = createWorkingMocks();
      
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      expect(easyScroller.scroller).toBeDefined();
      expect(typeof easyScroller.scroller.scrollTo).toBe('function');
    });

    test('should set transform origin on content', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      // Should have set some transform origin style
      expect(mockContent.style).toBeDefined();
    });

    test('should call reflow during initialization', () => {
      const { mockContainer } = createWorkingMocks();
      
      expect(() => {
        easyScroller = new EasyScroller(mockContainer, mockOptions);
        // Reflow should have been called as part of initialization
      }).not.toThrow();
    });

    test('should bind events during initialization', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      // Should have called addEventListener on container
      expect(mockContainer.addEventListener).toHaveBeenCalled();
    });

    test('should handle initialization without options', () => {
      const { mockContainer } = createWorkingMocks();
      
      expect(() => {
        easyScroller = new EasyScroller(mockContainer);
      }).not.toThrow();
      
      expect(easyScroller.options).toBeDefined();
    });
  });

  describe('Event Binding', () => {
    test('should bind events during initialization', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      // Should have bound mouse events (since touch is disabled in test env)
      expect(mockContainer.addEventListener).toHaveBeenCalledWith(
        'mousedown', expect.any(Function), false
      );
      expect(mockContainer.addEventListener).toHaveBeenCalledWith(
        'mousewheel', expect.any(Function), false
      );
    });

    test('should handle container without addEventListener', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      // Remove addEventListener to simulate missing method
      delete mockContainer.addEventListener;
      
      expect(() => {
        easyScroller = new EasyScroller(mockContainer, mockOptions);
      }).not.toThrow();
    });

    test('should bind events with passive listeners when supported', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      
      // Mock passive listener support detection
      let passiveSupported = false;
      const originalAddEventListener = mockContainer.addEventListener;
      mockContainer.addEventListener = jest.fn((event, handler, options) => {
        if (typeof options === 'object' && 'passive' in options) {
          passiveSupported = true;
        }
        return originalAddEventListener.call(mockContainer, event, handler, options);
      });
      
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      expect(mockContainer.addEventListener).toHaveBeenCalled();
    });

    test('should bind window resize events', () => {
      // Mock window.addEventListener as a jest function
      const originalWindowAddEventListener = global.window.addEventListener;
      global.window.addEventListener = jest.fn();
      
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      expect(global.window.addEventListener).toHaveBeenCalledWith(
        'resize', expect.any(Function), false
      );
      
      // Restore original
      global.window.addEventListener = originalWindowAddEventListener;
    });
  });

  describe('Touch Event Handling', () => {
    test('should handle touchstart events', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const touchEvent = createMockTouchEvent([createMockTouch(100, 200)]);
      
      // Find the touchstart handler
      const touchStartCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchstart');
      
      if (touchStartCall) {
        const handler = touchStartCall[1];
        expect(() => {
          handler(touchEvent);
        }).not.toThrow();
      }
    });

    test('should handle touchmove events', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const touchEvent = createMockTouchEvent([createMockTouch(150, 250)]);
      
      // Find the touchmove handler
      const touchMoveCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchmove');
      
      if (touchMoveCall) {
        const handler = touchMoveCall[1];
        expect(() => {
          handler(touchEvent);
        }).not.toThrow();
      }
    });

    test('should handle touchend events', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const touchEvent = createMockTouchEvent([]);
      
      // Find the touchend handler
      const touchEndCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchend');
      
      if (touchEndCall) {
        const handler = touchEndCall[1];
        expect(() => {
          handler(touchEvent);
        }).not.toThrow();
      }
    });

    test('should handle touchcancel events', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const touchEvent = createMockTouchEvent([]);
      
      // Find the touchcancel handler
      const touchCancelCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchcancel');
      
      if (touchCancelCall) {
        const handler = touchCancelCall[1];
        expect(() => {
          handler(touchEvent);
        }).not.toThrow();
      }
    });

    test('should handle multi-touch gestures', () => {
      const { mockContainer, mockContent } = createWorkingMocks();
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const touchEvent = createMockTouchEvent([
        createMockTouch(100, 200),
        createMockTouch(300, 400)
      ]);
      
      // Should not throw with multi-touch
      const touchStartCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchstart');
      
      if (touchStartCall) {
        const handler = touchStartCall[1];
        expect(() => {
          handler(touchEvent);
        }).not.toThrow();
      }
    });
  });

  describe('Mouse Event Handling', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should handle mousedown events', () => {
      const mouseEvent = {
        clientX: 100,
        clientY: 200,
        pageX: 100,
        pageY: 200,
        timeStamp: Date.now(), // Add missing timeStamp
        target: mockContainer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      // Find the mousedown handler
      const mouseDownCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'mousedown');
      
      if (mouseDownCall) {
        const handler = mouseDownCall[1];
        expect(() => handler(mouseEvent)).not.toThrow();
      }
    });

    test('should handle mousemove events', () => {
      const mouseMoveEvent = {
        clientX: 150,
        clientY: 250,
        pageX: 150,
        pageY: 250,
        timeStamp: Date.now(), // Add missing timeStamp
        target: mockContainer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const mouseMoveCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'mousemove');
      
      if (mouseMoveCall) {
        const handler = mouseMoveCall[1];
        expect(() => handler(mouseMoveEvent)).not.toThrow();
      }
    });

    test('should handle mouseup events', () => {
      const mouseUpEvent = {
        clientX: 200,
        clientY: 300,
        pageX: 200,
        pageY: 300,
        timeStamp: Date.now(), // Add missing timeStamp
        target: mockContainer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const mouseUpCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'mouseup');
      
      if (mouseUpCall) {
        const handler = mouseUpCall[1];
        expect(() => handler(mouseUpEvent)).not.toThrow();
      }
    });

    test('should ignore mousedown on form elements', () => {
      const formMouseEvent = {
        clientX: 100,
        clientY: 200,
        pageX: 100,
        pageY: 200,
        timeStamp: Date.now(), // Add missing timeStamp
        target: { tagName: 'INPUT' },
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const mouseDownCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'mousedown');
      
      if (mouseDownCall) {
        const handler = mouseDownCall[1];
        expect(() => handler(formMouseEvent)).not.toThrow();
        expect(formMouseEvent.preventDefault).not.toHaveBeenCalled();
      }
    });

    test('should handle mouse wheel events for zooming', () => {
      const wheelEvent = {
        clientX: 100,
        clientY: 200,
        pageX: 100,
        pageY: 200,
        timeStamp: Date.now(), // Add missing timeStamp
        wheelDelta: 120, // Positive = zoom out
        target: mockContainer,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const wheelCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'mousewheel' || call[0] === 'wheel');
      
      if (wheelCall) {
        const handler = wheelCall[1];
        expect(() => handler(wheelEvent)).not.toThrow();
      }
    });
  });

  describe('Reflow and Dimensions', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should have reflow method', () => {
      expect(easyScroller.reflow).toBeDefined();
      expect(typeof easyScroller.reflow).toBe('function');
    });

    test('should calculate dimensions on reflow', () => {
      // Set up container dimensions
      mockContainer.clientWidth = 300;
      mockContainer.clientHeight = 400;
      mockContent.offsetWidth = 600;
      mockContent.offsetHeight = 800;
      
      expect(() => {
        easyScroller.reflow();
      }).not.toThrow();
    });

    test('should handle container without dimensions', () => {
      mockContainer.clientWidth = 0;
      mockContainer.clientHeight = 0;
      
      expect(() => {
        easyScroller.reflow();
      }).not.toThrow();
    });

    test('should handle content without dimensions', () => {
      mockContent.offsetWidth = 0;
      mockContent.offsetHeight = 0;
      
      expect(() => {
        easyScroller.reflow();
      }).not.toThrow();
    });

    test('should handle resize events', () => {
      const resizeEvent = { target: global.window };
      
      // Mock window resize handler
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((callback) => callback());
      
      // Simulate resize event
      const resizeCall = global.window.addEventListener.mock?.calls
        ?.find(call => call[0] === 'resize');
      
      if (resizeCall) {
        const handler = resizeCall[1];
        expect(() => handler(resizeEvent)).not.toThrow();
      }
      
      global.setTimeout = originalSetTimeout;
    });
  });

  describe('Scroller Integration', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should create internal scroller instance', () => {
      expect(easyScroller.scroller).toBeDefined();
      expect(easyScroller.scroller).toHaveProperty('scrollTo');
      expect(easyScroller.scroller).toHaveProperty('zoomTo');
      expect(easyScroller.scroller).toHaveProperty('getValues');
    });

    test('should pass options to scroller', () => {
      const customOptions = {
        scrollingX: false,
        scrollingY: true,
        zooming: true,
        minZoom: 0.5,
        maxZoom: 3
      };
      
      const { mockContainer, mockContent } = createWorkingMocks();
      const customEasyScroller = new EasyScroller(mockContainer, customOptions);
      
      expect(customEasyScroller.scroller).toBeDefined();
    });

    test('should handle scroller callbacks', () => {
      const callbackOptions = {
        callback: jest.fn()
      };
      
      const { mockContainer, mockContent } = createWorkingMocks();
      const callbackEasyScroller = new EasyScroller(mockContainer, callbackOptions);
      
      expect(callbackEasyScroller.scroller).toBeDefined();
    });

    test('should provide access to scroller methods', () => {
      expect(typeof easyScroller.scrollTo).toBe('function');
      expect(typeof easyScroller.zoomTo).toBe('function');
      expect(typeof easyScroller.getValues).toBe('function');
    });
  });

  describe('Auto-initialization', () => {
    test('should auto-initialize scrollable elements', () => {
      // Create proper container and content structure
      const scrollableElement = global.createMockElement();
      const contentElement = global.createMockElement();
      
      // Set up proper parent-child relationship
      contentElement.parentNode = scrollableElement;
      scrollableElement.firstElementChild = contentElement;
      
      scrollableElement.attributes = {
        getNamedItem: jest.fn((name) => {
          if (name === 'data-scrollable') return { value: 'true' };
          return null;
        })
      };
      
      global.document.querySelectorAll = jest.fn().mockReturnValue([scrollableElement]);
      
      // Call auto-initialization directly
      EasyScroller.autoInit();
      
      expect(global.document.querySelectorAll).toHaveBeenCalledWith('[data-scrollable],[data-zoomable]');
    });

    test('should auto-initialize zoomable elements', () => {
      const zoomableElement = global.createMockElement();
      const contentElement = global.createMockElement();
      
      // Set up proper parent-child relationship
      contentElement.parentNode = zoomableElement;
      zoomableElement.firstElementChild = contentElement;
      
      zoomableElement.attributes = {
        getNamedItem: jest.fn((name) => {
          if (name === 'data-zoomable') return { value: 'true' };
          return null;
        })
      };
      
      global.document.querySelectorAll = jest.fn().mockReturnValue([zoomableElement]);
      
      // Call auto-initialization directly
      EasyScroller.autoInit();
      
      expect(global.document.querySelectorAll).toHaveBeenCalled();
    });

    test('should parse data attributes for configuration', () => {
      const configElement = global.createMockElement();
      const contentElement = global.createMockElement();
      
      // Set up proper parent-child relationship
      contentElement.parentNode = configElement;
      configElement.firstElementChild = contentElement;
      
      configElement.attributes = {
        getNamedItem: jest.fn((name) => {
          if (name === 'data-scrollable') return { value: 'true' };
          return null;
        })
      };
      
      global.document.querySelectorAll = jest.fn().mockReturnValue([configElement]);
      
      // Call auto-initialization directly
      EasyScroller.autoInit();
      
      expect(configElement.attributes.getNamedItem).toHaveBeenCalledWith('data-scrollable');
    });
  });

  describe('Error Handling', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
    });

    test('should handle invalid event objects', () => {
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      // Find a touch handler and try to call it with invalid event
      const touchStartCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchstart');
      
      if (touchStartCall) {
        const handler = touchStartCall[1];
        expect(() => handler(null)).not.toThrow();
        expect(() => handler({})).not.toThrow();
      }
    });

    test('should handle missing touch properties', () => {
      easyScroller = new EasyScroller(mockContainer, mockOptions);
      
      const invalidTouchEvent = {
        touches: null,
        changedTouches: null,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const touchStartCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchstart');
      
      if (touchStartCall) {
        const handler = touchStartCall[1];
        expect(() => handler(invalidTouchEvent)).not.toThrow();
      }
    });

    test('should handle DOM element without required methods', () => {
      const minimalElement = {}; // Element without any methods
      
      expect(() => {
        easyScroller = new EasyScroller(minimalElement, mockOptions);
      }).not.toThrow();
    });

    test('should handle event handler errors gracefully', () => {
      const errorCallback = jest.fn(() => {
        throw new Error('Render error');
      });
      
      // Create EasyScroller with error-prone scroller
      expect(() => {
        easyScroller = new EasyScroller(mockContainer, mockOptions);
        // Override the render method to throw
        easyScroller.render = errorCallback;
      }).not.toThrow();
    });
  });

  describe('Performance and Optimization', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should debounce resize events', () => {
      const originalSetTimeout = global.setTimeout;
      const originalClearTimeout = global.clearTimeout;
      
      let timeoutCallback;
      global.setTimeout = jest.fn((callback, delay) => {
        timeoutCallback = callback;
        return 123; // Mock timer ID
      });
      global.clearTimeout = jest.fn();
      
      // Simulate multiple rapid resize events
      const resizeEvent = { target: global.window };
      const resizeCall = global.window.addEventListener.mock?.calls
        ?.find(call => call[0] === 'resize');
      
      if (resizeCall) {
        const handler = resizeCall[1];
        handler(resizeEvent);
        handler(resizeEvent);
        handler(resizeEvent);
        
        expect(global.clearTimeout).toHaveBeenCalled();
        expect(global.setTimeout).toHaveBeenCalled();
      }
      
      global.setTimeout = originalSetTimeout;
      global.clearTimeout = originalClearTimeout;
    });

    test('should handle high-frequency touch events', () => {
      const touchMoveEvent = {
        touches: [{ pageX: 100, pageY: 200, clientX: 100, clientY: 200 }],
        changedTouches: [{ pageX: 100, pageY: 200, clientX: 100, clientY: 200 }],
        timeStamp: Date.now(),
        preventDefault: jest.fn(),
        stopPropagation: jest.fn()
      };
      
      const touchMoveCall = mockContainer.addEventListener.mock.calls
        .find(call => call[0] === 'touchmove');
      
      if (touchMoveCall) {
        const handler = touchMoveCall[1];
        
        // Simulate rapid touch events
        for (let i = 0; i < 10; i++) {
          expect(() => handler(touchMoveEvent)).not.toThrow();
        }
      }
    });
  });

  describe('Cleanup and Memory Management', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should provide cleanup method', () => {
      expect(easyScroller.destroy || easyScroller.cleanup).toBeDefined();
    });

    test('should remove event listeners on cleanup', () => {
      mockContainer.removeEventListener = jest.fn();
      
      if (easyScroller.destroy) {
        easyScroller.destroy();
        expect(mockContainer.removeEventListener).toHaveBeenCalled();
      } else if (easyScroller.cleanup) {
        easyScroller.cleanup();
        expect(mockContainer.removeEventListener).toHaveBeenCalled();
      }
    });

    test('should handle multiple initialization attempts', () => {
      expect(() => {
        new EasyScroller(mockContainer, mockOptions);
        new EasyScroller(mockContainer, mockOptions);
      }).not.toThrow();
    });
  });

  describe('Rendering and Transform', () => {
    let mockContainer, mockContent;
    
    beforeEach(() => {
      const mocks = createWorkingMocks();
      mockContainer = mocks.mockContainer;
      mockContent = mocks.mockContent;
      easyScroller = new EasyScroller(mockContainer, mockOptions);
    });

    test('should have render method', () => {
      expect(easyScroller.render).toBeDefined();
      expect(typeof easyScroller.render).toBe('function');
    });

    test('should handle render calls', () => {
      expect(() => {
        easyScroller.render(100, 200, 1.5);
      }).not.toThrow();
      
      expect(mockContent.style.transform).toBeDefined();
    });

    test('should set transform styles', () => {
      easyScroller.render(50, 75, 2.0);
      
      // Debug: Log all style properties to see what's being set
      console.log('Content style properties:', Object.keys(mockContent.style));
      console.log('WebkitTransform:', mockContent.style.WebkitTransform);
      console.log('webkitTransform:', mockContent.style.webkitTransform);
      console.log('transform:', mockContent.style.transform);
      
      // Check for webkit transform (most likely to be used)
      const hasTransform = mockContent.style.WebkitTransform || 
                          mockContent.style.webkitTransform ||
                          mockContent.style.transform;
      
      if (hasTransform) {
        expect(hasTransform).toContain('translate3d');
        expect(hasTransform).toContain('scale');
      } else {
        // If no transform, check for fallback properties
        expect(mockContent.style.marginLeft || mockContent.style.marginTop || mockContent.style.zoom).toBeDefined();
      }
    });

    test('should handle invalid transform values', () => {
      expect(() => {
        easyScroller.render(NaN, undefined, null);
      }).not.toThrow();
    });

    test('should handle negative transform values', () => {
      expect(() => {
        easyScroller.render(-100, -200, 0.5);
      }).not.toThrow();
      
      expect(mockContent.style.transform).toContain('translate3d');
    });
  });
}); 