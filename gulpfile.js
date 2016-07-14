'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var tsproject = require('tsproject');
var clean = require('gulp-clean');
var https = require('https');
var fs = require('fs');
var tslint = require("gulp-tslint");
var flatten = require('./libs/flatten.js');
//var flatten = require('gulp-flatten');
//var flattenRequires = require('gulp-flatten-requires');

var config = require('./config.json');

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('compile', ['tslint'], function () {
    return tsproject.src('./tsconfig.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('compile-test', ['clean'], function () {
    return tsproject.src('./tsconfig.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('flatten', function () {
    return gulp.src('./dist/src/**/*.js')
        .pipe(flatten())
//        .pipe(flattenRequires())
        .pipe(gulp.dest('./dist/flat'))
});

gulp.task("tslint", ['clean'], () => {
    return gulp.src("./src/**/*.ts")
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ summarizeFailureOutput: true }));
});

gulp.task('upload-sim', ['compile'], function () {
  gutil.log('Starting upload...');

  var screeps = {
    email: config.email,
    password: config.password,
    data: {
      branch: config.branch,
      modules: {
        main: fs.readFileSync('./dist/main.js', { encoding: "utf8" }),
      }
    }
  };

  var req = https.request({
    hostname: 'screeps.com',
    port: 443,
    path: '/api/user/code',
    method: 'POST',
    auth: screeps.email + ':' + screeps.password,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }, function (res) {
    gutil.log('Build ' + gutil.colors.cyan('completed') + ' with HTTPS Response ' + gutil.colors.magenta(res.statusCode));
  });

  req.write(JSON.stringify(screeps.data));
  req.end();
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('build', ['upload-sim']);

gulp.task('default', ['watch']);
