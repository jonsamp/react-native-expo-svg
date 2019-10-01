const SVGO = require('svgo');
const startCase = require('lodash.startcase');
const { elements, attributes } = require('./dictionaries.js');
const { containsUnsupportedElements } = require('./errors');

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
  let svg = await optimizeSvg(data);

  if (containsUnsupportedElements(svg)) return;

  let usedElements = [];

  // replace all svg elements
  elements.forEach(el => {
    const opening = new RegExp(`<${el.element}`, 'g');
    const closing = new RegExp(`</${el.element}`, 'g');

    if (svg.match(opening)) {
      usedElements.push(el.rnElement);

      const result = svg
        .replace(opening, `<${el.rnElement}`)
        .replace(closing, `</${el.rnElement}`);
      svg = result;
    }
  });

  // replace all svg attributes
  attributes.forEach(attr => {
    if (svg.match(attr)) {
      const attrMatcher = new RegExp(attr, 'g');
      const upperCasedAttr = attr
        .split('-')
        .map(i => startCase(i))
        .join('');
      const camelCaseAttr =
        upperCasedAttr.charAt(0).toLowerCase() + upperCasedAttr.slice(1);
      const result = svg.replace(attrMatcher, camelCaseAttr);
      svg = result;
    }
  });

  // convert width and height to numbers
  const resultSvg = svg
    .replace(/width=\"(\d+)\"/, `width={$1}`)
    .replace(/height=\"(\d+)\"/, `height={$1}`);

  return {
    RNSvg: resultSvg,
    usedElements,
  };
}

module.exports = { optimizeSvg, convertSvg };
