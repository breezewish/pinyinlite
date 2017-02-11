# pinyinlite

[![Build Status](https://travis-ci.org/breeswish/pinyinlite.svg?branch=master)](https://travis-ci.org/breeswish/pinyinlite) [![Coverage Status](https://coveralls.io/repos/github/breeswish/pinyinlite/badge.svg?branch=master)](https://coveralls.io/github/breeswish/pinyinlite?branch=master) [![Dependency Status](https://david-dm.org/breeswish/pinyinlite.svg)](https://david-dm.org/breeswish/pinyinlite) [![npm version](http://img.shields.io/npm/v/pinyinlite.svg?style=flat)](https://npmjs.org/package/pinyinlite "View this project on npm") [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

最快且轻量的 JavaScript 拼音库，用于在前后端提供基于拼音的字符串匹配。

```bash
npm install pinyinlite
```

## 特点

- 字典包含 2.4 万多个简体繁体字，覆盖 Unicode BMP 常见汉字。
- 体积小（minified ~ 80KB, gzip ~ 55 KB）。
- 内存占用极低（~ 1 MB），效率极高（~ 10,000,000 字/s）。
- 支持多音字。
- 没有任何依赖项。

#### 不支持且不计划支持的功能

- 智能选择多音字的拼音。

- 音调。

## Q & A

#### Q: 为什么不支持音调？

这个拼音库用于提供基于拼音的搜索和匹配，例如实现支持拼音筛选的自动完成组件等，因此不需要音调。

#### Q: 为什么不支持智能选择多音字？

如上所述，这个拼音库用于提供基于拼音的搜索和匹配。在这种场景下，最重要的是确保用户输入的各种有效的拼音都能被对应到候选项上去，而不是尽可能地只使用一个准确的拼音去匹配用户的输入。

使用准确拼音匹配是不现实的：

- 例如专有名词中一般有固有发音，词典覆盖各种特殊情况是不现实的，另外带来的体积极度膨胀也是不科学的。

- 用户很可能会输入不准确的拼音，例如地域、个人习惯、方言等因素会影响用户多音字的读音，因此即使程序生成了一个准确的拼音，将它与用户的输入进行“相似度匹配”也是不合理的，很可能会出现预期项被漏匹配的情况。

#### Q: 我就想用音调或者智能多音字，有没有什么替代?

请移步其他项目：https://github.com/hotoo/pinyin/

## 使用方法

### Node.js

```js
var pinyinlite = require('pinyinlite');
pinyinlite('增长');
// => [ [ 'zeng' ], [ 'zhang', 'chang' ] ]
```

### 浏览器

```html
<script charset="UTF-8" src="dist/pinyinlite.min.js"></script>
<script>
console.log(pinyinlite('世界你好'));
// => [ [ 'shi' ], [ 'jie' ], [ 'ni' ], [ 'hao' ]]
</script>
```

引用脚本时请务必保留 `charset="UTF-8"`，否则在部分浏览器中会由于编码识别错误而产生问题。

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

## 应用举例

### 拼音模糊搜索 (examples/fuzzy-pinyin-search.js)

支持全拼或拼音首字母搜索。算法：

1. 对于每个候选项，生成它所有可能的读音组合(这个库的核心思想)，即通过 pinyinlite 生成各个字的所有候选读音，然后进行笛卡尔积。

2. 使用 [string_score](https://github.com/joshaven/string_score) 对这些读音组合与用户的输入进行相似度匹配。

3. 选择相似度最高的几个候选项输出。

```js
const items = [
  "肖申克的救赎", "这个杀手不太冷", "阿甘正传", "霸王别姬", "美丽人生", "海上钢琴师", "辛德勒的名单", "千与千寻",
  "机器人总动员", "盗梦空间", "泰坦尼克号", "三傻大闹宝莱坞", "放牛班的春天", "忠犬八公的故事", "龙猫", "教父",
  "大话西游之大圣娶亲", "乱世佳人", "天堂电影院", "当幸福来敲门", "搏击俱乐部", "楚门的世界", "触不可及", "指环王3：王者无敌",
  "罗马假日", "十二怒汉", "两杆大烟枪", "海豚湾", "天空之城", "飞屋环游记", "怦然心动", "飞越疯人院", "大话西游之月光宝盒",
  "鬼子来了", "窃听风暴", "无间道", "V字仇杀队", "天使爱美丽", "蝙蝠侠：黑暗骑士", "闻香识女人", "熔炉", "少年派的奇幻漂流",
  "活着", "美丽心灵", "指环王1：魔戒再现", "指环王2：双塔奇兵", "教父2", "七宗罪", "哈尔的移动城堡", "剪刀手爱德华",
];

const searchItems = items.map(name => {
  return {
    name: name,
    search: [name, ..._.uniq(product(pinyinlite(name).filter(p => p.length > 0)).map(item => item.join(' ')))]
  };
});

const input = argv._[0];
const scores = searchItems.map(item => {
  return {
    name: item.name,
    score: _.max(item.search.map(pinyin => pinyin.score(input)))
  };
})

console.log(scores.filter(i => i.score > 0).sort((a, b) => b.score - a.score).slice(0, 5).map(item => item.name));
```

```bash
$ node fuzzy-pinyin-search.js zhw
[ '指环王3：王者无敌', '指环王1：魔戒再现', '指环王2：双塔奇兵' ]

$ node fuzzy-pinyin-search.js "zhw wangzhe"
[ '指环王3：王者无敌' ]

$ node fuzzy-pinyin-search.js agzz
[ '阿甘正传' ]

$ node fuzzy-pinyin-search.js tian
[ '天使爱美丽', '天空之城', '天堂电影院', '放牛班的春天', '泰坦尼克号' ]

$ node fuzzy-pinyin-search.js vzi   
[ 'V字仇杀队' ]
```

## Benchmark

```bash
cd pinyinlite
npm install
npm run benchmark
```

以下结果基于 Node.js v6.3.1, OS X v10.10.5:

| 测试项                 | 字典大小     | require() 内存和耗时    | 长句耗时      | 速度        |
| ------------------- | -------- | ------------------ | --------- | --------- |
| pinyinlite          | ~24000 字 | +1.4 MB, 9.1 ms    | ~1.9 ms   | ~10^7 字/s |
| hotoo/pinyin (web)  | ~3500 字  | +2.1 MB, 10.0 ms   | ~17.1 ms  | ~10^6 字/s |
| hotoo/pinyin (node) | ~41000 字 | +32.3 MB, 123.5 ms | ~184.8 ms | ~10^5 字/s |

配置均为：标注全部多音字、不智能选择多音字，长句长度约 20000 字。

## 开发

### 更新字典

字典源文件位于 `dev/dict.txt`。

更新字典源文件后需要调用 `node dev/parse_dict.txt` 生成相应的 `src/dict.js`。

### 运行测试

```bash
npm test
```

## License

MIT
