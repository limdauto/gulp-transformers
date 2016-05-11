## Quick start

### Install

```
npm install --save-dev gulp-transformers
```

### Usage

```javascript

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
    .pipe(transformers.get(babelify, uglifyify))
    .pipe(gulp.dest('./dist'));
};

```

For a more complicated example involving both pre-bundle and post-bundle processing, see [examples](https://github.com/limdauto/gulp-transformers/tree/master/examples).

**Notes**: This is a very thin wrapper around browserify transforms, so your problem will most certainly lie with the transform itself. Besides, don't forget to install them, e.g. `npm install babelify`

## API

### `transformers.get(...{name, opts})`

Type: `...Object`

This function expects objects containing a transform's name and its corresponding options. Pass as many in as you like :)

### `transformers.none()`

This function returns a bundle stream output by vanilla (no transform) browserify.

## Motivation

### What is a transformer?

A transformer in this context is a gulp-compatible `transform` supported by browserify. See a list of supported transforms here: https://github.com/substack/node-browserify/wiki/list-of-transforms

### What it means by gulp-compatible

Normal browserify transforms operate on standard Node's text stream. Gulp operates on streams of Vinyl file objects. You can read more about one way to interop between then two here: https://github.com/hughsk/vinyl-source-stream

### Why you may want this plugin

The history of using browserify with gulp has been a bit tricky. In the beginning, there was a plugin called `gulp-browserify` but it was soon blacklisted (and rightly so). Then [a popular tutorial](https://medium.com/@sogko/gulp-browserify-the-gulp-y-way-bb359b3f9623) popped up on Medium offering a way to accomplish this task through [vinyl-transform](https://www.npmjs.com/package/vinyl-transform). It looks pretty cool except for the fact that it has stopped working with newer browserify and, again, rightly so. The reason is `browserify.bundle` [returns a readable stream](https://github.com/substack/node-browserify/tree/37a805719dcf4d729fc7ff2b45bb6b01b367650b#bbundleopts-cb) where as vinyl-transform expects a duplex stream. Some related tickets for your amusement:

- https://github.com/substack/node-browserify/issues/1044
- https://github.com/substack/node-browserify/issues/1217
- https://github.com/substack/node-browserify/issues/1198*
- https://github.com/hughsk/vinyl-transform/issues/7

What about the official [recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md). Well, it works, but I don't like it for 2 reasons:

- It has the output of `browserify.bundle`, which is a text stream, on top of the pipeline while in gulp, I really want to have a Vinyl source stream on top, a.k.a what `gulp.src` returns, so I can use other gulp plugins to perform some pre-bundling work. Besides, using vanilla `gulp.src` will also save the `vinyl-source-stream` conversion step.
- It uses `watchify` to watch file change. If you have a reasonably sophisticated project, chances are you have already used `gulp.watch` somewhere. Bringing in another file watcher is undesirable.

Notice how I haven't even mentioned the fact that you may want to combine custom transforms, sometimes multiple in different ways in different places, on top of gulp and browserify. That's why I built this plugin to streamline the process. It puts browserify and gulp together in a reliable way and allow you to combine 3rd party transforms as painlessly as possible.

(\*) *I found ticket #1198 in node-browserify when doing some research for this README. The given advice in the ticket works but requires users to create a temporary file while in fact you don't need to at all. It goes to show how trying to make these tools work together will very likely confuse beginners, which is a shame because both `gulp` and `browserify` are very popular and beginner-friendly.*
