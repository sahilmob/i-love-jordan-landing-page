const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon');
const mainBowerFiles = require('main-bower-files');
const sourcemaps = require('gulp-sourcemaps');

const reload = browserSync.reload;

var config = {
    bootstrapDir: "./bower_components/bootstrap/",
    fontawesomeDir: './bower_components/fontawesome/',
    publicDir: './dist/public',
    imgDir: './src/public/img',
    videoDir: './src/public/video',
    bowerDir: './bower_components'
}

gulp.task('bower', function () {
    return gulp.src(mainBowerFiles(), {
        base: "bower_components"
    })
        .pipe(gulp.dest(config.publicDir + "/lib"))
});

gulp.task('fonts', function () {
    return gulp.src(config.fontawesomeDir + '/web-fonts-with-css/webfonts/**.*')
        .pipe(gulp.dest(config.publicDir + '/webfonts'))
});

gulp.task('sass', function () {
    return gulp.src('./src/public/sass/**/*.scss', config.bootstrapDir + '/scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [config.bootstrapDir + '/scss', config.fontawesomeDir + '/web-fonts-with-css/scss']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('sassBuild', function () {
    return gulp.src('./src/public/sass/**/*.scss', config.bootstrapDir + '/scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [config.bootstrapDir + '/scss', config.fontawesomeDir + '/web-fonts-with-css/scss']
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss({ compatibility: 'ie8' }))
        .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('html', function () {
    return gulp.src('./src/public/*.html')
        .pipe(gulp.dest(config.publicDir))
})

gulp.task('js', function () {
    return gulp.src(['./src/public/js/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.publicDir + '/js'))
})

gulp.task('jsBuild', function () {
    return gulp.src(['./src/public/js/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.publicDir + '/js'))
})

gulp.task('img', function () {
    return gulp.src(config.imgDir + '/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.publicDir + '/img'))
})

gulp.task('video', function () {
    return gulp.src(config.videoDir + '/*')
        .pipe(gulp.dest(config.publicDir + '/video'))
})

gulp.task('nodemon', function (cb) {
    var started = false;
    return nodemon({
        script: 'server.js',
        ext: "js",
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
            gulp.watch(config.bowerDir, gulp.parallel('bower')).on('change', reload);
            gulp.watch('./src/public/js/*.*', gulp.parallel('js')).on('change', reload);
            gulp.watch('./src/public/sass/*.*', gulp.parallel('sass')).on('change', reload);
            gulp.watch('./src/public/img/*.*', gulp.parallel('img')).on('change', reload);
            gulp.watch('./src/public/video/*.*', gulp.parallel('video')).on('change', reload);
            gulp.watch('./src/public/*.html', gulp.parallel('html')).on('change', reload);
            gulp.watch(config.fontawesomeDir + '/web-fonts-with-css/webfonts/**.*', gulp.parallel('fonts')).on('change', reload);
        }
    })
})

gulp.task('start', gulp.series('bower', 'video', 'fonts', 'sass', 'html', 'js', 'img', 'nodemon', function () {
    browserSync.init({
        proxy: "http://localhost:3000",
        files: ['/dist/public/**/*.*'],
        browser: "chrome",
        port: 7000
    })
}))

gulp.task('default', gulp.parallel('start'));
gulp.task('build', gulp.series('bower', 'video', 'fonts', 'sassBuild', 'html', 'jsBuild', 'img'));