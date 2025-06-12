describe('index', () => {
  it('should be importable without errors', () => {
    expect(() => {
      require('../src/index');
    }).not.toThrow();
  });
});

// No exports detected in this file
// If there should be exports, check the source file and update imports manually
