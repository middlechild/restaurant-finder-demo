var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

// Deployment to GitHub Pages requires that the 'dist' directory is called 'docs'

// Static Server
gulp.task('serve', function() {
    browserSync.init({
        server: "docs"
    });
});

// Watching scss/js/html files
gulp.task('watch', ['serve', 'sass', 'useref'], function() {
    gulp.watch("assets/scss/*.scss", ['sass']);
    gulp.watch("assets/js/main.js", ['useref']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Compile SASS into CSS & auto-inject into browser
gulp.task('sass', function() {
  return gulp.src("assets/scss/*.scss")
    .pipe(sass({
      sourceComments: 'map',
      sourceMap: 'scss'
    }))
    .pipe(gulp.dest("assets/css"))
    .pipe(browserSync.stream());
});

// Handle build blocks in html files
gulp.task('useref', function(){
    return gulp.src('*.html')
        .pipe(useref())
        // Minify only if it's a JS file
        .pipe(gulpIf('*.js', uglify()))
        // Minify only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('docs'))
});

// Optimize images and push to 'docs' directory
gulp.task('images', function(){
    // Images are too small and don't need to be optimized
    // Just using this task to update 'docs' directory if necessary
    return gulp.src('assets/graphics/*.+(png|jpg|gif|svg)')
        .pipe(gulp.dest('docs/assets/graphics'))
});

gulp.task('default', ['serve']);
gulp.task('server', ['serve']);
gulp.task('dev', ['watch']);