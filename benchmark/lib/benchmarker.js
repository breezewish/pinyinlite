"use strict";

function Benchmarker () {}

Benchmarker.prototype.snap = function () {
  return {
    time: Date.now(),
    memory: process.memoryUsage().rss,
  };
};

Benchmarker.prototype.reset = function () {
  this.initial = this.snap();
};

Benchmarker.prototype.delta = function () {
  var current = this.snap();
  return {
    time: current.time - this.initial.time,
    memory: current.memory - this.initial.memory,
  };
};

Benchmarker.prototype.printDelta = function (str) {
  var delta = this.delta();
  console.log('%s: +%s KB, +%s ms', str, Math.floor(delta.memory / 1000), delta.time);
};

module.exports = Benchmarker;
