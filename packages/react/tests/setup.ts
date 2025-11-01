import { afterAll, afterEach, vi } from "vitest";

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn(),
};

// Mock timers for testing
vi.useFakeTimers();

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Restore real timers after all tests
afterAll(() => {
  vi.useRealTimers();
});
