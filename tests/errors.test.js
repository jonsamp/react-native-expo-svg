const {
  isSvgFileName,
  fileNameProvided,
  containsUnsupportedElements,
} = require('../src/errors.js');

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

test('succeeds without unsupported elements', () => {
  const result = containsUnsupportedElements('<svg><path /></svg>');
  expect(result).toBe(false);
});

test('fails with unsupported elements', () => {
  try {
    const result = containsUnsupportedElements('<svg><feDropShadow /></svg>');
    expect(result).toBe(false);
  } catch (error) {
    expect(error.toString()).toMatch(
      'Error: react-native-svg does not support <feDropShadow>. You need to re-export your svg without this element. See all supported elements here: https://www.npmjs.com/package/react-native-svg#supported-elements'
    );
  }
});
