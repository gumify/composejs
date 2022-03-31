"use strict";

const gulp        = require("gulp");
const uglify      = require("gulp-uglify");
const babel       = require("gulp-babel");
const maps        = require("gulp-sourcemaps");
const rename      = require("gulp-rename");
const include     = require('gulp-include');
const browserify  = require("browserify");
const Babelify    = require("babelify");
const source      = require("vinyl-source-stream");
const buffer      = require('vinyl-buffer');
const rollupify   = require('rollupify');


const dirs = {
    src: "example/App.js",
    dests: [
        "dist",
    ]
}

gulp.task("compile", function() {
    let pipeLine = browserify({
        entries: [dirs.src]
    })
    .transform(rollupify, {config: {}}) 
    .transform(Babelify, {presets: ["@babel/preset-env"]})
    .bundle()
    .pipe(source(dirs.src))
    .pipe(buffer())
    .pipe(maps.init())
    .pipe(rename("compose.min.js"))
    .pipe(uglify())
    .pipe(maps.write(".maps"))
    
    for (let dest of dirs.dests) {
        pipeLine.pipe(gulp.dest(dest));
    }

    return pipeLine
});

gulp.task("watch", gulp.series("compile", function() {
    gulp.watch(["src/*.js", "src/**/*.js", "example/*.js", "example/**/*.js"], gulp.series("compile"));
}));

gulp.task("default", gulp.series("compile"));
