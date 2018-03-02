const gulp = require('gulp');
const ts = require('gulp-typescript');
const child_process = require('child_process');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const fs = require('fs');

const swagger = ['swagger/swagger.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

function runTSOA(cmd) {
    return new Promise((resolve, reject) => {
        let output = '';

        let proc = child_process.spawn('node', [
            './node_modules/tsoa/dist/cli.js',
            cmd
        ]).on('close', code => {
            if (code > 0) {
                reject(new Error(output));
            } else {
                resolve();
            }
        }).on('error', (err) => {
            reject(err);
        });
        
        proc.stderr.on('data', data => {
            output += data
        });

        proc.stdout.on('data', data => {
            output += data
        });
    });
}

gulp.task('scripts', (cb) => {
    runTSOA('routes').then(() => {
        gulp.src(['**/*.ts', '!node_modules/**/*'])
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('./', {
                includeContent: false,
                sourceRoot: (file) => {
                    return path.posix.relative(path.posix.dirname(file.relative), "");
                }
            }))
            .pipe(gulp.dest('dist'))
            .on('end', _ => {
                cb();
            })
    }).catch(err => {
        cb(err);
    });
});

gulp.task('swagger', function (cb) {
    runTSOA('swagger')
        .then(_ => cb())
        .catch(err => {
            cb(err);
        });
});

gulp.task('copy-files', ['swagger'], function () {
    gulp.src([
        '**/*.json',
        '!node_modules/**/*',
        '!.vscode/**/*',
        '!dist/**/*'
    ]).pipe(gulp.dest('dist/'));
});

gulp.task('default', ['scripts', 'copy-files']);