"use strict";

const fs = require('fs');
const path = require('path');

let pinyinAttr = {};

// ===========================
// parse dict

const dictText = fs.readFileSync(path.join(__dirname, './dict.txt')).toString();
const lines = dictText.split('\n');

for (const line of lines) {
  const spacePosition = line.indexOf(' ');
  if (spacePosition === -1) {
    continue;
  }
  const pinyin = line.substr(0, spacePosition).replace(/\d/g, '');
  const chars = line.substr(spacePosition + 1);

  if (chars.length === 0) {
    continue;
  }

  if (typeof pinyinAttr[pinyin] === 'undefined') {
    pinyinAttr[pinyin] = {
      pinyin: pinyin,
      chars: '',
    };
  }
  pinyinAttr[pinyin].chars += chars;
}

// ===========================
// compact and output JavaScript

const unique = function (arr) {
  let u = {};
  for (const v of arr) {
    u[v] = true;
  }
  return Object.keys(u);
};

let dictLines = [];
let charCounts = 0;

for (const pinyin in pinyinAttr) {
  const attr = pinyinAttr[pinyin];
  const chars = unique(attr.chars.split('')).sort().join(''); // sort
  dictLines.push([pinyin, chars]);
  charCounts += chars.length;  // TODO: fix codePoint > 0xFFFF
}

dictLines.sort((a, b) => a[1].localeCompare(b[1]));

fs.writeFileSync(path.join(__dirname, '../src/dict.js'), 'module.exports = ' + JSON.stringify({
  n: charCounts,
  dict: dictLines
}) + ';');
