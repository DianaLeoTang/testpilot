import * as indexModule from '../src/index';

describe('index', () => {
  it('should be importable', () => {
    expect(indexModule).toBeDefined();
  });

  it('should not throw when imported', () => {
    expect(() => require('../src/index')).not.toThrow();
  });
});

// No exports detected - this module might have side effects or be a utility module
