const { performance } = require('perf_hooks');

function speed() {
  return performance.now();
}

function runtime(seconds) {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s]
    .map(v => v < 10 ? '0' + v : v)
    .join(':');
}

module.exports = { speed, runtime };
