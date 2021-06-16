const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const gcmq = require('gulp-group-css-media-queries');
const sass = require("gulp-sass");
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const minify = require('gulp-minify');
const smartGrid = require('smart-grid');
const webp = require('gulp-webp');
const path = require('path');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const fs = require('fs');


let isMap = process.argv.includes('--map');
let isMinify = process.argv.includes('--clean');
let isSync = process.argv.includes('--sync');

function clean(){
	return del('./build/*');
}

function html(){
	return gulp.src('./src/**/*.html')
			   .pipe(htmlmin({collapseWhitespace: true}))
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function ico(){
	return gulp.src('./src/*.ico')
			   .pipe(gulp.dest('./build'));
}

function styles(){
	return gulp.src('./src/styles/*.scss')
			   .pipe(gulpIf(isMap, sourcemaps.init()))
			   .pipe(sass())
			   .pipe(autoprefixer())
			   .pipe(gcmq())
			   .pipe(gulpIf(isMinify, cleanCSS({
			   		level: 2
			   })))
			   .pipe(gulpIf(isMap, sourcemaps.write()))
			   .pipe(gulp.dest('./build/css'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function images(){
	return gulp.src('./src/images/**/*')
			   .pipe(imagemin())
			   .pipe(gulp.dest('./build/images'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function webpImages() {
	return gulp.src('./src/images/**/*')
			   .pipe(webp())
			   .pipe(gulp.dest('./build/images'))
			   .pipe(gulpIf(isSync, browserSync.stream()));	
}

function fonts(){
	return gulp.src('./src/fonts/**/*')
			   .pipe(gulp.dest('./build/fonts'));
}

function scripts(){
	return gulp.src('./src/js/main.js')
			   .pipe(minify({
					noSource: true
			   }))
			   .pipe(gulp.dest('./build/js'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

function watch(){
	if(isSync){
		browserSync.init({
	        server: {
	            baseDir: "./build/"
	        }
	    });
		gulp.watch('./src/styles/**/*.scss', styles);
		gulp.watch('./src/**/*.html', html);
		gulp.watch('./src/images/**/*', images);
		gulp.watch('./src/images/**/*', webpImages);
		gulp.watch('./src/js/**/*', scripts);
		gulp.watch('./smartgrid.js', grid);
	}
}

function grid(done){
	delete require.cache[path.resolve('./smartgrid.js')];
	let options = require('./smartgrid.js');
	smartGrid('./src/styles', options);
	done();
}

function replaceCode(){
	return gulp.src('./build/*.html')
			   .pipe(replace('<link rel="stylesheet" type="text/css" href="./css/main.css">', function() {
			   	const style = fs.readFileSync('./build/css/critical.css', 'utf8');
			   	return `<style>${style}</style>`;
			   }))
			   .pipe(replace('<!--asyncCss-->', function() {
			   	return `<script>function loadStyle(url){let link = document.createElement('link');link.href = url;link.rel = 'stylesheet';document.body.appendChild(link);}loadStyle('css/main.css');</script>`;
			   }))
			   .pipe(gulp.dest('./build'))
			   .pipe(gulpIf(isSync, browserSync.stream()));
}

let build = gulp.series(clean, gulp.parallel(html, styles, images, webpImages, scripts, fonts, ico), replaceCode);
let dev = gulp.series(build, watch);

gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('grid', grid);
gulp.task('js', scripts);