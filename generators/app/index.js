'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var changeCase = require('change-case');

module.exports = Generator.extend({
  prompting: function() {
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
    }, ];

    return this.prompt(prompts).then(function(props) {
      this.props = props;

      var DbClass = require(`../../helper/${props.driver}Driver.js`)

      this.pg = new DbClass(props.host, props.user, props.password, props.database);

      this.pg.getSchema((res) => {
        this._writingBack(res)
      })

      this.features = props.features || [];
      this.projectName = props.project;

      this._configFeatures([
        'includeRouter',
        'includeVuestrap'
      ]);

    }.bind(this));
  },

  _configFeatures: function(possibleFeatures) {
    possibleFeatures.forEach(this._configFeature.bind(this))
  },

  _configFeature: function(feat) {
    this[feat] = this._hasFeature(feat)
    this.config.set(feat, this[feat])
  },

  _hasFeature: function(feat) {
    return this.features.indexOf(feat) !== -1
  },

  writing: function() {
    //this._writingVue();
    this._writingBack();
  },

  _writingVue: function() {
    //this._copyTpl('vue/_package.json', './src/front/package.json')
  },

  _writingBack: function(schemas) {
    var dbToJava = require('../../helper/DbTypeConverter.js');

    var upperCamel = (text) => changeCase.upperCaseFirst(changeCase.camelCase(text));

    for (var tableName in schemas) {
      const data = {
        table: tableName,
        columns: schemas[tableName],
        dbToJava: dbToJava,
        camelCase: changeCase.camelCase,
        upperCamel: upperCamel
      };

      const basePath = 'src/main/java/com/softbox/generator';
      this._copyTpl(`java/${basePath}/domain/_domain.js`, `./${basePath}/domain/${upperCamel(tableName)}.java`, data);
      this._copyTpl(`java/${basePath}/resources/_resources.js`, `./${basePath}/resources/${upperCamel(tableName)}.java`, data);
      this._copyTpl(`java/${basePath}/service/_resources.js`, `./${basePath}/service/${upperCamel(tableName)}.java`, data);
    }
  },

  _copyTpl: function(from, to, dados) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), dados);
  },

  _copy: function(from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to))
  },

  install: function() {
    this.destinationRoot('./src/front');
    this.installDependencies({
      bower: false
    });
  }
});
