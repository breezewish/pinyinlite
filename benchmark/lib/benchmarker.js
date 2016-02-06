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
  const current = this.snap();
  return {
    time: current.time - this.initial.time,
    memory: current.memory - this.initial.memory,
  };
};

Benchmarker.prototype.recordDelta = function (name) {
  const delta = this.delta();
  process.send({
    name: name,
    data: delta,
  });
};

module.exports = Benchmarker;
