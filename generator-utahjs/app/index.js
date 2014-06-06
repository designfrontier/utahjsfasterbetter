'use strict';
var util = require('util')
    , path = require('path')
    , yeoman = require('yeoman-generator')
    , yosay = require('yosay')
    , chalk = require('chalk')
    , exec = require('child_process').exec
    , UtahJSGenerator;


UtahJSGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  }

  , askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('I see you\'ve had another idea!'));

    var prompts = [{
      name: 'projectName',
      message: 'What are we calling this project?'
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;

      done();
    }.bind(this));
  }

  , makeDirs: function () {
    this.mkdir('bin');
    this.mkdir('public');
    this.mkdir('routes');
    this.mkdir('views');

    this.mkdir('public/images');
    this.mkdir('public/fonts');
    this.mkdir('public/javascripts');
    this.mkdir('public/javascripts/components');

    this.mkdir('public/stylesheets');
  }

  , app: function () {
    //copy the startup script
    this.copy('bin/www', 'bin/www');

    //copy the views for express and node
    this.directory('views/', 'views/');

    //copy the base route handlers for express
    this.template('routes/_index.js', 'routes/index.js');
    this.copy('routes/users.js', 'routes/users.js');

    //copy some stylesheets
    this.directory('public/stylesheets/');

    //copy some js files over
    this.directory('public/javascripts/');

    //copy the base express application file
    this.copy('app.js', 'app.js');

    //copy the package.json and bower.json files
    this.template('_package.json', 'package.json');
  }

  , projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.template('_Gulpfile.js', 'Gulpfile.js');
    this.copy('.gitignore', '.gitignore');
  }

  , gitAndHeroku: function(){
    var projectName = this.projectName;

    exec('git init .', function(){
      exec('git add .', function(){
        exec('git commit -m "initial commit of ' + projectName + '"', function(){
          exec('heroku create ' + projectName, function (error, stdout, stderr) {
            exec('git push heroku master', function(){
              //Yep we just depoyed the base project to the cloud
            });
          });
        });
      })
    });
  }
});

module.exports = UtahJSGenerator;
