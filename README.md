# ES6 Babel Gulp Boilerplate

Structure to code NPM package with ES6, build by gulp+babel. Include test, lint, coverage.

[![Build Status](https://travis-ci.org/huytbt/es6-babel-gulp-boilerplate.svg?branch=master)](https://travis-ci.org/huytbt/es6-babel-gulp-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/huytbt/es6-babel-gulp-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/huytbt/es6-babel-gulp-boilerplate?branch=master)
[![License](https://img.shields.io/github/license/huytbt/es6-babel-gulp-boilerplate.svg)](https://github.com/huytbt/es6-babel-gulp-boilerplate/master/LICENSE)

## Initial setup

```bash
# Clone the repo...
git clone https://github.com/huytbt/es6-babel-gulp-boilerplate.git your_project_name
cd your_project_name

# Then, you need to install all the dependencies...
npm install

# If you wanna be able to use global command `gulp`...
npm install -g gulp
```

## Test

```bash
npm test
```

## Distribute

```bash
gulp build
```

## Remove Boilerplate git and add your git

```bash
# Remove Boilerplate git
rm -Rf .git

# Create new git
git init

# Commit, push, ...
```

## WTF is ES6?
Simply, the next version of JavaScript that contains some really cool features. You might check out some of these:

- http://es6-features.org
- https://wiki.mozilla.org/ES6_plans
- http://globaldev.co.uk/2013/09/es6-part-1/
- http://code.tutsplus.com/tutorials/eight-cool-features-coming-in-es6--net-33175


## Distribute support browser

You can build distribute support browser with `browserify`

```bash
# Install dependencies
npm install --save-dev browserify watchify babelify vinyl-source-stream lodash browser-sync vinyl-buffer
```

Edit gulpfile.js
```js
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');

var config = {
  entryFile: './src/index.js',
  outputDir: './dist/',
  outputFile: 'index.js'
};

// clean the output directory
gulp.task('clean', (cb) => {
  rimraf(config.outputDir, cb);
});

var bundler;
var getBundler = () => {
  if (!bundler) {
    bundler = watchify(browserify(config.entryFile, _.extend({debug: true}, watchify.args)));
  }
  return bundler;
};

var bundle = () => {
  return getBundler()
    .transform(babelify.configure({
      // Use all of the ES2015 spec
      presets: ['es2015']
    }))
    .bundle()
    .on('error', (err) => {
      console.log('Error: ' + err.message);
    })
    .pipe(source(config.outputFile))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(config.outputDir))
    .pipe(reload({stream: true}));
};

gulp.task('build-persistent', ['clean'], () => {
  return bundle();
});

gulp.task('build', ['build-persistent'], () => {
  process.exit(0); // eslint-disable-line
});

gulp.task('watch', ['build-persistent'], () => {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', () => {
    gulp.start('build-persistent');
  });
});

// WEB SERVER
gulp.task('serve', ['build-persistent'], () => {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
```
