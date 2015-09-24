'use strict';

//const transformers = require('gulp-transformers');
const transformers = require('../../index');
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');

let babelify = {
    name: 'babelify',
    opts: { optional: ["runtime"]}
};
let uglifyify = {
    name: 'uglifyify'
};

gulp.task('default', () => {
    return gulp.src('./*.es6')
        .pipe(replace('{{msg}}', "'hello'"))
        .pipe(transformers.get([babelify, uglifyify]))
        .pipe(rename(path => path.extname = ".js"))
        .pipe(gulp.dest('./dist'));
});
