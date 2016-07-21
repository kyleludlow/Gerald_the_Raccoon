var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    browserify = require('browserify'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gls = require('gulp-live-server');


// Compile Sass task
gulp.task('sass', function() {
  return gulp.src('src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('build/css'));
});

// Minify index
gulp.task('html', function() {
  return gulp.src('src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('build/'));
});

// JavaScript build task, removes whitespace and concatenates all files
gulp.task('scripts', function() {
  return browserify('src/js/app.js')
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    // .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

// Styles build task, concatenates all the files
gulp.task('styles', function() {
  return gulp.src('src/css/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('build/css'));
});

// Styles build task, concatenates all the files
gulp.task('spec', function() {
  return gulp.src('src/spec/*.json')
    .pipe(gulp.dest('build/spec'));
});

// Image optimization task
gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('build/fonts'));
})

// Watch task
gulp.task('watch', function() {
  gulp.watch('src/js/**/**/*.js', ['scripts']);
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/index.html', ['html']);
});

// start server
gulp.task('serve', function() {
  var server = gls.static('build', 3000);
  server.start().then(function(result) {
    process.exit(result.code);
  });

  gulp.watch(['build/css/main.css', 'build/index.html', 'build/js/app.js'], function(file) {
    server.notify.apply(server, [file]);
  });
})


// Default task
gulp.task('dev', ['html', 'scripts', 'sass', 'fonts', 'watch', 'serve', 'images', 'spec']);

// Build task
gulp.task('build', ['sass', 'html', 'scripts', 'styles', 'images', 'spec']);
