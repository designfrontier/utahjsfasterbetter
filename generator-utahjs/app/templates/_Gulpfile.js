var gulp = require('gulp')
    , watch = require('gulp-watch')
    , concat = require('gulp-concat')
    , uglify = require('gulp-uglify')
    , cssmin = require('gulp-cssmin')
    , htmlreplace = require('gulp-html-replace')

    , pkg = require('./package.json');

gulp.task('default', ['localBuild'], function(){
    'use strict';

    gulp.watch([
                'public/javascripts/libs/*.js'
                , 'public/javascripts/app.js'
                , 'public/javascripts/components/**/*.js'
                , 'public/stylesheets/*.css'
                , 'templates/*.html'
                , 'public/javascripts/components/**/*-template.html'
                , '!public/javascripts/built/*.js'
                , '!public/stylesheets/built/*.css'
            ], function(){
        gulp.run('localBuild');
    });
});

//Local Build
gulp.task('localBuild', ['buildCSS', 'buildJS'], function(){
    'use strict';

});

//Build the CSS
gulp.task('buildCSS', function(){
    'use strict';

    gulp.src(['public/stylesheets/**/*.css'])
        .pipe(concat('main.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('public/stylesheets/built/'));
});

//BUild the js
gulp.task('buildJS', function(){
    'use strict';

    gulp.src([
            'public/javascripts/libs/*.js'
            , 'public/javascripts/app.js'
            , 'public/javascripts/built/templates.js'
            , './public/javascripts/components/**/*.js'
            ,'!./public/javascripts/components/**/*_test.js'
        ])
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascripts/built/'));
});

gulp.task('buildFinal', ['buildJS', 'buildCSS'], function(){
    'use strict';

    gulp.src(['views/*.ejs'])
        .pipe(htmlreplace({
            js: '/javascripts/built/app.js'
            , css: '/stylesheets/built/main.css'
        }))
        .pipe(gulp.dest('views/'))
});