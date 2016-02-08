// gulpfile.js
'use strict';

var gulp = require('gulp');
var paths = require('./gulp-config.json');

function compile(doMinify, doWatch) {
    var watchify = require('watchify');
    var browserify = require('browserify');
    var babelify = require('babelify');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var gulpif = require('gulp-if');

    var opts = {
        entries: [paths.main.js + '/main.js'],
        transform: [[babelify, {presets: ['es2015', 'react']}]],
        debug: true
    };
    var b = doWatch ? watchify(browserify(opts)) : browserify(opts);

    function bundle() {
        return b.bundle()
            .on('error', function(err) {
                console.log(err.toString());
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(gulpif(doMinify, uglify()))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dest.js));
    }

    b.on('update', bundle);
    b.on('log', function(msg) {
        console.log(msg);
    });

    return bundle();
}

gulp.task('browserify', function() {
    return compile(false, true);
});

gulp.task('watch', ['browserify'], function() {
});

gulp.task('build', function() {
    return compile(true, false);
});
