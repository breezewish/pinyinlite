# pinyinlite

[![Build Status](https://travis-ci.org/breeswish/pinyinlite.svg?branch=master)](https://travis-ci.org/breeswish/pinyinlite) [![Coverage Status](https://coveralls.io/repos/github/breeswish/pinyinlite/badge.svg?branch=master)](https://coveralls.io/github/breeswish/pinyinlite?branch=master) [![Dependency Status](https://david-dm.org/breeswish/pinyinlite.svg)](https://david-dm.org/breeswish/pinyinlite) [![npm version](http://img.shields.io/npm/v/pinyinlite.svg?style=flat)](https://npmjs.org/package/pinyinlite "View this project on npm") [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/pinyinlite.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pinyinlite/)

轻量级 JavaScript 拼音库，支持多音字，适合在前后端解决基于拼音的字符串匹配问题。

```bash
npm install pinyinlite
```

## 特点

- Zero dependency!

- 字典包含 2.4 万多个简体繁体字，覆盖 Unicode BMP 常见汉字。

- 体积小巧（minified ~ 80KB, gzip ~ 55 KB），适合前端使用。

- 内存占用低（~ 1 MB），效率高（~ 10,000,000 字/s），适合后端使用。

- 支持多音字。

- 不支持且不计划支持智能选择多音字拼音。

- 不支持且不计划支持音调。

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

支持全拼或拼音首字母搜索。

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
npm run benchmark
```

|测试项               |字典大小   |require() 内存和耗时|长句耗时   |速度          |
|--------------------|----------|------------------|----------|-------------|
| pinyinlite         |~24000 字 |+1.2 MB, 9.1 ms    |~2.2 ms  |~10^7 字/s   |
|hotoo/pinyin (web)  |~3500 字  |+2.1 MB, 10.0 ms   |~17.1 ms |~10^6 字/s   |
|hotoo/pinyin (node) |~41000 字 |+32.3 MB, 123.5 ms |~184.8 ms|~10^5 字/s   |

配置均为：标注全部多音字、不智能选择多音字，长句长度约 20000 字。

## 音调、智能多音字

如果你需要将拼音用于呈现，即需要多音字智能识别、音调等功能，请移步：https://github.com/hotoo/pinyin/

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
