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
    prettier = require('gulp-prettier'),
    pugBeautify = require('gulp-pug-beautify');

// Styles
gulp.task('styles', () => {
    gulp
        .src('public/stylesheets/style.sass')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(livereload())
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', () => {
    gulp
        .src('public/javascripts/**/*.js')
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
gulp.task('images', () => {
    gulp
        .src('public/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(livereload())
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', () => {
    gulp.src([ 'dist/stylesheets', 'dist/javascripts', 'dist/images' ], { read: false }).pipe(clean());
});

// Prettify JS
gulp.task('prettify-js', () => {
    gulp
        .src([ './models/**/*.js', './routes/**/*.js', '*.js' ])
        .pipe(prettier({ printWidth: 120, tabWidth: 4, singleQuote: true, semi: false }))
        .pipe(gulp.dest(file => file.base));
});

gulp.task('prettify-pug', () => {
    gulp.src('./views/**/*.pug').pipe(pugBeautify({ tab_size: 4 })).pipe(gulp.dest(file => file.base));
});

// Default task
gulp.task('default', [ 'clean' ], () => {
    gulp.run('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', [ 'default' ], () => {
    // Listen on port 35729
    livereload.listen();

    // // Watch server files
    // gulp.watch(['app.js', 'routes/*.js', 'models/*.js'], (event) => {
    //   console.log('File ' + event.path + ' was ' + event.type + ', running tasks...')
    //   gulp.run('nodemon')
    // })
    // Watch template files
    gulp.watch('views/**/*.pug', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        livereload.reload();
    });

    // Watch .sass files
    gulp.watch('public/stylesheets/**/*.sass', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('styles');
    });

    // Watch .js files
    gulp.watch('public/javascripts/**/*.js', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('scripts');
    });

    // Watch image files
    gulp.watch('public/images/**/*', event => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        gulp.run('images');
    });
});
