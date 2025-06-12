describe('runner', () => {
  it('should be importable without errors', () => {
    expect(() => {
      require('../src/runner');
    }).not.toThrow();
  });
});

// No exports detected in this file
// If there should be exports, check the source file and update imports manually
