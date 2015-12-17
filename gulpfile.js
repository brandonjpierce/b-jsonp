const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

gulp.task('build', function() {
  return gulp
    .src('./src/index.js')
    .pipe(uglify({
      compress: {
        warnings: false,
        side_effects: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true,
        properties: true
      },
      output: {
        comments: false
      }
    }))
    .pipe(rename('jsonp.min.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['build']);
