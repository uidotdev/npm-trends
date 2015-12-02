'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var bower = require('gulp-bower');
var lrload = require('livereactload');

gulp.task('nodemon', ['bundle-css', 'bower', 'icons', 'watch-css', 'watchify'], function(){
	nodemon({
		script: 'app.js',
		ext: 'js html json',
		nodeArgs: ['--harmony']
	}).on('restart');
});

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

// one-off browserify task which is handy when debugging
// node --harmony `which gulp` browserify
gulp.task('browserify', function() {
  const b = getBrowserifyInstance();
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

var getBrowserifyInstance = function() {
	var b = browserify('assets/js/app.jsx', {
		debug: true,
		extensions: ['.jsx'],
    // live reload
    plugin: [ lrload ],
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