import * as scannerModule from '../src/scanner';

describe('scanner', () => {
  it('should be importable', () => {
    expect(scannerModule).toBeDefined();
  });

  it('should not throw when imported', () => {
    expect(() => require('../src/scanner')).not.toThrow();
  });
});

// No exports detected - this module might have side effects or be a utility module
