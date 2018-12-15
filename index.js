#!/usr/bin/env node
const fs = require("fs");
const startCase = require("lodash.startcase");
const SVGO = require("svgo");
const svgo = new SVGO();
const PATH = require("path");

const [, , ...args] = process.argv;
const filename = args[0];

if (!filename) {
  console.log("Expected a file name.");
  console.log("Example usage:");
  console.log("");
  console.log("react-native-expo-svg test.svg");
  console.log("");
  return;
}

const isSvgFileName = !!filename.match(".svg");
if (!isSvgFileName) {
  console.log("Expected an SVG file name.");
  console.log("Example usage:");
  console.log("");
  console.log("react-native-expo-svg test.svg");
  console.log("");
  return;
}

fs.readFile(filename, "utf8", function(err, data) {
  if (err) {
    return console.log(err);
  }

  svgo.optimize(data, { path: "" }).then(function(result) {
    const svg = result.data;
    const newsvg = svg
      .replace(/<svg/g, "<Svg")
      .replace(/<circle/g, "<Svg.Circle")
      .replace(/<ellipse/g, "<Svg.Ellipse")
      .replace(/<g/g, "<Svg.G")
      .replace(/<text/g, "<Svg.Text")
      .replace(/<tSpan/g, "<Svg.TSpan")
      .replace(/<textPath/g, "<Svg.TextPath")
      .replace(/<path/g, "<Svg.Path")
      .replace(/<polygon/g, "<Svg.Polygon")
      .replace(/<polyline/g, "<Svg.Polyline")
      .replace(/<line/g, "<Svg.Line")
      .replace(/<rect/g, "<Svg.Rect")
      .replace(/<use/g, "<Svg.Use")
      .replace(/<image/g, "<Svg.Image")
      .replace(/<symbol/g, "<Svg.Symbol")
      .replace(/<defs/g, "<Svg.Defs")
      .replace(/<linearGradient/g, "<Svg.LinearGradient")
      .replace(/<radialGradient/g, "<Svg.RadialGradient")
      .replace(/<stop/g, "<Svg.Stop")
      .replace(/<clipPath/g, "<Svg.ClipPath")
      .replace(/<pattern/g, "<Svg.Pattern")
      .replace(/<mask/g, "<Svg.Mask")
      .replace(/<\/svg/g, "</Svg")
      .replace(/<\/circle/g, "</Svg.Circle")
      .replace(/<\/ellipse/g, "</Svg.Ellipse")
      .replace(/<\/g/g, "</Svg.G")
      .replace(/<\/text/g, "</Svg.Text")
      .replace(/<\/tSpan/g, "</Svg.TSpan")
      .replace(/<\/textPath/g, "</Svg.TextPath")
      .replace(/<\/path/g, "</Svg.Path")
      .replace(/<\/polygon/g, "</Svg.Polygon")
      .replace(/<\/polyline/g, "</Svg.Polyline")
      .replace(/<\/line/g, "</Svg.Line")
      .replace(/<\/rect/g, "</Svg.Rect")
      .replace(/<\/use/g, "</Svg.Use")
      .replace(/<\/image/g, "</Svg.Image")
      .replace(/<\/symbol/g, "</Svg.Symbol")
      .replace(/<\/defs/g, "</Svg.Defs")
      .replace(/<\/linearGradient/g, "</Svg.LinearGradient")
      .replace(/<\/radialGradient/g, "</Svg.RadialGradient")
      .replace(/<\/stop/g, "</Svg.Stop")
      .replace(/<\/clipPath/g, "</Svg.ClipPath")
      .replace(/<\/pattern/g, "</Svg.Pattern")
      .replace(/<\/mask/g, "</Svg.Mask")
      .replace(/fill\-rule/g, "fillRule")
      .replace(/xmlns\=\"http:\/\/www\.w3\.org\/2000\/svg\"/g, "");

    if (args[1] && args[1].match(/o/)) {
      console.log("");
      console.log(newsvg);
      console.log("");
    } else {
      const IconName =
        startCase(
          `${filename
            .replace(".svg", "")
            .replace(/-/g, "")
            .replace(/\s+/g, "")}`
        ) + "Icon";
      const expoSvgComponent = `
import React from 'react';
import PropTypes from 'prop-types';
import { Svg } from 'expo';

function ${IconName}() {
  return (
    ${newsvg}
  );
}

export default ${IconName};
`.trim();
      fs.writeFile(`${IconName}.js`, expoSvgComponent, "utf8", function(err) {
        if (err) return console.log(err);
        console.log("");
        console.log(`✨ Saved as ${IconName}.js`);
        console.log("");
      });
    }
  });
});
