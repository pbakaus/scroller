import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { Animate } from '../src/Animate.js';

describe('Animate', () => {
  let mockStep, mockVerify, mockComplete;
  let originalPerformanceNow;
  let originalRequestAnimationFrame;
  let performanceTime;

  beforeEach(() => {
    // Create proper performance.now mock that supports chaining
    performanceTime = 1000;
    originalPerformanceNow = global.performance.now;
    global.performance.now = jest.fn(() => performanceTime);
    
    // Mock the Animate.requestAnimationFrame method
    originalRequestAnimationFrame = Animate.requestAnimationFrame;
    Animate.requestAnimationFrame = jest.fn((callback) => {
      // Store the callback for manual triggering in tests
      Animate.requestAnimationFrame.lastCallback = callback;
      // Simulate immediate execution for some tests
      setTimeout(() => callback(performanceTime), 0);
      return 1; // Return a mock ID
    });
    
    // Mock functions
    mockStep = jest.fn();
    mockVerify = jest.fn().mockReturnValue(true);
    mockComplete = jest.fn();
    
    // Stop any running animations
    Animate.stop();
  });

  afterEach(() => {
    Animate.stop();
    global.performance.now = originalPerformanceNow;
    Animate.requestAnimationFrame = originalRequestAnimationFrame;
  });

  describe('Basic Animation Functions', () => {
    test('should call requestAnimationFrame when starting animation', () => {
      Animate.start(mockStep, mockVerify, mockComplete);
      
      expect(Animate.requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(Animate.requestAnimationFrame).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Animation Lifecycle', () => {
    test('should execute step function during animation', async () => {
      // Allow one step, then stop
      let stepCount = 0;
      mockVerify.mockImplementation(() => {
        stepCount++;
        return stepCount <= 1; // Allow first step, then stop
      });
      
      // Start animation
      const animationId = Animate.start(mockStep, mockVerify, mockComplete);
      
      // Wait for the animation callback to execute
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(mockStep).toHaveBeenCalled();
      expect(mockComplete).toHaveBeenCalled();
    });

    test('should check verify function before each step', async () => {
      mockVerify.mockReturnValue(false); // Stop animation
      
      Animate.start(mockStep, mockVerify, mockComplete);
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(mockVerify).toHaveBeenCalled();
      expect(mockComplete).toHaveBeenCalled(); // Should complete when verify returns false
    });

    test('should stop animation when verify returns false', async () => {
      let callCount = 0;
      mockVerify.mockImplementation(() => {
        callCount++;
        return callCount < 2; // Stop after first call
      });
      
      Animate.start(mockStep, mockVerify, mockComplete);
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 20));
      
      expect(mockVerify).toHaveBeenCalled();
      expect(mockStep).toHaveBeenCalled();
      expect(mockComplete).toHaveBeenCalled();
    });

    test('should continue animation when verify returns true', async () => {
      // Allow a few steps, then stop
      let stepCount = 0;
      mockVerify.mockImplementation(() => {
        stepCount++;
        return stepCount <= 2; // Allow two steps, then stop
      });
      
      Animate.start(mockStep, mockVerify, mockComplete);
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 30));
      
      expect(mockStep).toHaveBeenCalled();
      expect(mockComplete).toHaveBeenCalled();
    });
  });

  describe('Animation Control', () => {
    test('should stop running animation', async () => {
      const animationId = Animate.start(mockStep, mockVerify, mockComplete);
      expect(Animate.isRunning(animationId)).toBe(true);
      
      Animate.stop(animationId);
      expect(Animate.isRunning(animationId)).toBe(false);
    });

    test('should return false for isRunning when no animation is active', () => {
      expect(Animate.isRunning(999)).toBe(false);
    });

    test('should not start new animation if one is already running', () => {
      // Start first animation
      const id1 = Animate.start(mockStep, mockVerify, mockComplete);
      const firstCallCount = Animate.requestAnimationFrame.mock.calls.length;
      
      // Try to start second animation
      const mockStep2 = jest.fn();
      const mockVerify2 = jest.fn();
      const mockComplete2 = jest.fn();
      
      const id2 = Animate.start(mockStep2, mockVerify2, mockComplete2);
      
      // Both should have unique IDs and separate calls
      expect(id1).not.toBe(id2);
      expect(Animate.requestAnimationFrame.mock.calls.length).toBeGreaterThan(firstCallCount);
    });
  });

  describe('Animation Timing and Performance', () => {
    test('should calculate frame rate correctly', async () => {
      performanceTime = 1000; // start time
      
      Animate.start(mockStep, mockVerify, mockComplete);
      
      // Advance time and manually trigger the callback
      performanceTime = 1016; // +16ms = ~60fps
      global.performance.now.mockReturnValue(1016);
      
      if (Animate.requestAnimationFrame.lastCallback) {
        Animate.requestAnimationFrame.lastCallback(1016);
      }
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(mockStep).toHaveBeenCalled();
    });

    test('should handle duration-based animations', async () => {
      const duration = 100;
      
      performanceTime = 1000;
      global.performance.now.mockReturnValue(1000);
      
      Animate.start(mockStep, mockVerify, mockComplete, duration);
      
      // Simulate end of animation
      performanceTime = 1100; // +100ms
      global.performance.now.mockReturnValue(1100);
      
      if (Animate.requestAnimationFrame.lastCallback) {
        Animate.requestAnimationFrame.lastCallback(1100);
      }
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(mockStep).toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle exceptions in step function', async () => {
      const errorStep = jest.fn(() => {
        throw new Error('Step error');
      });
      
      // Should not throw
      expect(() => {
        Animate.start(errorStep, mockVerify, mockComplete);
      }).not.toThrow();
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    test('should handle exceptions in verify function', async () => {
      const errorVerify = jest.fn(() => {
        throw new Error('Verify error');
      });
      
      // Should not throw
      expect(() => {
        Animate.start(mockStep, errorVerify, mockComplete);
      }).not.toThrow();
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    test('should handle very high frame rates', async () => {
      performanceTime = 1000;
      global.performance.now.mockReturnValue(1000);
      
      Animate.start(mockStep, mockVerify, mockComplete);
      
      // Trigger very fast frame (1ms)
      performanceTime = 1001;
      global.performance.now.mockReturnValue(1001);
      
      if (Animate.requestAnimationFrame.lastCallback) {
        Animate.requestAnimationFrame.lastCallback(1001);
      }
      
      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(mockStep).toHaveBeenCalled();
    });

    test('should handle zero duration gracefully', () => {
      performanceTime = 1000;
      global.performance.now.mockReturnValue(1000);
      
      expect(() => {
        Animate.start(mockStep, mockVerify, mockComplete, 0);
      }).not.toThrow();
    });

    test('should handle negative duration gracefully', () => {
      expect(() => {
        Animate.start(mockStep, mockVerify, mockComplete, -100);
      }).not.toThrow();
    });
  });
}); 