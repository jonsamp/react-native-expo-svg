const startCase = require('lodash.startcase');

function compile(filename, svg, usedElements) {
  const iconName =
    startCase(`${filename.replace('.svg', '')}`)
      .replace(/-/g, '')
      .replace(/\s+/g, '') + 'Icon';
  const svgComponent = `
import React from 'react';
import { ${usedElements.join(', ')} } from 'react-native-svg'

function ${iconName}() {
return (
  ${svg}
);
}

export default ${iconName};
`.trim();

  return {
    svgComponent,
    iconName,
  };
}

module.exports = compile;
