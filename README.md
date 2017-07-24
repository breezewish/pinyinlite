# pinyinlite

[![Build Status](https://travis-ci.org/breeswish/pinyinlite.svg?branch=master)](https://travis-ci.org/breeswish/pinyinlite) [![Coverage Status](https://coveralls.io/repos/github/breeswish/pinyinlite/badge.svg?branch=master)](https://coveralls.io/github/breeswish/pinyinlite?branch=master) [![Dependency Status](https://david-dm.org/breeswish/pinyinlite.svg)](https://david-dm.org/breeswish/pinyinlite) [![npm version](http://img.shields.io/npm/v/pinyinlite.svg?style=flat)](https://npmjs.org/package/pinyinlite "View this project on npm") [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

​最快 :zap: 而又轻量的 JavaScript 拼音库，适合在前后端实现拼音输入匹配。

- 内存占用最小（~ 2 MB）且最快（~ 10,000,000 字/s）的 JavaScript 拼音库。
- 字典包含约 2.7 万简体繁体字，覆盖全面（常用汉字不到五千个）。
- 体积小，gzip 后约 80 KB。
- 另提供基于【现代汉语通用字表（2013）】的常用字版，包含约 8000 个汉字，gzip 后 25 KB。
- 支持多音字。
- 没有任何依赖项。

## Usage

### Node.js

```bash
npm install pinyinlite
```

```js
var pinyinlite = require('pinyinlite');
pinyinlite('增长');
// => [ [ 'ceng', 'zeng' ], [ 'zhang', 'chang' ] ]
```

### In Browsers

```html
<script charset="UTF-8" src="dist/pinyinlite_full.min.js"></script>
<script>
console.log(pinyinlite('世界你好'));
// => [ [ 'shi' ], [ 'jie' ], [ 'ni' ], [ 'hao' ] ]
</script>
```

引用脚本时请务必保留 `charset="UTF-8"`，否则在部分浏览器中会由于编码识别错误而产生问题。

若要用体积更小的常用字版本，请改成引入 `dist/pinyinlite_common.min.js`。

## Options

```js
pinyinlite(str, options)
```

#### options.keepUnrecognized

是否保留无法获得拼音的全角字符和半角标点符号，默认为 `false`，即不保留，相应位置将是空数组。

字母和数字总是会原样输出。

```js
pinyinlite('4C，测试');
// => [ [ '4' ], [ 'C' ], [], [ 'ce' ], [ 'shi' ] ]

pinyinlite('4C，测试', {
  keepUnrecognized: true
});
// => [ [ '4' ], [ 'C' ], [ '，' ], [ 'ce' ], [ 'shi' ] ]
```

## FAQ

#### Q: 什么功能是不支持的?

以下功能现在不支持、未来也不会支持：

- 智能选择多音字的拼音
- 音调

以下功能现在不支持、未来可以支持：

- 兼容 Unicode BMP 以外的汉字
- 给出的拼音按照频率排序

#### Q: 为什么不支持音调？

这个拼音库用于提供基于拼音的搜索和匹配，例如实现支持拼音筛选的自动完成组件等，因此不需要音调。

#### Q: 为什么不支持智能选择多音字？

如上所述，这个拼音库用于提供基于拼音的搜索和匹配。在这种场景下，最重要的是确保用户输入的各种有效的拼音都能被对应到候选项上去，而不是尽可能地只使用一个准确的拼音去匹配用户的输入。

使用准确拼音进行匹配是不现实的：

- 例如专有名词中一般有固有发音，词典覆盖各种特殊情况是不现实的，另外带来的体积极度膨胀也是不科学的。
- 用户很可能会输入不准确的拼音，例如地域、个人习惯、方言等因素会影响用户多音字的读音，因此即使程序生成了一个准确的拼音，将它与用户的输入进行“相似度匹配”也是不合理的，很可能会出现预期项被漏匹配的情况。

#### Q: 我就想用音调或者智能多音字，有没有什么替代?

请移步其他项目，例如 [hotoo/pinyin](https://github.com/hotoo/pinyin/)。

#### Q: 为什么 Unicode BMP 以外的汉字没有支持?

需求太小，懒得实现。若您的确需要完整的 UTF-16 支持，请开 issue。

## Examples

### 拼音模糊搜索 (examples/fuzzy-pinyin-search)

对豆瓣 Top N 电影进行全拼或拼音首字母搜索。

```bash
$ cd examples/fuzzy-pinyin-search
$ npm install

$ node search.js zhw
[ '指环王3：王者无敌', '指环王1：魔戒再现', '指环王2：双塔奇兵' ]

$ node search.js "zhw wangzhe"
[ '指环王3：王者无敌' ]

$ node search.js agzz
[ '阿甘正传' ]

$ node search.js tian
[ '天使爱美丽', '天空之城', '天堂电影院', '放牛班的春天', '泰坦尼克号' ]

$ node search.js vzi   
[ 'V字仇杀队' ]
```

实现原理：

1. 对于每个候选项，生成它所有可能的读音组合(这个库的核心思想)，即通过 pinyinlite 生成各个字的所有候选读音，然后进行笛卡尔积。
2. 使用 [string_score](https://github.com/joshaven/string_score) 对这些读音组合与用户的输入进行相似度匹配。
3. 选择相似度最高的几个候选项输出。

## 为什么这个库这么快这么小?

太长不看版：合适的算法和数据结构、针对 JavaScript 引擎特性的定制优化。

完整版：

-   为了减小冗余，字典按照 `[[拼音,该拼音的所有候选字],..]` 存储在源文件中。当然这样的结构也使得 JavaScript 引擎能很快地解析文件。

-   首次运行时对字典进行初始化。

    1. 字典被变幻成以下两个数组：

       ```js
       char:     [汉 , 字,  世 , 界 , 你, 好 ,...]   // 内存中为 charCode
       pinyin:   [han, zi, shi, jie, ni, hao,...]   // 内存中为 index
       ```

    2. 按照汉字 charCode 对两个数组同步地进行排序。另外存储在源文件中的字典是有序的，可降低排序量。排序后，多音字会变成邻居，结构类似于下面这样：

       ```js
       char:     [世 ,  界 , 降   , 降   , 你, 好 , ...]
       pinyin:   [shi, jie, jiang, xiang, ni, hao, ...]
                            ^^^^^^^^^^^^
       ```

    3. 对汉字进行紧缩并记录拼音区域，减少将来的搜索量：

       ```js
       char:     [世 ,  界 , 降          , 你, 好 , ...]
       pinyin:   [shi, jie, jiang, jiang, ni, hao, ...]
       position: [0  , 1  , 3           , 4 , 5  , ...]
                            ^^^^^^^^^^^^
       ```

-   由于这三个数组都为紧密数值数组，因此内存占用非常小。

-   需要查询拼音时，对 `char` 数组进行二分查找，时间复杂度 O(logn)，然后 O(1) 取得所有候选拼音。

## Benchmark

```bash
cd pinyinlite
npm install
npm run benchmark
```

以下结果基于 Node.js v6.9.4, OS X v10.10.5:

| 测试项                 | 字典大小     | require() 内存和耗时    | 长句耗时      | 速度        |
| ------------------- | -------- | ------------------ | --------- | --------- |
| pinyinlite (full)   | ~27000 字 | +2.3 MB, 12.2 ms   | ~2.2 ms   | ~10^7 字/s |
| pinyinlite (common) | ~8000 字  | +1.0 MB, 7.3 ms    | ~2.3 ms   | ~10^7 字/s |
| hotoo/pinyin (web)  | ~3500 字  | +3.2 MB, 20.2 ms   | ~128.3 ms | ~10^6 字/s |
| hotoo/pinyin (node) | ~41000 字 | +32.4 MB, 196.7 ms | ~573.4 ms | ~10^5 字/s |

配置均为：标注全部多音字、不智能选择多音字，长句长度约 20000 字。

```bash
$ npm run benchmark

Running hotoopinyin-web...
{ 'hotoo/pinyin require': { time: 20.29, memory: 3274833.92 },
  'hotoo/pinyin first call': { time: 132.9, memory: 9616465.92 },
  'hotoo/pinyin second call': { time: 128.38, memory: 11864145.92 } }

Running hotoopinyin-full...
{ 'hotoo/pinyin require': { time: 196.7, memory: 32487751.68 },
  'hotoo/pinyin first call': { time: 626.3, memory: 19345817.6 },
  'hotoo/pinyin second call': { time: 573.43, memory: 3927777.28 } }

Running pinyinlite-common...
{ 'breeswish/pinyinlite require': { time: 7.34, memory: 1095884.8 },
  'breeswish/pinyinlite first call': { time: 5.95, memory: 2166988.8 },
  'breeswish/pinyinlite second call': { time: 2.3, memory: 946421.76 } }

Running pinyinlite-full...
{ 'breeswish/pinyinlite require': { time: 12.25, memory: 2319196.16 },
  'breeswish/pinyinlite first call': { time: 5.93, memory: 1806090.24 },
  'breeswish/pinyinlite second call': { time: 2.19, memory: 987136 } }
```

## Contribute

字典现已改成基于 [pinyin-data](https://github.com/mozillazg/pinyin-data) 生成，若要对原始字典提出修改，请直接向 [pinyin-data](https://github.com/mozillazg/pinyin-data) 发起 Pull Request。

若 [pinyin-data](https://github.com/mozillazg/pinyin-data) 已有更新，你希望本项目能用上最新字典，请执行以下命令并发起 Pull Request：

```bash
npm run gen:dict
npm run build
```

## License

MIT
