'use strict';
const Generator = require('../../CustomGenerator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Model name',
        required: true,
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

    this.alterTpl(
      this.destinationPath('sequelize/dbConnection.ts'),
      {
        import: this.templatePath('dbConnection/import.ts'),
        type: this.templatePath('dbConnection/type.ts')
      },
      this.answers
    );
  }
};
