var gulp = require('gulp')
    , watch = require('gulp-watch')
    , plumber = require('gulp-plumber')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , rename = require('gulp-rename')
    , jshint = require('gulp-jshint')
    , cssmin = require('gulp-cssmin')

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

//Local Build
gulp.task('localBuild', ['buildTemplates', 'buildCss'], function(){
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

//Build the CSS
gulp.task('buildCss', function(){
    'use strict';

    gulp.src(['public/stylesheets/**/*.css'])
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('public/stylesheets/built/'));
});

//Build the Templates
gulp.task('buildTemplates', function(){
    'use strict';

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