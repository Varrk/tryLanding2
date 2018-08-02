const gulp = require('gulp');
const browserSync = require('browser-sync');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
//const uglify = require('gulp-uglify');
//const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

/* ------server--------*/
gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });

    gulp.watch('build/**/*').on('change', browserSync.reload);

});

/* -------pug-compile------- */
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/templates/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/* -------styles compile------- */
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('build/css'));
});

/* -------js------- */
//gulp.task('js', function () {
//    return gulp.src([
//    return gulp.src([
//        ])
//        .pipe(sourcemaps.init())
//        .pipe(concat('main.min.js'))
//        .pipe(uglify())
//        .pipe(sourcemaps.write())
//        .pipe(gulp.dest('build/js'))
//});
/* -------sprites------- */
gulp.task('sprite', function (cb) {
    let spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/* -------delete------- */
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

/* -------copy fonts-------*/
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/* -------copy images-------*/
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/* -------copy------- */
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

/* -------watchers------- */
gulp.task('watch', function (done) {
    gulp.watch('source/templates/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
    //gulp.watch('source/js/**/*.js', gulp.series('js'));
    done();
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', /*'js',*/ 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));