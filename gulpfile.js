// Load plugins
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-clean-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    pug = require('gulp-pug');

// Styles
gulp.task('styles', function() {
  return gulp.src('public/stylesheets/style.sass')
    .pipe(sass({ style: 'expanded'}))
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(livereload())
    .pipe(gulp.dest('dist/stylesheets'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('public/javascripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/javascripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload())
    .pipe(gulp.dest('dist/javascripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('public/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(livereload())
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/stylesheets', 'dist/javascripts', 'dist/images'], {read: false})
    .pipe(clean());
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.run('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['default'], function() {

  // Listen on port 35729
  livereload.listen();

  // // Watch server files
  // gulp.watch(['app.js', 'routes/*.js', 'models/*.js'], function(event) {
  //   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  //   gulp.run('nodemon')
  // })

  // Watch template files
  gulp.watch('views/**/*.pug', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    livereload.reload();
  });

  // Watch .sass files
  gulp.watch('public/stylesheets/**/*.sass', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('styles');
  });

  // Watch .js files
  gulp.watch('public/javascripts/**/*.js', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('scripts');
  });

  // Watch image files
  gulp.watch('public/images/**/*', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('images');
  });
});