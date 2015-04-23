'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

module.exports = function(options) {

  gulp.task('ngLog', function(){
    return gulp.src([
      options.src + '/ngLog/ngLog.js',
      options.src + '/ngLog/*.*.js'
    ])
      .pipe(concat('ngLog.js'))
      .pipe(gulp.dest(options.dist + '/ngLog'))
      .pipe(rename('ngLog.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(options.dist + '/ngLog'));
  });

  gulp.task('demo', function(){
    return gulp.src([
      options.dist + '/ngLog/**.js'
    ])
      .pipe(gulp.dest('demo/js/ngLog'));
  });

  gulp.task('clean', function (done) {
    $.del([options.dist + '/', options.tmp + '/'], done);
  });

  gulp.task('build', ['ngLog', 'demo']);
};
