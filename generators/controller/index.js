'use strict';
const Generator = require('../../CustomGenerator');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('name', {
      description: 'The name of the controller'
    });
  }

  prompting() {
    this.answers = {
      upperName: this.upperCase(this.options.name),
      lowerName: this.lowerCase(this.options.name)
    };
  }

  writing() {
    let filename = this.answers.lowerName + '.ts';

    this.fs.copyTpl(
      this.templatePath('controller.ts'),
      this.destinationPath('controllers/' + filename),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('spec.ts'),
      this.destinationPath('spec/controllers/' + this.answers.lowerName + '.spec.ts'),
      this.answers
    );

    this.alterTpl(
      this.destinationPath('index.ts'),
      {
        import: this.templatePath('index/import.ts')
      },
      this.answers
    );
  }
};
