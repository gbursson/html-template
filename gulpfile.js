const gulp = require("gulp");
const postCSS = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const del = require("del");
// const cssNano = require("cssnano");
const importCSS = require("postcss-import");
const rename = require("gulp-rename");
const browserSync = require("browser-sync");
const imagemin = require('gulp-imagemin');

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
  imagemin.svgo({
    plugins: [{
        removeViewBox: true
      },
      {
        cleanupIDs: false
      }
    ]
  })

];

const clean = (cb) => del("_out/");

const html = (cb) => gulp.src("_src/index.html").pipe(gulp.dest("_out")).pipe(browserSync.stream());
const css = (cb) => gulp.src("_src/css/styles.css")
  .pipe(postCSS(postCssPlugins))
  .pipe(rename("style.min.css"))
  .pipe(gulp.dest("_out/"))
  .pipe(browserSync.stream());

const images = (cb) => gulp.src('_src/img/*').pipe(imagemin(imageminOptions)).pipe(gulp.dest('_out/img')).pipe(browserSync.stream());

const serve = (cb) => browserSync.init({
  server: "_out"
});



const watchCSS = (cb) => gulp.watch("_src/css/*.css", css);
const watchHTML = (cb) => gulp.watch("_src/index.html", html);

exports.images = images;
exports.watch = gulp.parallel(watchCSS, watchHTML);
exports.serve = serve;
exports.clean = clean;
exports.build = gulp.series(clean, gulp.parallel(css, html, images), gulp.parallel(watchCSS, watchHTML, serve));