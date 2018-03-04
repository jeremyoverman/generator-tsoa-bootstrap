'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name'
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('config/_package.json'),
      this.destinationPath('package.json'),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('app/'),
      this.destinationPath(),
      this.answers,
      {},
      {
        globOptions: {
          dot: true
        }
      }
    );
  }

  install() {
    this.installDependencies({ npm: true, bower: false });

    this.spawnCommandSync('git', ['init', '--quiet']);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', 'Initial Commit', '--quiet']);
  }
};
