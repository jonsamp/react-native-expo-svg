#!/usr/bin/env node
const { isSvgFileName, fileNameProvided } = require('./src/errors.js');
const { convertSvg } = require('./src/convert.js');
const compile = require('./src/compile.js');
const fs = require('fs');

const [, , ...args] = process.argv;
const filepath = args[0].split('/');
const filename = args[0];
const iconFileName = filepath[filepath.length - 1];

if (!fileNameProvided(filename)) return;
if (!isSvgFileName(filename)) return;

fs.readFile(filename, 'utf8', async function(err, data) {
  if (err) {
    return console.error(err);
  }

  try {
    const { RNSvg, usedElements } = await convertSvg(data);

    const consoleOutputRequested = args[1] && args[1].match(/o/);
    if (consoleOutputRequested) {
      console.log('');
      console.log(RNSvg);
      console.log('');
    } else {
      const { svgComponent, iconName } = compile(
        iconFileName,
        RNSvg,
        usedElements
      );

      fs.writeFile(`${iconName}.js`, svgComponent, 'utf8', function(err) {
        if (err) return console.log(err);
        console.log(`💾 Saved as ${iconName}.js in the current directory.`);
      });
    }
  } catch (err) {
    console.error(err);
  }
});
