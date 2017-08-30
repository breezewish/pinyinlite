'use strict';

const DICTIONARY_URL = 'https://rawgit.com/mozillazg/pinyin-data/master/pinyin.txt';
const CHAR_RANGE_URL = 'https://rawgit.com/mozillazg/pinyin-data/master/kMandarin_8105.txt';

const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');
const uniq = require('lodash.sorteduniq');
const sortedIndexOf = require('lodash.sortedindexof');
const argv = require('yargs').argv;
const symbolMap = require('./symbolMap.js');

const ranges = {
  full: null,
  common: [],
};
const dicts = {
  full: {},
  common: {},
};
const chars = {
  full: [],
  common: [],
};
const dictTypes = Object.keys(ranges);

function cachedRequest(url) {
  const fileName = path.basename(url);
  const cachePath = `.cache_${fileName}`;
  if (argv.cache !== 'off') {
    try {
      const stat = fs.statSync(cachePath);
      if (Date.now() - stat.mtime.getTime() <= 1 * 24 * 60 * 60 * 1000 /* 1 day */) {
        console.log('Using cached content for %s', url);
        return Promise.resolve(fs.readFileSync(cachePath, 'utf-8'));
      }
    } catch (ignore) {
    }
  }
  const req = request(url);
  return req.then(str => {
    fs.writeFileSync(cachePath, str);
    return str;
  });
}

function parseSource(sourceStr) {
  const ret = [];
  sourceStr.split('\n').forEach(line => {
    const match = line.trim().match(/^U\+([A-Z0-9]+): ([^#]+)#/);
    if (!match) {
      return;
    }
    const codePoint = parseInt(match[1], 16);
    const pinyin = match[2].trim().split(',');
    ret.push({ codePoint: codePoint, pinyin: pinyin });
  });
  return ret;
}

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
        console.warn('[Code Point = %d] Invalid character `%s` (\\u%s) after applying mapping for `%s`', codePoint, c, ('0000' + c.charCodeAt(0).toString(16)).slice(-4), pinyinRaw);
        valid = false;
        return '';
      }
    }).join('');

    if (!valid) {
      return;
    }

    dictTypes.forEach(dictType => {
      // exclude in this dict type
      if (ranges[dictType] !== null) {
        if (sortedIndexOf(ranges[dictType], codePoint) === -1) {
          return;
        }
      }
      if (dicts[dictType][pinyin] === undefined) {
        dicts[dictType][pinyin] = [];
      }
      dicts[dictType][pinyin].push(codePoint);
      chars[dictType].push(codePoint);
    });
  });
}

Promise.resolve()
  .then(() => {
    console.log('Downloading common characters from %s', CHAR_RANGE_URL);
    return cachedRequest(CHAR_RANGE_URL);
  })
  .then(rangeStr => {
    const source = parseSource(rangeStr);
    ranges.common = source.map(d => d.codePoint);
    ranges.common.sort();
  })
  .then(() => {
    console.log('Downloading latest dictionary from %s', DICTIONARY_URL);
    return cachedRequest(DICTIONARY_URL);
  })
  .then(dictStr => {
    console.log('Parsing dictionary...');
    const source = parseSource(dictStr);
    source.forEach(r => addDict(r.codePoint, r.pinyin));
  })
  .then(() => {
    console.log('Writing target file...');
    dictTypes.forEach(dictType => {
      console.log('Generating dict %s...', dictType);
      let destDict = [];
      let dictSize = 0;
      for (let pinyin in dicts[dictType]) {
        let candidates = dicts[dictType][pinyin];
        candidates.sort();
        candidates = uniq(candidates);
        dictSize += candidates.length;
        destDict.push([pinyin, candidates.map(cp => String.fromCodePoint(cp)).join('')]);
      }
      fs.writeFileSync(path.resolve(__dirname, `../src/dict_${dictType}.js`), 'module.exports = ' + JSON.stringify({
        n: dictSize,
        dict: destDict,
      }) + ';');
      chars[dictType].sort();
      console.log('Added %d characters to the dict %s.', uniq(chars[dictType]).length, dictType);
    });
  });
