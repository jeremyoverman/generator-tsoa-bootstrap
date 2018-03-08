'use strict';
const Generator = require('yeoman-generator');
const commentTemplate = require('../../lib/commentTemplate');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Model name',
        validate(input) {
          if (input.toUpperCase() === 'INDEX') return false;

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
    let specFile = this.answers.lowerName + '.spec.ts';

    this.fs.copyTpl(
      this.templatePath('model.ts'),
      this.destinationPath('sequelize/models/' + filename),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('dao.ts'),
      this.destinationPath('sequelize/dao/' + filename),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('spec.ts'),
      this.destinationPath('spec/dao/' + specFile),
      this.answers
    );

    this.fs.copyTpl(
      this.templatePath('support.ts'),
      this.destinationPath('spec/support/model/' + filename),
      this.answers
    );

    let dbConnection = this.fs.read(this.destinationPath('sequelize/dbConnection.ts'));

    let result = commentTemplate.commentTpl(dbConnection, {
      import: `import { T${this.answers.upperName}Model } from './models/${
        this.answers.lowerName
      }'`,
      type: `    ${this.answers.lowerName}: T${this.answers.upperName}Model;`
    });

    this.fs.write(this.destinationPath('sequelize/dbConnection.ts'), result);
  }
};
