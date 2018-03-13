'use strict';
const Generator = require('../../CustomGenerator');
const pluralize = require('pluralize');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('name', {
      required: true,
      type: String,
      description: 'The name of the model. Will be singularized'
    });
  }

  prompting() {
    if (/^INDEX$/.test(this.options.name.toUpperCase())) {
      throw new Error('Cannot name model index');
    }

    let name = pluralize.singular(this.options.name);

    this.answers = {
      name: name,
      upperName: this.upperCase(name),
      lowerName: this.lowerCase(name)
    };
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
