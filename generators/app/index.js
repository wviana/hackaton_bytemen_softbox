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
      default: 'localhost'
    }, {
      type: 'input',
      name: 'user',
      message: 'user',
      default: 'iceinvestimentos'
    }, {
      type: 'input',
      name: 'password',
      message: 'password',
      default: 'iceinvestimentos'
    }, {
      type: 'input',
      name: 'database',
      message: 'database',
      default: 'hackathon'
    }, ];

    return this.prompt(prompts).then(function(props) {
      this.props = props;

      var DbClass = require(`../../helper/${props.driver}Driver.js`)

      this.pg = new DbClass(props.host, props.user, props.password, props.database);

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

    this.pg.getSchema((schemas) => {
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
        this._copyTpl(`java/${basePath}/resources/_resources.js`, `./${basePath}/resources/${upperCamel(tableName)}Resources.java`, data);
        this._copyTpl(`java/${basePath}/service/_service.js`, `./${basePath}/service/${upperCamel(tableName)}Service.java`, data);
        this._copyTpl(`java/${basePath}/repository/_repository.js`, `./${basePath}/repository/${upperCamel(tableName)}Repository.java`, data);

      }
	
      this._copy('java/src/main/java/com/softbox/GeneratorApplication.java', './src/main/java/com/softbox/GeneratorApplication.java');
 	  this._copy('java/src/main/java/com/softbox/generator/service/exception/RecursoNaoEncontradoException.java', './src/main/java/com/softbox/generator/service/exception/RecursoNaoEncontradoException.java');
 	  this._copy('java/src/main/resources/application.properties', './src/main/resources/application.properties');
      this._copy('java/.gitignore', './.gitignore');
      this._copy('java/build.gradle', './build.gradle');
      this._copy('java/gradlew', './gradlew');
      this._copy('java/gradlew.bat', './gradlew.bat');

      this._install();
    });
  },

  _copyTpl: function(from, to, dados) {
    this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), dados);
  },

  _copy: function(from, to) {
    this.fs.copy(this.templatePath(from), this.destinationPath(to))
  },

  _install: function() {
    this.destinationRoot('./src/front');
    this.installDependencies({
      bower: false
    });
  }
});
