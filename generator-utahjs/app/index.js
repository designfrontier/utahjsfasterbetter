'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var DesignfrontierGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
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
  },

  makeDirs: function () {
    this.mkdir('bin');
    this.mkdir('public');
    this.mkdir('routes');
    this.mkdir('views');

    this.mkdir('public/images');
    this.mkdir('public/javascripts');
    this.mkdir('public/javascripts/components');
    this.mkdir('public/javascripts/libs');

    this.mkdir('public/stylesheets');
  },

  app: function () {
    //copy the startup script
    this.copy('bin/www', 'bin/www');

    //copy the views for express and node
    this.copy('views/error.ejs', 'views/error.ejs');
    this.copy('views/index.ejs', 'views/index.ejs');

    //copy the base route handlers for express
    this.template('routes/_index.js', 'routes/index.js');
    this.copy('routes/users.js', 'routes/users.js');

    //copy some stylesheets
    this.copy('public/stylesheets/style.css', 'public/stylesheets/style.css');

    //copy the base express application file
    this.copy('app.js', 'app.js');

    //copy the package.json and bower.json files
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.template('_Gulpfile.js', 'Gulpfile.js');
  }
});

module.exports = DesignfrontierGenerator;
