"use strict";

const async = require('async');
const cp = require('child_process');
const testsAll = 100;

function runSingleCase(caseName, callback) {
  let results = {};
  async.timesSeries(testsAll, (i, next) => {
    const child = cp.fork(`${__dirname}/case/${caseName}.js`);
    child.on('message', (msg) => {
      if (typeof results[msg.name] === 'undefined') {
        results[msg.name] = {
          time: 0,
          memory: 0,
        };
      }
      results[msg.name].time += msg.data.time;
      results[msg.name].memory += msg.data.memory;
    });
    child.on('exit', () => {
      next();
    });
  }, () => {
    for (var key in results) {
      results[key].time /= testsAll;
      results[key].memory /= testsAll;
    }
    callback(null, results);
  });
}

runSingleCase('pinyinlite', function (err, results) {
  console.log(results);
});

runSingleCase('hotoopinyin-web', function (err, results) {
  console.log(results);
});

runSingleCase('hotoopinyin-full', function (err, results) {
  console.log(results);
});
