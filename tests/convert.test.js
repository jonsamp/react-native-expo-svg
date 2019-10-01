const { optimizeSvg, convertSvg } = require('../src/convert.js');
const testSvgData = require('./test.svg');

test('optimizes svg', async () => {
  const result = await optimizeSvg(testSvgData);
  expect(!!result.match('xmlns')).toBe(false);
});

test('retains viewBox attribute when optimized', async () => {
  const result = await optimizeSvg(testSvgData);
  expect(!!result.match('viewBox')).toBe(true);
});

test('returns used elements', async () => {
  const result = await convertSvg(testSvgData);

  expect(result.usedElements).toContain('Svg', 'Path');
});

test('converts svg elements to title case', async () => {
  const result = await convertSvg(testSvgData);

  result.usedElements.forEach(el => {
    const openingSvg = new RegExp(`</${el.toLowerCase()}`, 'g');
    const openingRN = new RegExp(`<${el}`, 'g');

    expect(result.RNSvg).not.toMatch(openingSvg);
    expect(result.RNSvg).toMatch(openingRN);
  });
});

test('converts svg attributes to camel case', async () => {
  const result = await convertSvg(testSvgData);

  expect(result.RNSvg).toMatch('fillRule');
});

test('converts width and height to numbers', async () => {
  const result = await convertSvg(testSvgData);

  expect(result.RNSvg).toMatch('width={41}');
  expect(result.RNSvg).toMatch('height={32}');
});
