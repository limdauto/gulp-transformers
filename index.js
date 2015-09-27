'use strict';

const browserify  = require('browserify');
const through     = require('through2');

/**
 * Function streamifies browserify and associated transforms' output
 *
 * @param {Array} transformers the list of transformers to run the source through
 * @return {Stream} a readable stream
 */
function _bundleStream(transformers) {
    return through.obj((file, enc, next) => {
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

module.exports = {
    /**
     * @return {Stream} a readable stream which is the output of
     *      vanilla browserify bundle
     */
    none() {
        return _bundleStream([]);
    },
    /**
     * @return {Stream} a readable stream which is the final output of browserify.bundle
     *      after all transforms
     */
    get() {
        if (arguments.length === 0) return this.none();

        let transformers = Object.keys(arguments).map(k => arguments[k]);
        return _bundleStream(transformers);
    }
};
