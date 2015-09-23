var util = require('util');
var path = require('path');
var exec = require('shelljs').exec;
var generators = require('yeoman-generator');

var StaticGenerator = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.on('end', function () {
          exec('npm install --save-dev gulp');
          exec('npm install --save-dev vinyl-source-stream');
          exec('npm install --save-dev browserify');
          exec('npm install --save-dev gulp-rename');
          exec('npm install --save-dev gulp-ruby-sass');
          exec('npm install --save-dev gulp-util');
          exec('npm install --save-dev babelify');
          exec('npm install --save-dev uglifyify')
        });
        
        this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    }
});

StaticGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
      type: 'prompt',
      name: 'title',
      message: 'What is the title of the app',
      default: 'My App'
    },{
      type: 'prompt',
      name: 'srcDirectory',
      message: 'what is the directory of your src assets (put . for root directory)',
      default: 'src'
    },{
      type: 'prompt',
      name: 'builtDirectory',
      message: 'what is the directory of your built assets',
      default: 'built'
    },{
      type: 'prompt',
      name: 'cssName',
      message: 'what is your start css/sass file name?',
      default: 'default'
    },{
      type: 'prompt',
      name: 'jsName',
      message: 'what is your start js file name?',
      default: 'index'
    }];

    this.prompt(prompts, function (props) {
      this.title = props.title;
      if (props.srcDirectory === '.') {
        this.src = '';
      } else {
        this.src = props.srcDirectory;
      }
      this.cssName = props.cssName;
      this.jsName = props.jsName;
      this.builtDir = props.builtDirectory;

      this.cssDir = this.src + '/' + 'css';
      this.jsDir = this.src + '/' + 'js';
      this.cssFile = this.cssDir + '/' + this.cssName + '.scss';
      this.jsFile = this.jsDir + '/' + this.jsName + '.js';
      cb();
    }.bind(this));
};

StaticGenerator.prototype.createStubFiles = function createStubFiles() {
  this.mkdir(this.src);
  this.mkdir(this.builtDir);
  this.mkdir(this.cssDir);
  this.mkdir(this.jsDir);
  this.copy('blank.txt', this.cssFile);
  this.copy('blank.txt', this.jsFile);
};

StaticGenerator.prototype.createTemplate = function createTemplate() {
  this.includeCSS = '<link rel="stylesheet" href="' + this.builtDir + '/' + this.cssName + '.css">';
  this.includeScript = '<script src="' + this.builtDir + '/' + this.jsName +'.js"></script>';
  this.template('_index.html', 'index.html');
  this.template('_gulpfile.js', 'gulpfile.js');
};

StaticGenerator.prototype.appFiles = function app() {
  this.copy('gitignore', '.gitignore');
  this.template('_package.json', 'package.json');
};

module.exports = StaticGenerator;