"use strict";

module.exports = function pinyinliteFactory(dictData) {

var pinyinMapping = null;
var dSize = 0, srcChar = null, dstPinyin = null, dstPosition = null;

var initDict = function () {
  var item, chars;
  var i, imax, j, jmax;
  dSize = 0;
  srcChar = new Array(dictData.n);
  dstPinyin = new Array(dictData.n);
  pinyinMapping = new Array(dictData.dict.length);
  for (i = 0, imax = dictData.dict.length; i < imax; ++i) {
    item = dictData.dict[i];
    chars = item[1];
    pinyinMapping[i] = item[0];
    for (j = 0, jmax = chars.length; j < jmax; ++j) {
      // in this loop we fill two arrays:
      // srcChar = [汉,字,...]  (use char code)
      // dstPinyin = [han,zi,...]  (use pinyinMapping index)
      srcChar[dSize] = chars.charCodeAt(j);
      dstPinyin[dSize] = i;
      dSize++;
    }
  }
}

function quicksort(l, r) {
  var i = l, j = r;
  var tSrc = srcChar[i], tDst = dstPinyin[i];
  while (i < j) {
    while (srcChar[j] > tSrc && i < j) j--;
    if (i < j) {
      srcChar[i] = srcChar[j];
      dstPinyin[i] = dstPinyin[j];
      i++;
    }
    while (srcChar[i] < tSrc && i < j) i++;
    if (i < j) {
      srcChar[j] = srcChar[i];
      dstPinyin[j] = dstPinyin[i];
      j--;
    }
  }
  srcChar[i] = tSrc;
  dstPinyin[i] = tDst;
  i++; j--;
  if (i < r) quicksort(i, r);
  if (l < j) quicksort(l, j);
}

function binarySearch(charCode) {
  var midIdx, mid;
  var l = 0, r = dSize - 1;
  while (l <= r) {
    midIdx = (l + r) >> 1;
    mid = srcChar[midIdx];
    if (charCode < mid) {
      r = midIdx - 1;
    } else if (charCode > mid) {
      l = midIdx + 1;
    } else {
      return midIdx;
    }
  }
  return -1;
}

function mergeData() {
  // before:
  //   srcChar     = [a,b,b,b,c,d,d,d]
  //   dstPinyin   = [3,1,4,8,4,2,1,3]
  //
  // after:
  //   srcChar     = [a,b,c,d]
  //   dstPinyin   = [3,1,4,8,4,2,1,3] (not changed)
  //   dstPosition = [0,1,4,5]

  var lastChar = srcChar[0], lastIdx = 0;
  dstPosition = new Array(dSize);
  dstPosition[0] = 0;

  var i, imax;
  for (i = 1, imax = dSize; i < imax; ++i) {
    if (srcChar[i] !== lastChar) {
      lastIdx++;
      lastChar = srcChar[i];
      srcChar[lastIdx] = lastChar;
      dstPosition[lastIdx] = i;
    }
  }

  // add a boundary for convenience
  lastIdx++;
  srcChar[lastIdx] = 0x10FFFF;  // Unicode Plane #16 Max
  dstPosition[lastIdx] = i;

  // reduce array size
  dSize = lastIdx + 1;
  srcChar.length = dSize;
  dstPosition.length = dSize;
}

var init = function () {
  // first we make a list of mapping relationship
  initDict();
  // then we sort them in order to use binary search later
  quicksort(0, dSize - 1);
  // finally, we merge heteronyms
  mergeData();
}

var getPinyin = function pinyinlite (str, options) {
  if (typeof options === 'undefined') {
    options = {};
  }
  // FIXME: handle char code > 0xFFFF
  var result = new Array(str.length);
  var i, imax, j, jmax, k;
  var charCode, idx, iret;
  for (i = 0, imax = str.length; i < imax; ++i) {
    charCode = str.charCodeAt(i);
    if (charCode < 128) {
      if (options.keepUnrecognized
        || charCode >= 97 && charCode <= 122    // a-z
        || charCode >= 65 && charCode <= 90     // A-Z
        || charCode >= 48 && charCode <= 57     // 0-9
      ) {
        result[i] = [str.charAt(i)];
      } else {
        result[i] = [];
      }
    } else {
      idx = binarySearch(charCode);
      if (idx !== -1) {
        // we have n(n=jmax-j) heteronyms
        j = dstPosition[idx];
        jmax = dstPosition[idx + 1];
        iret = new Array(jmax - j);
        for (k = 0; j < jmax; ++j, ++k) {
          iret[k] = pinyinMapping[dstPinyin[j]];
        }
        result[i] = iret;
      } else {
        if (options.keepUnrecognized) {
          result[i] = [str.charAt(i)];
        } else {
          result[i] = [];
        }
      }
    }
  }
  return result;
};

init();

return getPinyin;

};
