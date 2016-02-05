var Benchmarker = require('./benchmarker.js');
var b = new Benchmarker();
var testString = '中文测试';

b.reset();
var pinyin = require('../src/pinyin.js')
b.printDelta('summerwish/lwpinyin(short) require');

b.reset();
pinyin(testString);
b.printDelta('summerwish/lwpinyin(short) first call');

b.reset();
pinyin(testString);
b.printDelta('summerwish/lwpinyin(short) second call');
