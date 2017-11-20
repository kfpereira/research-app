var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var angularTemplateCache = require('gulp-angular-templatecache');
var replace = require('gulp-replace-task');
var fs = require('fs');

var paths = {
  scripts: ['./jssrc/**/{!(app.js), *.js}', './jssrc/app.js'],
  sass: ['./scss/**/*.scss'],
  templates: './www/templates/**/*.html'
};

var cordovaPlugins = [
  'org.apache.cordova.device',
  'org.apache.cordova.console',
  'org.apache.cordova.splashscreen',
  'org.apache.cordova.whitelist',
  'org.apache.cordova.statusbar',
  'com.ionic.keyboard'
];

gulp.task('default', ['sass', 'scripts', 'templates', 'watch']);

gulp.task('replace', function () {
  // Get the environment from the command line
  var profile = gutil.env.profile || 'development';

  // Read the settings from the right file
  var filename = profile + '.json';
  var settings = JSON.parse(fs.readFileSync('./environment/profile/' + filename, 'utf8'));
  // Replace each placeholder with the correct value for the variable.
  gulp.src('environment/profile/js/constants.js')
    .pipe(replace({
      patterns: [
        {match: 'serverUrl', replacement: settings.serverUrl}
      ]
    }))
    .pipe(gulp.dest('jssrc'));

  gulp.src('environment/profile/config.xml')
    .pipe(replace({
      patterns: [
        {match: 'appName', replacement: settings.appName}
      ]
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('scripts', function () {
  browserify({
      entries: ['./jssrc/app.js'],
      debug: true
    })
    .transform(babelify, {sourceMaps: true})
    .bundle()
    .pipe(source('build.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/js'));
});


gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.templates, ['templates']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
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

gulp.task('templates',  function() {
  return gulp.src(paths.templates)
    .pipe(angularTemplateCache())
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./www/lib/'));
});

// gulp.task('installCordovaPlugins', function() {
//   var d = $q.defer();
//   // execute ionic plugin add for each of the plugins
//   var addPromises = cordovaPlugins.map(function(plugin) {
//     return exec('ionic plugin add '+plugin);
//   });
//   // wait for all shell actions to complete
//   $q.all(addPromises).then(function() {
//     d.resolve();
//   });
//   return d.promise;
// });

// gulp.task('uninstallCordovaPlugins', function() {
//   var d = $q.defer();
//   // fetch list of all installed plugins
//   var installedPlugins = require('./plugins/android.json').installed_plugins;
//   // execute ionic plugin rm for each installed plugin
//   var rmPromises = [];
//   for(var plugin in installedPlugins) {
//     rmPromises.push(exec('ionic plugin rm '+plugin));
//   };
//   // wait for all shell actions to complete
//   $q.all(rmPromises).then(function() {
//     d.resolve();
//   });
//   return d.promise;
// });