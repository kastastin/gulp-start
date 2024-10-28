const clean = require("gulp-clean");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const scss = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const { src, dest, watch, parallel, series } = require("gulp");

function buildStyles() {
  return src("src/scss/style.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(dest("src/css"))
    .pipe(browserSync.stream());
}

function buildScripts() {
  return src(["node_modules/swiper/swiper-bundle.js", "src/js/script.js"])
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(dest("src/js"))
    .pipe(browserSync.stream());
}

function watchFiles() {
  watch("src/scss/style.scss", buildStyles);
  watch("src/js/script.js", buildScripts);
  watch("src/*.html").on("change", browserSync.reload);
}

function browserSyncFn() {
  browserSync.init({
    server: {
      baseDir: "src/",
    },
  });
}

function cleanDist() {
  return src("dist").pipe(clean());
}

function buildDist() {
  return src(
    ["src/css/style.min.css", "src/js/script.min.js", "src/**/*.html"],
    { base: "src" }
  ).pipe(dest("dist"));
}

exports.watchFiles = watchFiles;
exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.browserSyncFn = browserSyncFn;

exports.build = series(cleanDist, buildDist);

exports.default = parallel(
  buildStyles,
  buildScripts,
  browserSyncFn,
  watchFiles
);
