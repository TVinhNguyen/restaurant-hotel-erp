process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test-secret-key-with-minimum-length-32';

jest.setTimeout(30000);
