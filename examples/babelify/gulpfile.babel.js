'use strict';

const gulp = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const transformers = require('gulp-transformers');

const babelify = {
  name: 'babelify',
  opts: {
    presets: ["es2015"]
  }
};

const uglifyify = {
  name: 'uglifyify'
};

export function build() {
  return gulp.src('./*.es6')
    .pipe(replace('{{msg}}', "'hello'"))
    .pipe(transformers.get(babelify, uglifyify))
    .pipe(rename(path => path.extname = ".js"))
    .pipe(gulp.dest('./dist'));
};

export default build;
