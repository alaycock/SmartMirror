var gulp = require('gulp');
var ejs = require('gulp-ejs');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var gcmq = require('gulp-group-css-media-queries');
var neat = require('node-neat').includePaths;

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use all packages available on npm
gulp.task('clean', function(cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['dist'], cb);
});

gulp.task('templates', function() {
  gulp.src('./src/templates/*')
    .pipe(ejs().on('error', gutil.log))
    .pipe(gulp.dest('./public'));
});

var processStyles = function(stream, options) {
    stream = stream.pipe(sourcemaps.init());

    if (options.onerror) {
        stream.on('error', options.onerror);
    }

    if (options.postsmCallback) {
        stream = options.postsmCallback(stream);
    }

    stream = stream
      .pipe(gcmq());
    stream = stream.pipe(minifyCSS({
      restructuring: false
    }));

    stream = stream.pipe(sourcemaps.write());

    if (options.destCallback) {
        return options.destCallback(stream);
    } else {
		return stream.pipe(gulp.dest('./dist/web/stylesheets'));
    }
};

gulp.task('styles', function() {
    var src = gulp.src('./src/styles/*.scss');

    return processStyles(src, {
        onerror: function(err) {
            console.error(err);
        },
        postsmCallback: function(stream) {
            return stream
                .pipe(sass({
                    includePaths: neat
                }))
                .pipe(concat("style.css"));
        },
        destCallback: function(stream) {
            stream.pipe(sass().on('error', sass.logError))
                .pipe(gulp.dest('./public/css/'));
        }
    });
});

gulp.task('scripts', function() {
  gulp.src('./src/javascripts/**/*')
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('vendor', function() {
  gulp.src('./vendor/**/*')
    .pipe(gulp.dest('./public/libs/'));
});

gulp.task('watch', function() {
  gulp.watch('./src/templates/**/*.ejs', ['templates']);
  gulp.watch('./src/styles/**/*', ['styles']);
  gulp.watch('./src/javascripts/**/*', ['scripts']);
  gulp.watch('./vendor/**/*', ['vendor']);
});

gulp.task('build', ['templates', 'styles', 'scripts', 'vendor']);

gulp.task('default', ['build', 'watch']);
