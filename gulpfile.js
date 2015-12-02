'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    bower = require('gulp-bower'),
    lrload = require('livereactload'),
    shell = require('gulp-shell');

gulp.task('nodemon', ['bundle-css', 'bower', 'icons', 'watch-css', 'watchify'], function(){
	nodemon({
		script: 'app.js',
		ext: 'js html json',
		nodeArgs: ['--harmony']
	}).on('restart');
});

gulp.task('production:push', [ 'precompile:assets', 'git:push', 'heroku:push']);

gulp.task('precompile:assets', ['bundle-css', 'bower', 'icons', 
                              'browserify:production']);

gulp.task('git:push', shell.task([
  "git add .",
  "git commit -m 'precompile for production'",
  "git push"
]))

gulp.task('heroku:push', shell.task([
  "git push heroku master"
]))

gulp.task('bundle-css', function(){
  return gulp.src('./assets/css/*.scss')
    .pipe(sass({
    		style: 'compressed',
    		includePaths: [
    			'./bower_components/bootstrap-sass/assets/stylesheets'
    		]
    	}).on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('public/css'))
    .pipe(rename('bundle.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/css'));
});

gulp.task('bower', function(){
	return bower()
    .pipe(gulp.dest('./public'));
});

gulp.task('icons', function() { 
  return gulp.src('./bower_components/bootstrap-sass/assets/fonts/bootstrap/**.*') 
    .pipe(gulp.dest('./public/fonts/bootstrap')); 
});

gulp.task('watch-css', function () {
  return gulp.watch('./assets/css/*.scss', ['bundle-css']);
});

gulp.task('browserify', function() {
  const b = getBrowserifyInstance('dev');
  b.transform(babelify, {presets: ["es2015", "react"]});
  return bundleBrowserify(b);
});

gulp.task('browserify:production', function() {
  const b = getBrowserifyInstance('production');
  b.transform(babelify, {presets: ["es2015", "react"]});
  return bundleBrowserify(b);
});

gulp.task('watchify', function(){
	var b = getBrowserifyInstance();
	var w = watchify(b);

	w.transform(babelify, {});
	w.on('update', function(){
		console.log('updating bundle');
		bundleBrowserify(w);
	});
	return bundleBrowserify(w);
});

var getBrowserifyInstance = function(env) {
	var b = browserify('assets/js/app.jsx', {
		debug: true,
		extensions: ['.jsx'],
    // live reload
    plugin: (env === 'production') ? [] : [lrload],
		// watchify arguments
		cache: {},
		packageCache: {},
    fullPaths: false
	});

	return b;
}

var bundleBrowserify = function(b){
	return b
		.bundle(function(err){
      if(err){
        console.log(err.message);
      } else {
        console.log('bundle done');
      }
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename('bundle.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
}

gulp.task('default', ['nodemon']);