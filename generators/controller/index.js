'use strict';
const Generator = require('yeoman-generator');
const commentTemplate = require('../../lib/commentTemplate');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Controller name',
        validate(input) {
          return /[a-zA-Z]+[a-zA-Z0-9_]*/.test(input);
        }
      }
    ]).then(answers => {
      this.answers = answers;

      let name = answers.name;

      this.answers.upperName = name.charAt(0).toUpperCase() + name.slice(1);
      this.answers.lowerName = name.charAt(0).toLowerCase() + name.slice(1);
    });
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

    let dbConnection = this.fs.read(this.destinationPath('index.ts'));

    let result = commentTemplate.commentTpl(dbConnection, {
      import: `import "./controllers/${this.answers.lowerName}";`
    });

    this.fs.write(this.destinationPath('index.ts'), result);
  }
};
