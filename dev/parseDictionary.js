'use strict';

const DICTIONARY_URL = 'https://rawgit.com/mozillazg/pinyin-data/master/pinyin.txt';

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const uniq = require('lodash.sorteduniq');
const argv = require('yargs').argv;
const symbolMap = require('./symbolMap.js');

let chars = [];
let dict = {};

function addDict(codePoint, pinyinList) {
  pinyinList.forEach(pinyinRaw => {
    if (codePoint >= 0x10000) {
      // non-BMP characters not supported
      return;
    }

    let valid = true;
    const pinyin = pinyinRaw.split('').map(c => {
      if (symbolMap[c] !== undefined) {
        return symbolMap[c];
      } else if (c.match(/[a-z]/)) {
        return c;
      } else {
        valid = false;
        return '';
      }
    }).join('');

    if (!valid) {
      return;
    }
    if (dict[pinyin] === undefined) {
      dict[pinyin] = [];
    }
    dict[pinyin].push(codePoint);
  });
}

Promise.resolve()
  .then(() => {
    if (argv.dict) {
      console.log('Using local dictionary %s', argv.dict);
      return fs.readFileSync(argv.dict, 'utf8');
    } else {
      console.log('Downloading latest dictionary from %s', DICTIONARY_URL);
      return request(DICTIONARY_URL);
    }
  })
  .then(dictStr => {
    console.log('Parsing dictionary...');
    dictStr.split('\n').forEach(line => {
      const match = line.trim().match(/^U\+([A-Z0-9]+): ([^#]+)#/);
      if (!match) {
        return;
      }
      const codePoint = parseInt(match[1], 16);
      const pinyin = match[2].trim().split(',');
      addDict(codePoint, pinyin);
    });
  })
  .then(() => {
    console.log('Writing target file...');
    let destDict = [];
    let dictSize = 0;
    for (let pinyin in dict) {
      let candidates = dict[pinyin];
      candidates.sort();
      candidates = uniq(candidates);
      candidates.forEach(cp => chars.push(cp));
      dictSize += candidates.length;
      destDict.push([pinyin, candidates.map(cp => String.fromCodePoint(cp)).join('')]);
    }
    fs.writeFileSync(path.resolve(__dirname, '../src/dict.js'), 'module.exports = ' + JSON.stringify({
      n: dictSize,
      dict: destDict,
    }) + ';');
  })
  .then(() => {
    chars.sort();
    console.log('Parsed %d characters', uniq(chars).length);
  });
