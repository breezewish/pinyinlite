/*

Getting started:

  npm install

  node search.js "zhw wangzhe"  # 指环王3：王者无敌
  node search.js "agan"         # 阿甘正传
  node search.js "qyqx"         # 千与千寻

*/

"use strict";

require('string_score');
const product = require('cartesian-product');
const argv = require('optimist').argv;
const _ = require('lodash');

const pinyinlite = require('../../');

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
    search: [name, ..._.uniq(
        product(pinyinlite(name).filter(p => p.length > 0))
          .map(item => item.join(' '))
    )],
  };
});

const input = argv._[0];
const scores = searchItems.map(item => {
  return {
    name: item.name,
    score: _.max(item.search.map(pinyin => pinyin.score(input))),
  };
})

console.log(scores
  .filter(i => i.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5)
  .map(item => item.name)
);
