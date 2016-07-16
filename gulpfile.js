'use strict';

let clean = require('gulp-clean');
let gulp = require('gulp');
let gulpDotFlatten = require('./libs/gulp-dot-flatten.js');
let gulpRename = require("gulp-rename");
let gulpScreepsUpload = require('./libs/gulp-screeps-upload.js');
let path = require('path');
let tslint = require("gulp-tslint");
let tsproject = require('tsproject');

let config = require('./config.json');


gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('compile', ['clean'], function () {
    return tsproject.src('./tsconfig.json')
        .pipe(gulp.dest('dist'));
});

gulp.task("lint", ['compile'], () => {
    return gulp.src("./src/**/*.ts")
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ summarizeFailureOutput: true }))
        .on('error', function(error) { this.emit('end') });
});

gulp.task('flatten', ['lint'], function () {
    return gulp.src('./dist/src/**/*.js')
        .pipe(gulpDotFlatten(0))
        .pipe(gulp.dest('./dist/flat'))
});

gulp.task('upload', ['flatten'], function () {
    return gulp.src('./dist/flat/*.js')
        .pipe(gulpRename(path => { path.extname = ""; }))
        .pipe(gulpScreepsUpload(config.email, config.password, config.branch))
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('build', ['upload']);

gulp.task('default', ['watch']);
