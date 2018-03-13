'use strict';
const Generator = require('../../CustomGenerator');

function standardizeAnswers(answers) {
  let name = answers.name;

  answers.upperName = name.charAt(0).toUpperCase() + name.slice(1);
  answers.lowerName = name.charAt(0).toLowerCase() + name.slice(1);

  return answers;
}

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('name', {
      required: true,
      type: String
    });
  }

  prompting() {
    if (/^INDEX$/.test(this.options.name.toUpperCase())) {
      throw new Error('Cannot name model index');
    }

    this.answers = standardizeAnswers({
      name: this.options.name
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
