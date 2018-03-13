'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('name', {
      description: 'The name of the project'
    });

    this.answers = {
      name: this.options.name
    };
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
