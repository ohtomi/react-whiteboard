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

function compile(doSourceMap, doMinify) {
    var babel = require('gulp-babel');
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var gulpif = require('gulp-if');

    return gulp.src(paths.main.js + '/**/*.js')
        .pipe(gulpif(doSourceMap, sourcemaps.init()))
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(gulpif(doMinify, uglify()))
        .pipe(gulpif(doSourceMap, sourcemaps.write('.')))
        .pipe(gulp.dest(paths.dest.js));
}

gulp.task('babel', function() {
    return compile(false, false);
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

gulp.task('icons', function() {
    return gulp.src(paths.main.css + '/*.svg')
        .pipe(gulp.dest(paths.dest.css));
});

gulp.task('watch', ['babel', 'sass', 'icons'], function() {
    var watch = require('gulp-watch');

    watch(paths.main.js + '/**/*.js', function() {
        gulp.start('babel');
    });
    watch(paths.main.css + '/**/*.scss', function() {
        gulp.start('sass');
    });
    watch(paths.main.css + '/**/*.svg', function() {
        gulp.start('icons');
    });
});

gulp.task('build', ['sass', 'icons'], function() {
    return compile(true, true);
});
