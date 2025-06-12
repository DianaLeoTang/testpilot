import { generateReport } from '../src/reporter';

describe('reporter', () => {

  describe('generateReport', () => {
    it('should be defined', () => {
      expect(generateReport).toBeDefined();
      expect(typeof generateReport).toBe('function');
    });

    it('should execute without throwing errors', () => {
      expect(() => generateReport()).not.toThrow();
    });

  });
});
