var pinyinlite = require('..');

var should = require('should');
var fs = require('fs');

var symbolMap = {
  'ā': 'a',
  'á': 'a',
  'ǎ': 'a',
  'à': 'a',
  'ē': 'e',
  'é': 'e',
  'ě': 'e',
  'è': 'e',
  'ō': 'o',
  'ó': 'o',
  'ǒ': 'o',
  'ò': 'o',
  'ī': 'i',
  'í': 'i',
  'ǐ': 'i',
  'ì': 'i',
  'ū': 'u',
  'ú': 'u',
  'ǔ': 'u',
  'ù': 'u',
  'ü': 'v',
  'ǖ': 'v',
  'ǘ': 'v',
  'ǚ': 'v',
  'ǜ': 'v',
};

function normalizePinyin(pinyin) {
  return pinyin.split('').map(function (symbol) {
    if (typeof symbolMap[symbol] !== 'undefined') {
      return symbolMap[symbol];
    } else {
      return symbol;
    }
  }).join('');
}

describe('pinyinlite()', function () {

  it('should output pinyin for common simplified characters', function () {
    var expected = [
      'ni/zen/me/hui/xing/zhao////ni/na/li/pei/xing/zhao/',
      'a/bao/shi/yi/zhi/yuan/gun/gun//ben/shou/ben/jiao/de/xiong/mao//shi/tian/di/xia/zui/re/xue/de/zhong/guo/xiong/mao//chao/ji/chong/bai/yu/huang/gong/de/jiao/hu//xian/he//tang/lang//ling/she//jin/hou/zhe/wu/wei/da/ming/ding/ding//wei/meng/wu/xia///dan/shi/ta/mei/tian/dei/zai/lao/ba/kai/de/mian/guan/bang/mang/da/gong//a/bao/wan/wan/mei/xiang/dao//wei/le/yao/can/guan/yi/chang/wu/lin/sheng/hui//ta/jing/ran/bei/xuan/zhong/wei/chuan/shuo/zhong/de/wu/lin/gao/shou//shen/long/da/xia///yao/kao/ta/lai/dui/fu/da/long/'
    ].join('/');
    var test = [
      '你怎么会姓赵！——你那里配姓赵！',
      '阿宝是一只圆滚滚、笨手笨脚的熊猫，是天底下最热血的中国熊猫，超级崇拜玉皇宫的娇虎、仙鹤、螳螂、灵蛇、金猴这五位大名鼎鼎“威猛五侠”，但是他每天得在老爸开的面馆帮忙打工。阿宝万万没想到，为了要参观一场武林盛会，他竟然被选中为传说中的武林高手“神龙大侠”，要靠他来对付大龙。',
    ].join('');
    var result = pinyinlite(test);
    expected.split('/').forEach(function (pinyin, index) {
      if (pinyin !== '') {
        result[index].should.containEql(pinyin);
      }
    });
  });

  it('should output pinyin for common traditional characters', function () {
    var expected = [
      'xi/wo/wang/yi//yang/liu/yi/yi//jin/wo/lai/si//yu/xue/fei/fei/',
      'bo/si/bei/a/la/bo/di/guo/zheng/fu/yi/hou//kai/shi/le/man/chang/de/yi/si/lan/hua/shi/dai//xian/jiao/zao/dao/ya/zhi//da/liang/xian/jiao/tu/qian/xi/dao/sha/mo/shen/chu/duo/bi//ya/zi/de/bei/zuo/wei/le/xian/jiao/de/bao/liu/di//tiao/jian/shi/jiao/na/yi/jiao/tu/shui//ji/qian/nian/lai/ya/zi/de/sui/ran/bu/duan/bei/yi/si/lan/hua//dan/zhi/jin/reng/you/wan/ming/xian/jiao/tu//bing/bao/liu/le/duo/chu/shen/miao/he/liang/zuo/ji/jing/zhi/ta/',
    ].join('/');
    var test = [
      '昔我往矣，楊柳依依。今我來思，雨雪霏霏。',
      '波斯被阿拉伯帝國征服以後，開始了漫長的伊斯蘭化時代，祆教遭到壓制，大量祆教徒遷徙到沙漠深處躲避。亞茲德被作爲了祆教的保留地，條件是繳納異教徒稅。幾千年來亞茲德雖然不斷被伊斯蘭化，但至今仍有萬名祆教徒，並保留了多處神廟和兩座寂靜之塔。',  // from byvoid
    ].join('');
    var result = pinyinlite(test);
    expected.split('/').forEach(function (pinyin, index) {
      if (pinyin !== '') {
        result[index].should.containEql(pinyin);
      }
    });
  });

  it('should output pinyin for common last names', function () {
    var names = '赵(zhào)/钱(qián)/孙(sūn)/李(lǐ)/周(zhōu)/吴(wú)/郑(zhèng)/王(wáng)/冯(féng)/陈(chén)/褚(chǔ)/卫(wèi)/蒋(jiǎng)/沈(shěn)/韩(hán)/杨(yáng)/朱(zhū)/秦(qín)/尤(yóu)/许(xǔ)/何(hé)/吕(lǚ)/施(shī)/张(zhāng)/孔(kǒng)/曹(cáo)/严(yán)/华(huà)/金(jīn)/魏(wèi)/陶(táo)/姜(jiāng)/戚(qī)/谢(xiè)/邹(zōu)/喻(yù)/柏(bǎi)/水(shuǐ)/窦(dòu)/章(zhāng)/云(yún)/苏(sū)/潘(pān)/葛(gě)/奚(xī)/范(fàn)/彭(péng)/郎(láng)/鲁(lǔ)/韦(wéi)/昌(chāng)/马(mǎ)/苗(miáo)/凤(fèng)/花(huā)/方(fāng)/俞(yú)/任(rèn)/袁(yuán)/柳(liǔ)/酆(fēng)/鲍(bào)/史(shǐ)/唐(táng)/费(fèi)/廉(lián)/岑(cén)/薛(xuē)/雷(léi)/贺(hè)/倪(ní)/汤(tāng)/滕(téng)/殷(yīn)/罗(luó)/毕(bì)/郝(hǎo)/邬(wū)/安(ān)/常(cháng)/乐(yuè)/于(yú)/时(shí)/傅(fù)/皮(pí)/卞(biàn)/齐(qí)/康(kāng)/伍(wǔ)/余(yú)/元(yuán)/卜(bǔ)/顾(gù)/孟(mèng)/平(píng)/黄(huáng)/和(hé)/穆(mù)/萧(xiāo)/尹(yǐn)/姚(yáo)/邵(shào)/湛(zhàn)/汪(wāng)/祁(qí)/毛(máo)/禹(yǔ)/狄(dí)/米(mǐ)/贝(bèi)/明(míng)/臧(zāng)/计(jì)/伏(fú)/成(chéng)/戴(dài)/谈(tán)/宋(sòng)/茅(máo)/庞(páng)/熊(xióng)/纪(jì)/舒(shū)/屈(qū)/项(xiàng)/祝(zhù)/董(dǒng)/梁(liáng)/杜(dù)/阮(ruǎn)/蓝(lán)/闵(mǐn)/席(xí)/季(jì)/麻(má)/强(qiáng)/贾(jiǎ)/路(lù)/娄(lóu)/危(wēi)/江(jiāng)/童(tóng)/颜(yán)/郭(guō)/梅(méi)/盛(shèng)/林(lín)/刁(diāo)/钟(zhōng)/徐(xú)/邱(qiū)/骆(luò)/高(gāo)/夏(xià)/蔡(cài)/田(tián)/樊(fán)/胡(hú)/凌(líng)/霍(huò)/虞(yú)/万(wàn)/支(zhī)/柯(kē)/昝(zǎn)/管(guǎn)/卢(lú)/莫(mò)/经(jīng)/房(fáng)/裘(qiú)/缪(miào)/干(gān)/解(xiè)/应(yīng)/宗(zōng)/丁(dīng)/宣(xuān)/贲(bēn)/邓(dèng)/郁(yù)/单(shàn)/杭(háng)/洪(hóng)/包(bāo)/诸(zhū)/左(zuǒ)/石(shí)/崔(cuī)/吉(jí)/钮(niǔ)/龚(gōng)/程(chéng)/嵇(jī)/邢(xíng)/滑(huá)/裴(péi)/陆(lù)/荣(róng)/翁(wēng)/荀(xún)/羊(yáng)/於(yū)/惠(huì)/甄(zhēn)/曲(qū)/家(jiā)/封(fēng)/芮(ruì)/羿(yì)/储(chǔ)/靳(jìn)/汲(jí)/邴(bǐng)/糜(mí)/松(sōng)/井(jǐng)/段(duàn)/富(fù)/巫(wū)/乌(wū)/焦(jiāo)/巴(bā)/弓(gōng)/牧(mù)/隗(kuí)/山(shān)/谷(gǔ)/车(chē)/侯(hóu)/宓(mì)/蓬(péng)/全(quán)/郗(xī)/班(bān)/仰(yǎng)/秋(qiū)/仲(zhòng)/伊(yī)/宫(gōng)/宁(nìng)/仇(qiú)/栾(luán)/暴(bào)/甘(gān)/钭(dǒu)/厉(lì)/戎(róng)/祖(zǔ)/武(wǔ)/符(fú)/刘(liú)/景(jǐng)/詹(zhān)/束(shù)/龙(lóng)/叶(yè)/幸(xìng)/司(sī)/韶(sháo)/郜(gào)/黎(lí)/蓟(jì)/薄(bó)/印(yìn)/宿(sù)/白(bái)/怀(huái)/蒲(pú)/邰(tái)/从(cóng)/鄂(è)/索(suǒ)/咸(xián)/籍(jí)/赖(lài)/卓(zhuó)/蔺(lìn)/屠(tú)/蒙(méng)/池(chí)/乔(qiáo)/阴(yīn)/鬱(yù)/胥(xū)/能(nài)/苍(cāng)/双(shuāng)/闻(wén)/莘(shēn)/党(dǎng)/翟(zhái)/谭(tán)/贡(gòng)/劳(láo)/逄(páng)/姬(jī)/申(shēn)/扶(fú)/堵(dǔ)/冉(rǎn)/宰(zǎi)/郦(lì)/雍(yōng)/郤(xì)/璩(qú)/桑(sāng)/桂(guì)/濮(pú)/牛(niú)/寿(shòu)/通(tōng)/边(biān)/扈(hù)/燕(yān)/冀(jì)/郏(jiá)/浦(pǔ)/尚(shàng)/农(nóng)/温(wēn)/别(bié)/庄(zhuāng)/晏(yàn)/柴(chái)/瞿(qú)/阎(yán)/充(chōng)/慕(mù)/连(lián)/茹(rú)/习(xí)/宦(huàn)/艾(ài)/鱼(yú)/容(róng)/向(xiàng)/古(gǔ)/易(yì)/慎(shèn)/戈(gē)/廖(liào)/庾(yǔ)/终(zhōng)/暨(jì)/居(jū)/衡(héng)/步(bù)/都(dū)/耿(gěng)/满(mǎn)/弘(hóng)/匡(kuāng)/国(guó)/文(wén)/寇(kòu)/广(guǎng)/禄(lù)/阙(quē)/东(dōng)/欧(ōu)/殳(shū)/沃(wò)/利(lì)/蔚(wèi)/越(yuè)/夔(kuí)/隆(lóng)/师(shī)/巩(gǒng)/厍(shè)/聂(niè)/晁(cháo)/勾(gōu)/敖(áo)/融(róng)/冷(lěng)/訾(zǐ)/辛(xīn)/阚(kàn)/那(nā)/简(jiǎn)/饶(ráo)/空(kōng)/曾(zēng)/母(mǔ)/沙(shā)/乜(niè)/养(yǎng)/鞠(jū)/须(xū)/丰(fēng)/巢(cháo)/关(guān)/蒯(kuǎi)/相(xiàng)/查(zhā)/后(hòu)/荆(jīng)/红(hóng)/游(yóu)/竺(zhú)/权(quán)/逯(lù)/盖(gài)/益(yì)/桓(huán)/公(gōng)';
    names.split('/').forEach(function (item) {
      var p = item.match(/^(.)\((.*?)\)$/);
      pinyinlite(p[1])[0].should.containEql(normalizePinyin(p[2]));
    });
  });

  it('should output all candidate pinyin for heteronyms', function () {
    this.timeout(60000);
    var dictContent = fs.readFileSync(`${__dirname}/../dev/dict.txt`).toString().split('\n');
    dictContent.forEach(function (line) {
      if (line.indexOf(' ') === -1) {
        return;
      }
      var p = line.split(' ');
      if (p.length === 2 && p[1].length > 0) {
        var result = pinyinlite(p[1]);
        var pinyin = p[0].replace(/\d/g, '');
        result.forEach(function (r, i) {
          r.should.containEql(pinyin)
        });
      }
    });
  });

  it('should support options.keepUnrecognized', function () {
    var expected = '《/a/Q/zheng/zhuan/》';
    var test = '《阿Q正传》';
    var result = pinyinlite(test, {
      keepUnrecognized: true,
    });
    expected.split('/').forEach(function (pinyin, index) {
      if (pinyin !== '') {
        result[index].should.containEql(pinyin);
      }
    });
  });

});
