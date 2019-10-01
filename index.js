#!/usr/bin/env node
const fs = require('fs');
const startCase = require('lodash.startcase');
const SVGO = require('svgo');
const svgo = new SVGO({
  plugins: [
    {
      removeViewBox: false,
    },
    {
      removeAttrs: { attrs: '(xmlns|xlink)' },
    },
  ],
});

const [, , ...args] = process.argv;
const filepath = args[0].split('/');
const filename = args[0];
const iconFileName = filepath[filepath.length - 1];

if (!filename) {
  console.log('Expected a file name.');
  console.log('Example usage:');
  console.log('');
  console.log('react-native-expo-svg test.svg');
  console.log('');
  return;
}

const isSvgFileName = !!filename.match('.svg');
if (!isSvgFileName) {
  console.log('Expected an SVG file name.');
  console.log('Example usage:');
  console.log('');
  console.log('react-native-expo-svg test.svg');
  console.log('');
  return;
}

fs.readFile(filename, 'utf8', function(err, data) {
  if (err) {
    return console.log(err);
  }

  svgo.optimize(data, { path: '' }).then(function(result) {
    const svg = result.data;
    if (svg.match(/\<filter/)) {
      console.log('🚨 Error');
      console.log(
        'react-native-svg does not support <filter />. Re-export your svg without the filter property.'
      );
    }

    const svgElements = [
      'svg',
      'path',
      'circle',
      'ellipse',
      'g',
      'text',
      'tSpan',
      'textPath',
      'polygon',
      'polyline',
      'line',
      'rect',
      'use',
      'image',
      'symbol',
      'defs',
      'linearGradient',
      'radialGradient',
      'stop',
      'clipPath',
      'pattern',
      'mask',
    ];

    const elements = svgElements.map(element => ({
      element,
      rnElement: startCase(element),
    }));

    let newsvg = svg;
    let usedElements = [];

    elements.forEach(el => {
      const opening = new RegExp(`<${el.element}`, 'g');
      const closing = new RegExp(`</${el.element}`, 'g');

      if (newsvg.match(opening)) {
        usedElements.push(el.rnElement);
      }

      let result = newsvg
        .replace(opening, `<${el.rnElement}`)
        .replace(closing, `</${el.rnElement}`);
      newsvg = result;
    });

    newsvg = newsvg
      .replace(/fill\-rule/g, 'fillRule')
      .replace(/clip\-rule/g, 'clipRule')
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/width\=\"(\d+)\"/, `width={$1}`)
      .replace(/height\=\"(\d+)\"/, `height={$1}`);

    if (args[1] && args[1].match(/o/)) {
      console.log('');
      console.log(newsvg);
      console.log('');
    } else {
      const IconName =
        startCase(`${iconFileName.replace('.svg', '')}`)
          .replace(/-/g, '')
          .replace(/\s+/g, '') + 'Icon';
      const expoSvgComponent = `
import React from 'react';
import { ${usedElements.join(', ')} } from 'react-native-svg'

function ${IconName}() {
  return (
    ${newsvg}
  );
}

export default ${IconName};
`.trim();
      fs.writeFile(`${IconName}.js`, expoSvgComponent, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log(`✨ Saved as ${IconName}.js in the current directory.`);
      });
    }
  });
});
