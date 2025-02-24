import { PathValuePipe } from './path-value.pipe';

describe('PathValuePipe', () => {
  let pipe: PathValuePipe;

  beforeEach(() => {
    pipe = new PathValuePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a direct property value', () => {
    const obj = { name: 'Alice' };
    expect(pipe.transform<typeof obj, string>(obj, 'name')).toBe('Alice');
  });

  it('should return a nested property value', () => {
    const obj = { user: { address: { city: 'New York' } } };
    expect(pipe.transform<typeof obj, string>(obj, 'user.address.city')).toBe('New York');
  });

  it('should return undefined for a missing property', () => {
    const obj = { user: { address: {} } };
    expect(pipe.transform<typeof obj, string>(obj, 'user.address.city')).toBeUndefined();
  });

  it('should return undefined if the field path is empty', () => {
    const obj = { user: { name: 'Alice' } };
    expect(pipe.transform<typeof obj, string>(obj, '')).toBeUndefined();
  });

  it('should return undefined if the object is null', () => {
    expect(pipe.transform<null, string>(null, 'name')).toBeUndefined();
  });

  it('should return undefined if the object is undefined', () => {
    expect(pipe.transform<undefined, string>(undefined, 'name')).toBeUndefined();
  });

  it('should return undefined if the path contains an invalid key', () => {
    const obj = { user: { name: 'Alice' } };
    expect(pipe.transform<typeof obj, string>(obj, 'user.age')).toBeUndefined();
  });

  it('should return an array value if the path points to an array', () => {
    const obj = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
    expect(pipe.transform<typeof obj, { name: string }[]>(obj, 'users')?.length).toBe(2);
  });

  it('should return a value from an array by index', () => {
    const obj = { users: [{ name: 'Alice' }, { name: 'Bob' }] };
    expect(pipe.transform<typeof obj, string>(obj, 'users.1.name')).toBe('Bob');
  });

  it('should return undefined if an array index is out of bounds', () => {
    const obj = { users: [{ name: 'Alice' }] };
    expect(pipe.transform<typeof obj, string>(obj, 'users.2.name')).toBeUndefined();
  });

  it('should handle objects with non-string keys', () => {
    const obj = { '123': { name: 'Alice' } };
    expect(pipe.transform<typeof obj, string>(obj, '123.name')).toBe('Alice');
  });

  it('should work with boolean values', () => {
    const obj = { isActive: true };
    expect(pipe.transform<typeof obj, boolean>(obj, 'isActive')).toBeTrue();
  });

  it('should work with number values', () => {
    const obj = { age: 30 };
    expect(pipe.transform<typeof obj, number>(obj, 'age')).toBe(30);
  });

  it('should work with null values in the object', () => {
    const obj = { user: { name: null } };
    expect(pipe.transform<typeof obj, null>(obj, 'user.name')).toBeNull();
  });

  it('should return undefined if accessing a nested property on a null value', () => {
    const obj = { user: { name: null } };
    expect(pipe.transform<typeof obj, string>(obj, 'user.name.first')).toBeUndefined();
  });
});
