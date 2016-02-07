// gulpfile.js
'use strict';

var gulp = require('gulp');
var paths = require('./gulp-config.json');

gulp.task('del', function(done) {
    var del = require('del');

    return del([
        paths.dest.js + '/**/*.js',
        paths.dest.js + '/**/*.js.map',
        paths.dest.css + '/**/*.css'
    ], done);
});

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

gulp.task('karma', function(done) {
    var karma = require('karma').server;

    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
        }, function(exitStatus) {
            done(exitStatus ? 'There are failing unit tests' : undefined);
        });
});

gulp.task('jsxhint', function() {
    var jshint = require('gulp-jshint');

    return gulp.src([paths.main.js + '/**/*.js'])
        .pipe(jshint({
            linter: require('jshint-jsx').JSXHINT
        }))
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    var sass = require('gulp-sass');

    return gulp.src(paths.main.css + '/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.dest.css));
});

gulp.task('watch', ['browserify'], function() {
    gulp.watch([paths.test.js + '/**/*.js'], ['karma']);
    gulp.watch([paths.main.css + '/**/*.scss'], ['sass']);
});

gulp.task('build', ['sass'], function() {
    return compile(true, false);
});
