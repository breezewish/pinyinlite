# pinyinlite

[![Dependency Status](https://david-dm.org/SummerWish/pinyinlite.svg)](https://david-dm.org/SummerWish/pinyinlite) [![npm version](http://img.shields.io/npm/v/pinyinlite.svg?style=flat)](https://npmjs.org/package/pinyinlite "View this project on npm") [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/pinyinlite.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pinyinlite/)

轻量级 JavaScript 拼音库，支持多音字，适合在前后端解决基于拼音的字符串匹配问题。

```js
npm install pinyinlite
```

## 特点

- Zero dependency!

- 收录简体繁体常见字，体积小巧（minified ~ 80KB, gzip ~ 55 KB）。

- 内存占用低（< 1 MB），效率高（~ 10,000,000 字/s）。

- 支持多音字。

- 不支持且不计划支持智能选择多音字拼音。

- 不支持且不计划支持音调。

## 使用方法

```js
var pinyinlite = require('pinyinlite');
pinyinlite('增长');
// => [ [ 'zeng' ], [ 'zhang', 'chang' ] ]
```

## 选项

```js
pinyinlite(str, options)
```

### options.keepUnrecognized

是否保留无法获得拼音的全角字符，默认为 `false`，即不保留（相应位置是空数组）。

注意，半角字符总是会原样输出。

```js
pinyinlite('4C，测试');
// => [ [ '4' ], [ 'C' ], [], [ 'ce' ], [ 'shi' ] ]

pinyinlite('4C，测试', {
  keepUnrecognized: true
});
// => [ [ '4' ], [ 'C' ], [ '，' ], [ 'ce' ], [ 'shi' ] ]
```

## Benchmark

|测试项               |字典大小   |require() 内存和耗时|长句耗时|速度      |
|--------------------|----------|------------------|-------|------------|
| pinyinlite         |~24000 字 |+970 KB, 10 ms    |~2 ms  |~10^7 字/s   |
|hutoo/pinyin (web)  |~3500 字  |+2100 KB, 11 ms   |~22 ms |~10^6 字/s   |
|hutoo/pinyin (node) |~41000 字 |+32530 KB, 132 ms |~210 ms|~10^5 字/s   |

配置均为：标注全部多音字、不智能选择多音字，长句长度约 20000 字（见 benchmark 目录）。

## 音调、智能多音字

如果你需要将拼音用于呈现，即需要多音字智能识别、音调等功能，请移步：https://github.com/hotoo/pinyin/

## 字典

字典源文件位于 `dev/dict.txt`。

更新字典源文件后需要使用 `node dev/parse_dict.txt` 生成相应的 `src/dict.js`。

## TODO

- [ ] test

## License

MIT