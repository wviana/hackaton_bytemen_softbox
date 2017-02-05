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
      message: 'host',
      default: '192.168.99.101'
    }, {
      type: 'input',
      name: 'user',
      message: 'user',
      default: 'root'
    }, {
      type: 'input',
      name: 'password',
      message: 'password',
      default: 'root'
    }, {
      type: 'input',
      name: 'database',
      message: 'database',
      default: 'teste'
    },];

    return this.prompt(prompts).then(function (props) {
      this.props = props;

      var DbClass = require(`../../helper/${props.driver}Driver.js`)

      this.pg = new DbClass(props.host, props.user, props.password, props.database);

      this.pg.getSchema((res) => {this._writingBack(res)})
    
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
	  //this._writingVue();
    this._writingBack();
  },
  
  _writingVue: function() {
    //this._copyTpl('vue/_package.json', './src/front/package.json')
  },

  _writingBack: function(data) {
    for (var dados in data) {
      //setData(data[dados])
      console.log(data[dados]);

      this._copyTpl('java/src/main/java/com/softbox/generator/domain/_domain.js', './src/java/main/' + data[dados][0].table_name + '.java')
    }
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