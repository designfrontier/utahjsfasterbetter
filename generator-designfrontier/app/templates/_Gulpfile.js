var gulp = require('gulp')
    , watch = require('gulp-watch')
    , plumber = require('gulp-plumber')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , rename = require('gulp-rename')
    , jshint = require('gulp-jshint')

    , handlebars = require('gulp-handlebars')
    , defineModule = require('gulp-define-module')
    , declare = require('gulp-declare')

    , pkg = require('./package.json');

gulp.task('default', ['localBuild'], function(){
    'use strict';

    gulp.watch([
                'public/javascripts/libs/*.js'
                , 'public/javascripts/app.js'
                , 'public/javascripts/components/**/*.js'
                , 'templates/*.html'
                , 'public/javascripts/components/**/*-template.html'
            ], function(){
        gulp.run('localBuild');
    });
});

gulp.task('localBuild', ['buildTemplates'], function(){
    'use strict';
    
    gulp.src([
            'public/javascripts/libs/*.js'
            , 'public/javascripts/app.js'
            , 'public/javascripts/built/templates.js'
            , './public/javascripts/components/**/*.js'
            ,'!./public/javascripts/components/**/*_test.js'
        ])
        .pipe(concat('app.js'))
        // .pipe(jshint())
        // .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('public/javascripts/built/'))
        .pipe(uglify());
});

gulp.task('buildTemplates', function(){
    gulp.src([
            './templates/*.html'
            , './public/javascripts/components/**/*-template.html'
        ])
        .pipe(handlebars())
        .pipe(defineModule('plain'))
        .pipe(declare({
          namespace: 'action.templates'
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest("./public/javascripts/built/"));
});

gulp.task('build:prod', ['buildTemplates', 'localBuild'], function(){
    'use strict';
    
    gulp.src([
            'public/javascripts/action/*.min.js'
            , 'public/javascripts/built/*.min.js'
        ])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts/built/'));
});

//this one only really works in my directory structure... 
//  it pulls files from the action repo so I can update fast and easy
gulp.task('updateAction', function(){
    gulp.src(['../Action/packages/latest/*.js'])
        // .pipe(rename(''))
        .pipe(gulp.dest('./public/javascripts/action'));
});