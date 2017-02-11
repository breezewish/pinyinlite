const Benchmarker = require('../lib/benchmarker.js');
const b = new Benchmarker();
const sample = require('../sample.js');

b.reset();
const hotooPinyin = require('pinyin/lib/web-pinyin.js');
b.recordDelta('hotoo/pinyin require');

b.reset();
hotooPinyin(sample, {
  heteronym: true,
  style: hotooPinyin.STYLE_NORMAL,
});
b.recordDelta('hotoo/pinyin first call');

b.reset();
hotooPinyin(sample, {
  heteronym: true,
  style: hotooPinyin.STYLE_NORMAL,
});
b.recordDelta('hotoo/pinyin second call');
