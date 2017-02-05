'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = Generator.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the wondrous ' + chalk.red('generator-hackathon') + ' generator!'
    ));

    var prompts = [{
      type: 'list',
      name: 'driver',
      message: 'Qual driver deseja utilizar?',
      choices: [{
        name: 'postgres',
        value: 'Postgres',
        checked: false
      }]
    }, {
      type: 'input',
      name: 'host',
      message: 'host'
    }, {
      type: 'input',
      name: 'user',
      message: 'user'
    }, {
      type: 'input',
      name: 'password',
      message: 'password'
    }, {
      type: 'input',
      name: 'database',
      message: 'database'
    },];

    return this.prompt(prompts).then(function (props) {
      this.props = props;

      var DbClass = require(`../../helper/${props.driver}Driver.js`)

      this.pg = new DbClass(props.host, props.user, props.password, props.database);

      this.pg.getSchema((res) => console.log(res));
    
      this.features = props.features || [];
      this.projectName = props.project;
    
      this._configFeatures([
        'includeRouter',
        'includeVuestrap'
      ]);
	  
    }.bind(this));
  },
  
  _configFeatures: function (possibleFeatures) {
    possibleFeatures.forEach(this._configFeature.bind(this))
  },
  
  _configFeature: function (feat) {
    this[feat] = this._hasFeature(feat)
    this.config.set(feat, this[feat])
  },
  
  _hasFeature: function (feat) {
    return this.features.indexOf(feat) !== -1
  },

  writing: function () {
	  this._copy('dummyfile.txt', 'dummyfile.txt');
	  this._writingVue();
  },
  
  _writingVue: function() {
    this._copyTpl('vue/_package.json', './src/front/package.json')
    this._copyTpl('vue/_index.html', './src/front/index.html')
    this._copyTpl('vue/_main.js', './src/front/src/main.js')
    this._copyTpl('vue/_app.vue', './src/front/src/app.vue')
    this._copyTpl('vue/_styles.css', './src/front/src/styles.css')
    this._copyTpl('vue/_webpack.config.js', './src/front/webpack.config.js')
    this._copyTpl('vue/_webpack.production.js', './src/front/webpack.production.js')
    this._copy('vue/_gitignore', './src/front/.gitignore')
    this._copy('vue/_babelrc', './src/front/.babelrc')
    this._copy('vue/_eslintrc', './src/front/.eslintrc')
    this._copy('vue/_editorconfig', './src/front/.editorconfig')
  },
  
  _copyTpl: function (from, to) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), this)
  },
  
  _copy: function (from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to))
  },

  install: function () {
	this.destinationRoot('./src/front');
    this.installDependencies({bower: false});
  }
});