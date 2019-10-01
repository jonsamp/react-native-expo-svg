const SVGO = require('svgo');
const startCase = require('lodash.startcase');
const { elements, attributes } = require('./dictionaries.js');
const { hasOnlySupportedElements } = require('./errors');

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

async function optimizeSvg(data) {
  const result = await svgo.optimize(data).catch(err => {
    console.error(
      'Error: Something went wrong while running svgo.optimize. Full error: ',
      err
    );
  });
  return result.data;
}

async function convertSvg(data) {
  const svg = await optimizeSvg(data);

  if (!hasOnlySupportedElements(svg)) return;

  let newsvg = svg;
  let usedElements = [];

  elements.forEach(el => {
    const opening = new RegExp(`<${el.element}`, 'g');
    const closing = new RegExp(`</${el.element}`, 'g');

    if (newsvg.match(opening)) {
      usedElements.push(el.rnElement);
    }

    const result = newsvg
      .replace(opening, `<${el.rnElement}`)
      .replace(closing, `</${el.rnElement}`);
    newsvg = result;
  });

  attributes.forEach(attr => {
    if (newsvg.match(attr)) {
      const attrMatcher = new RegExp(attr, 'g');
      const upperCasedAttr = attr
        .split('-')
        .map(i => startCase(i))
        .join('');
      const convertedAttr =
        upperCasedAttr.charAt(0).toLowerCase() + upperCasedAttr.slice(1);
      const result = newsvg.replace(attrMatcher, convertedAttr);
      newsvg = result;
    }
  });

  newsvg = newsvg
    .replace(/width=\"(\d+)\"/, `width={$1}`)
    .replace(/height=\"(\d+)\"/, `height={$1}`);

  return {
    RNSvg: newsvg,
    usedElements,
  };
}

module.exports = { optimizeSvg, convertSvg };
