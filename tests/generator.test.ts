import * as generatorModule from '../src/generator';

describe('generator', () => {
  it('should be importable', () => {
    expect(generatorModule).toBeDefined();
  });

  it('should not throw when imported', () => {
    expect(() => require('../src/generator')).not.toThrow();
  });
});

// No exports detected - this module might have side effects or be a utility module
