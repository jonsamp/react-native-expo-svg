const { unsupportedElements } = require('./dictionaries.js');

function fileNameProvided(filename) {
  if (!filename) {
    console.log('Expected a file name.');
    console.log('Example usage:');
    console.log('');
    console.log('react-native-expo-svg test.svg');
    console.log('');
    return false;
  }

  return true;
}

function isSvgFileName(filename) {
  const isSvgFileName = !!filename.match('.svg');
  if (!isSvgFileName) {
    console.log('Expected an SVG file name.');
    console.log('Example usage:');
    console.log('');
    console.log('react-native-expo-svg test.svg');
    console.log('');
    return false;
  }

  return true;
}

function containsUnsupportedElements(svg) {
  unsupportedElements.forEach(unsupportedEl => {
    if (!!svg.match(`<${unsupportedEl}`)) {
      throw new Error(
        `react-native-svg does not support <${unsupportedEl}>. You need to re-export your svg without this element. See all supported elements here: https://www.npmjs.com/package/react-native-svg#supported-elements`
      );
    }
  });

  return false;
}

module.exports = {
  isSvgFileName,
  fileNameProvided,
  containsUnsupportedElements,
};
