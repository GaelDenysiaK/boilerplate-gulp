const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const groupmq = require('gulp-group-css-media-queries');
const bs = require('browser-sync');
const sassLint = require('gulp-sass-lint');

const SASS_SOURCES = [
    './*.scss', // This picks up our style.scss file at the root of the theme
    './assets/sass/**/*.scss', // All other Sass files in the /css directory
    './assets/sass/*.scss',
  ];
    /**
   * Lint Sass
   */
  gulp.task('lint:sass', () =>
    gulp.src(SASS_SOURCES)
      .pipe(plumber())
      .pipe(sassLint())
      .pipe(sassLint.format()));

  /**
   * Compile Sass files
   */
  gulp.task('compile:sass', () =>
    gulp.src(SASS_SOURCES, { base: './' })
      .pipe(plumber()) // Prevent termination on error
      .pipe(sass({
        indentType: 'tab',
        indentWidth: 1,
        outputStyle: 'expanded', // Expanded so that our CSS is readable
      })).on('error', sass.logError)
      .pipe(postcss([
        autoprefixer({
          cascade: false
        })
      ]))
      .pipe(groupmq()) // Group media queries!
      .pipe(gulp.dest('./')) // Output compiled files in the same dir as Sass sources
      .pipe(bs.stream())); // Stream to browserSync

  /**
   * Start up browserSync and watch Sass files for changes 
   */
  gulp.task('watch:sass', gulp.series('compile:sass', 'lint:sass'), () => {
    bs.init({
      proxy: 'http://localhost:80'
    });

    gulp.watch(SASS_SOURCES, gulp.series('compile:sass', 'lint:sass'));
  });




  /**
   * Default task executed by running `gulp`
   */
  gulp.task('default', gulp.series('compile:sass'));