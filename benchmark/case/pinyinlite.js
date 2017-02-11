const Benchmarker = require('../lib/benchmarker.js');
const b = new Benchmarker();
const sample = require('../sample.js');

b.reset();
const pinyinlite = require('../../src/pinyin.js');
b.recordDelta('breeswish/pinyinlite require');

b.reset();
pinyinlite(sample);
b.recordDelta('breeswish/pinyinlite first call');

b.reset();
pinyinlite(sample);
b.recordDelta('breeswish/pinyinlite second call');
