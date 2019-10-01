const { isSvgFileName, fileNameProvided } = require('../src/errors.js');

test('errors without .svg', () => {
  const result = isSvgFileName('test.png');
  expect(result).toBe(false);
});

test('succeeds with .svg', () => {
  const result = isSvgFileName('test.svg');
  expect(result).toBe(true);
});

test('errors without a filename', () => {
  const result = fileNameProvided(undefined);
  expect(result).toBe(false);
});

test('succeeds with filename', () => {
  const result = fileNameProvided('test.svg');
  expect(result).toBe(true);
});
