const gulp = require("gulp");
const postCSS = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const del = require("del");
// const cssNano = require("cssnano");
const importCSS = require("postcss-import");
const rename = require("gulp-rename");
const browserSync = require("browser-sync");

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

const cleanup = (cb) => del("_out/");
const html = (cb) => gulp.src("_src/index.html").pipe(gulp.dest("_out")).pipe(browserSync.stream());
const css = (cb) => gulp.src("_src/css/styles.css")
  .pipe(postCSS(postCssPlugins))
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("_out/"))
  .pipe(browserSync.stream());

// const liveReload = (cb) => browserSync.reload();
const serve = (cb) => browserSync.init({
  server: "_out"
});

const watchCSS = (cb) => gulp.watch("_src/css/*.css", css);
const watchHTML = (cb) => gulp.watch("_src/index.html", html);


exports.build = gulp.series(cleanup, gulp.parallel(css, html), gulp.parallel(watchCSS, watchHTML, serve));