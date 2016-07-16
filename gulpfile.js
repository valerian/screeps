'use strict';

let _ = require("lodash");
var clean = require('gulp-clean');
let deepEqual = require("deep-equal");
var flatten = require('./libs/flatten.js');
var fs = require('fs');
var gulp = require('gulp');
let gulpCollect = require("gulp-collect");
let gulpRename = require("gulp-rename");
var gutil = require('gulp-util');
var https = require('https');
let path = require('path');
let Q = require("q");
var tslint = require("gulp-tslint");
var tsproject = require('tsproject');

var config = require('./config.json');

let gulpUploadVinylsAsModules = () => gulpCollect.list((fileVinyls, cb) => {
    let cbd = Q.defer();
    _gulpUploadVinylsAsModules(fileVinyls, cbd.makeNodeResolver());
    return cbd.promise;
});

var __lastUploaded = null;
function _gulpUploadVinylsAsModules(fileVinyls, cb) {
    let email = config.email;
    let password = config.password;
    let modules = {}
    for (let fileVinyl of fileVinyls) {
        let moduleName = path.basename(fileVinyl.path);
        modules[moduleName] = fileVinyl.contents.toString("utf-8");
    }
    console.log(`Modules: ${_.keys(modules).join(", ")}`);
    let data = { branch: config.branch, modules: modules };
    if (deepEqual(__lastUploaded, data)) {
        //console.log("Skipping upload due to equal outputs.");
        return cb(null, {});
    }
    __lastUploaded = data;

    console.log("Uploading...");
    let req = https.request({
        hostname: "screeps.com",
        port: 443,
        path: "/api/user/code",
        method: "POST",
        auth: `${email}:${password}`,
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    }, res => {
        console.log(`Response: ${res.statusCode}`);
        cb(null, {});
    });

    req.end(JSON.stringify(data));
}

gulp.task('clean', function () {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('compile', ['clean'], function () {
    return tsproject.src('./tsconfig.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('flatten', ['compile'], function () {
    return gulp.src('./dist/src/**/*.js')
        .pipe(flatten(1))
        .pipe(gulp.dest('./dist/flat'))
});

gulp.task('flatten-only', function () {
    return gulp.src('./dist/src/**/*.js')
        .pipe(flatten(1))
        .pipe(gulp.dest('./dist/flat'))
});


gulp.task('upload', ['flatten'], function () {
    return gulp.src('./dist/flat/*.js')
        .pipe(gulpRename(path => { path.extname = ""; }))
        .pipe(gulpUploadVinylsAsModules())
});

gulp.task("lint", () => {
    return gulp.src("./src/**/*.ts")
        .pipe(tslint({ formatter: "prose" }))
        .pipe(tslint.report({ summarizeFailureOutput: true }));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('build', ['upload']);

gulp.task('default', ['watch']);
