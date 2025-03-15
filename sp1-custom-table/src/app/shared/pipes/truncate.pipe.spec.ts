import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  it('create an instance', () => {
    const pipe = new TruncatePipe();
    expect(pipe).toBeTruthy();
  });

  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should truncate a string exceeding the limit', () => {
    expect(pipe.transform('Angular is awesome!', 10)).toBe('Angular is ...');
  });

  it('should return the full string if within limit', () => {
    expect(pipe.transform('Short text', 20)).toBe('Short text');
  });

  it('should use a custom ellipsis if provided', () => {
    expect(pipe.transform('Angular is powerful', 10, '>>>')).toBe('Angular is >>>');
  });

  it('should return an empty string when given null', () => {
    expect(pipe.transform(null, 10)).toBe('');
  });

  it('should return an empty string when given undefined', () => {
    expect(pipe.transform(undefined, 10)).toBe('');
  });

  it('should handle zero length limit correctly', () => {
    expect(pipe.transform('Test String', 0)).toBe('...');
  });

  it('should return the full string when the limit is greater than the string length', () => {
    expect(pipe.transform('Angular', 10)).toBe('Angular');
  });

  it('should return an empty string when the input is an empty string', () => {
    expect(pipe.transform('', 10)).toBe('');
  });
});
