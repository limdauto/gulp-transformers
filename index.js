'use strict';

const browserify  = require('browserify');
const through     = require('through2');

/**
 * Chains browserify and associated transforms' output
 *
 * @param {Array} transformers the list of transformers to run the source through
 * @return {Stream} a readable stream
 */
function _bundleStream(transformers) {
  return through.obj(function (file, enc, next) {
    let chain = browserify(file);

    transformers.forEach(transformer => {
      chain = chain.transform(transformer.name, transformer.opts || {});
    });

    chain.bundle((err, res) => {
      if (err) {
        console.log(err);
        this.emit('end');
      } else {
        // assumes file.contents is a Buffer
        file.contents = res;
        next(null, file);
      }
    });
  });
}

/**
 * Produce a vanila browserify transformer if no transformer is specified
 * @return {Stream} a readable stream which is the output of
 *                  vanilla browserify bundle
 */
function none() {
  return _bundleStream([]);
}

/**
 * Produce a composite browserify transformer by chaining multiple smaller ones
 * @param {Array}
 * @return {Stream} a readable stream produced by a chain of
 *                  browserify transformers
 */
function get() {
  if (arguments.length === 0) return none();
  const transformers = Object.keys(arguments).map(k => arguments[k]);
  return _bundleStream(transformers);
};

const transfomers = {
  none: none,
  get: get
};

module.exports = transfomers;
