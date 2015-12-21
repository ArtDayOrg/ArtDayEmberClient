/* globals blanket, module */

var options = {
  modulePrefix: 'art-day',
  filter: '//.*(art-day).*/',
  antifilter: '//.*(tests|template|transitions|liquid).*/',
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    reporters: ['json'],
    autostart: true
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}