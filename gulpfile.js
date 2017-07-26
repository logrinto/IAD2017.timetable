// import loadPlugins from 'gulp-load-plugins';

// Load all Gulp plugins
// const $ = loadPlugins();

// Gather the library data from `package.json`
// const config = manifest.babelBoilerplateOptions;
// const mainFile = manifest.main;
// const destinationFolder = path.dirname(mainFile);


// function build() {
//
// //  return gulp.src(path.join('src', `${config.entryFileName}.js`))
// //    .pipe(webpackStream({
// //      output: {
// //        filename: `${exportFileName}.js`,
// //        libraryTarget: 'umd',
// //        library: config.mainVarName,
// //      },
// //      module: {
// //        loaders: [
// //          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
// //        ],
// //      },
// //      devtool: 'source-map',
// //    }))
// //    .pipe(gulp.dest(destinationFolder))
// //    .pipe($.filter(['*', '!**/*.js.map']))
// //    .pipe($.rename(`${exportFileName}.min.js`))
// //    .pipe($.sourcemaps.init({ loadMaps: true }))
// //    .pipe($.uglify())
// //    .pipe($.sourcemaps.write('./'))
// //    .pipe(gulp.dest(destinationFolder));
// }
//
//
// // Build two versions of the library
// gulp.task('build', build);
//
// // An alias of test
// gulp.task('default', ['build']);



var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var changed = require('gulp-changed');
var connect = require('gulp-connect');



var theme = './src/themes/hongkong/';

var themeFiles = './src/themes/hongkong/**/*.*';

var input = './src/stylesheets/main.scss';
var observe = './src/stylesheets/**/*.scss';
var output = './public/css';


var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded',
  includePaths: [
    './node_modules/susy/sass/'
  ]
};




var shell = require('gulp-shell')


//gulp.task('yaml_old', shell.task([
//  './node_modules/.bin/babel-node index.js',
//  'echo finish'
//]))


gulp.task('yaml', function () {
  return gulp
    .src('*.js', {read: false})
    .pipe(shell([
      './node_modules/.bin/babel-node index.js',
      'echo finish'
    ]))
    .pipe(connect.reload())
})




gulp.task('sass', function () {


  // weird solution for error together with autoprefixer and sourcemap
  // on some computers
  // see > https://github.com/sindresorhus/gulp-autoprefixer/issues/8#issuecomment-58491797
  return gulp
    .src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '.'}))

    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())

    .pipe(gulp.dest(output))
    .pipe(connect.reload())

    // Release the pressure back and trigger flowing mode (drain)
    // See: http://sassdoc.com/gulp/#drain-event
    .resume();

  // this would be the easy way...
  //
  // return gulp
  //   .src(input)
  //   .pipe(sourcemaps.init())
  //   .pipe(sass(sassOptions).on('error', sass.logError))
  //   .pipe(sourcemaps.write())
  //   // .pipe(autoprefixer())
  //   .pipe(gulp.dest(output))
  //   .resume();
});

gulp.task('watch', function() {
    gulp.watch(observe, ['sass']);
    gulp.watch(['../data/*.hbs', '../data/data.yml', './src/semesterplan.js'], ['yaml']);


});
gulp.task('connect', function() {
  connect.server({
    root: './public/',
    livereload: true
  });
});

gulp.task('copy', function() {

    gulp.src('assets/**/*')
        .pipe(gulp.dest('./public/assets/'))
});


gulp.task('default', ['copy', 'sass', 'yaml', 'connect', 'watch' /*, possible other tasks... */]);
gulp.task('build', ['copy', 'sass', 'yaml']);
