var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    sass = require('gulp-sass'),
    sh = require('shelljs'),
    sourcemaps = require('gulp-sourcemaps'),
    templateCache = require('gulp-angular-templatecache'),
    paths = {
      sass: ['./scss/**/*.scss'],
      templatecache: ['./www/templates/**/*.html']
    };

gulp.task('sass', function(done){
  gulp
    .src('./scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('templatecache', function(done){
  gulp
    .src(paths.templatecache)
    .pipe(
      templateCache({
        standalone: true,
        filename: 'templates.js',
        module: 'voltz.templates',
        root: 'templates/'
      })
    )
    .pipe(gulp.dest('./www/scripts/'))
    .on('end', done);
});

gulp.task('watch', function(){
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templatecache, ['templatecache']);
});

gulp.task('install', ['git-check'], function(){
  return bower
    .commands.install()
    .on('log', function(data){
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done){
  if(!sh.which('git')){
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }

  done();
});
