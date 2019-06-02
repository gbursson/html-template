const gulp = require("gulp");
const postCSS = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const del = require("del");
// const cssNano = require("cssnano");
const importCSS = require("postcss-import");
const rename = require("gulp-rename");
const browserSync = require("browser-sync");
const imagemin = require('gulp-imagemin');
const CONFIG = require('./config.json')

// const unCss = require('postcss-uncss');

const postCssPlugins = [
  importCSS(),
  autoprefixer({
    browsers: ["> 1%"],
    cascade: false
  })
  // uncomment cssNano for production
  // cssNano()
];

const imageminOptions = [
  imagemin.gifsicle({
    interlaced: true
  }),
  imagemin.jpegtran({
    progressive: true
  }),
  imagemin.optipng({
    optimizationLevel: 5
  }),
];

const clean = (cb) => del(CONFIG.dest);
const html = (cb) => gulp.src(CONFIG.src.html).pipe(gulp.dest(CONFIG.dest)).pipe(browserSync.stream());
const css = (cb) => gulp.src(CONFIG.src.css).pipe(postCSS(postCssPlugins)).pipe(rename('style.min.css')).pipe(gulp.dest(CONFIG.dest)).pipe(browserSync.stream());
const images = (cb) => gulp.src(CONFIG.src.img).pipe(imagemin(imageminOptions)).pipe(gulp.dest(CONFIG.dest)).pipe(browserSync.stream());

const serve = (cb) => browserSync.init({
  server: CONFIG.dest
});

const watchCSS = (cb) => gulp.watch(CONFIG.src.cssAll, css);
const watchHTML = (cb) => gulp.watch(CONFIG.src.html, html);

exports.images = images;
exports.watch = gulp.parallel(watchCSS, watchHTML);
exports.serve = serve;
exports.clean = clean;
exports.build = gulp.series(clean, gulp.parallel(css, html, images), gulp.parallel(watchCSS, watchHTML, serve));
