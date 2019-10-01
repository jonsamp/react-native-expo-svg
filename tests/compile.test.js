const compile = require('../src/compile.js');

const args = ['invisibility-cloak.svg', '???', ['Svg', 'Path']];

test('compiles svg into a component', () => {
  const result = compile(...args);
  expect(result.svgComponent).toMatch("import React from 'react'");
  expect(result.svgComponent).toMatch('function InvisibilityCloakIcon()');
  expect(result.svgComponent).toMatch('export default InvisibilityCloakIcon');
});

test('includes appropriate elements from react-native-svg', () => {
  const result = compile(...args);
  expect(result.svgComponent).toMatch(
    "import { Svg, Path } from 'react-native-svg'"
  );
});

test('creates the correct file name', () => {
  const result = compile(...args);
  expect(result.iconName).toMatch('InvisibilityCloakIcon');
});
