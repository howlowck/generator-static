var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserify = require('browserify');
var util = require('gulp-util');
var source = require('vinyl-source-stream');

gulp.task('sass', function () {
    return sass('<%=cssFile%>')
        .on('error', function (err) { 
          util.log('error', util.colors.red(err.message));
        })
        .pipe(gulp.dest('<%=builtDir%>'));
});

gulp.task('browserify', function () {
   return browserify('./<%=jsDir%>/<%=jsName%>.js')
       .bundle()
       .on('error', function (err) {
           util.log('error', util.colors.red(err.message));
           this.emit('end');
       })
       .pipe(source('<%=jsName%>.js'))
       .pipe(gulp.dest('./<%=builtDir%>'));
});

gulp.task('default', function () {
    gulp.start('sass');
    gulp.start('browserify');

    gulp.watch(['./<%=cssDir%>/**/*.scss'], ['sass']);
    gulp.watch(['./<%=jsDir%>/**/*'], ['browserify']);
});