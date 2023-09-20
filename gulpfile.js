import gulp from 'gulp'
import clean from 'gulp-clean'
// import concat from 'gulp-concat'
// import terser from 'gulp-terser'
import pug from 'gulp-pug'

import connect from 'gulp-connect'
import livereload from 'gulp-livereload'

// import imagemin from 'gulp-imagemin'

// import dartSass from 'sass'
// import gulpSass from 'gulp-sass'

import realFavicon from 'gulp-real-favicon'
import fs from 'fs'

import dartSass from 'sass';
import gulpSass from 'gulp-sass';

import open from 'open';

const sass = gulpSass(dartSass);

const FAVICON_DATA_FILE = 'faviconData.json'

gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: 'src/resources/images/site-icon.png',
		dest: 'dist/',
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {
				design: 'raw'
			},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false,
			readmeFile: false,
			htmlCodeFile: false,
			usePathAsIs: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done()
	})
})

gulp.task('inject-favicon-markups', function() {
	return gulp.src([ 'TODO: List of the HTML files where to inject favicon markups' ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('TODO: Path to the directory where to store the HTML files'))
})

gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err
		}
	})
})

/**/

const cleanDist = () => {
	return gulp.src('dist', {read: false, allowEmpty: true})
		.pipe(clean({force: true}))
}

const clear = gulp.parallel(cleanDist)

const compileSass = () => {
	return gulp.src('src/sass/app.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('dist/css'))
		.pipe(livereload())
}

const minifyJs = () => {
	return gulp.src('src/js/*.js')
		// .pipe(concat('app.js'))
		// .pipe(terser())
		.pipe(gulp.dest('dist/js'))
		.pipe(livereload())
}

// const copyFiles = () => {
// 	return gulp.src(['src/resources/**/*'], { base: 'src' })
// 		.pipe(gulp.dest('dist/'))
// 		.pipe(livereload())
// }
const copyFiles = gulp.series('generate-favicon', () => {
	return gulp.src(['src/resources/**/*'], { base: 'src' })
		.pipe(gulp.dest('dist/'))
		.pipe(livereload());
 });

const compilePug = () => {
	return gulp.src('src/pug/pages/**/*.pug')
		.pipe(pug())
		.pipe(gulp.dest('dist/'))
		.pipe(livereload())
}
const libs = () => {
	return gulp.src('src/lib/**/*')
		.pipe(gulp.dest('dist/lib/'))
		.pipe(livereload())
}

gulp.task('open-browser', function (done) {
	open('http://localhost:8080');
	done();
});

/* */
const buildAssets = gulp.parallel(minifyJs, compilePug, compileSass, copyFiles, libs)
const build = gulp.series(clear, buildAssets, 'open-browser')

const watchFiles = () => {
	connect.server({
		root: 'dist',
		livereload: true
	})
	livereload.listen()
	gulp.watch('src/pug/**/*.pug', compilePug)
	gulp.watch('src/sass/**/*.scss', compileSass)
	gulp.watch('src/js/**/*.js', minifyJs)
	gulp.watch(['src/fonts/**/*', 'src/images/**/*'], copyFiles)
}

export default gulp.series(build, watchFiles)