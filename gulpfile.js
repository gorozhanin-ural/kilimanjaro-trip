const gulp = require("gulp");
const concat = require("gulp-concat-css");
const plumber = require("gulp-plumber");
const del = require("del");
const browserSync = require("browser-sync").create();
const postcss = require("gulp-postcss");
const build = gulp.series(
  clean,
  gulp.parallel(html, css, fonts, js, images, icons, vendor)
);
const watchapp = gulp.parallel(build, watchFiles, serve);
const autoprefixer = require("autoprefixer");
const mediaquery = require("postcss-combine-media-query");
const cssnano = require("cssnano");
const htmlMinify = require("html-minifier");

function html() {
  const options = {
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true,
    collapseWhitespace: true,
    minifyCSS: true,
    keepClosingSlash: true,
  };
  return gulp
    .src("src/**/*.html")
    .pipe(plumber())
    .on("data", function (file) {
      const buferFile = Buffer.from(
        htmlMinify.minify(file.contents.toString(), options)
      );
      return (file.contents = buferFile);
    })
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  const plugins = [autoprefixer(), mediaquery(), cssnano()];
  return gulp
    .src("src/styles/**/**/*.css")
    .pipe(plumber())
    .pipe(concat("bundle.css"))
    .pipe(postcss(plugins))
    .pipe(gulp.dest("dist/"))
    .pipe(browserSync.reload({ stream: true }));
}

function images() {
  return gulp
    .src("src/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}")
    .pipe(gulp.dest("dist/images"))
    .pipe(browserSync.reload({ stream: true }));
}

function icons() {
  return gulp
    .src("src/icons/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}")
    .pipe(gulp.dest("dist/icons"))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp
    .src("src/fonts/**/*.{ttf,woff,woff2,txt}")
    .pipe(gulp.dest("dist/fonts"))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return gulp
    .src("src/js/**/*.{js,.min.js}")
    .pipe(gulp.dest("dist/js"))
    .pipe(browserSync.reload({ stream: true }));
}

function vendor() {
  return gulp
    .src("src/vendor/**/*")
    .pipe(gulp.dest("dist/vendor"))
    .pipe(browserSync.reload({ stream: true }));
}

function clean() {
  return del("dist");
}

function watchFiles() {
  gulp.watch(["src/**/*.html"], gulp.series(html));
  gulp.watch(["src/**/**/*.css"], gulp.series(css));
  gulp.watch(
    ["src/images/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}"],
    gulp.series(images)
  );
  gulp.watch(
    ["src/icons/**/*.{jpg,jpeg,png,svg,gif,ico,webp,avif}"],
    gulp.series(icons)
  );
  gulp.watch(["src/fonts/**/*.{ttf,woff,woff2,txt}"], gulp.series(fonts));
  gulp.watch(["src/js/**/*.{js,.min.js}"], gulp.series(js));
  gulp.watch(["src/vendor/**/*"], gulp.series(vendor));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
}

exports.html = html;
exports.css = css;
exports.images = images;
exports.icons = icons;
exports.fonts = fonts;
exports.js = js;
exports.vendor = vendor;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
