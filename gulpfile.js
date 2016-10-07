var babel = require('gulp-babel');
var gulp = require('gulp');
var rimraf = require('rimraf');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var config = {
  entryFile: './src/**/*.js',
  outputDir: './dist/'
};

// clean the output directory
gulp.task('clean', (cb) => {
  rimraf(config.outputDir, cb);
});

var bundler;
var getBundler = () => {
  if (!bundler) {
    bundler = gulp.src(config.entryFile);
  }
  return bundler;
};

var bundle = () => {
  return getBundler()
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(config.outputDir));
};

gulp.task('build-persistent', ['clean'], () => {
  return bundle();
});

gulp.task('build', ['build-persistent'], () => {
  process.exit(0); // eslint-disable-line
});

gulp.task('watch', ['build-persistent'], () => {
  watch(config.entryFile, () => {
    gulp.start('build-persistent');
  });
});
