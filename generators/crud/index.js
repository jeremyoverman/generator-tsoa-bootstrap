'use strict';
const Generator = require('../../CustomGenerator');

module.exports = class extends Generator {
  prompting() {
    let regex = /[a-zA-Z]+[a-zA-Z0-9_]*/;
    return this.prompt([
      {
        type: 'input',
        name: 'controller',
        message: 'Controller Name',
        validate(input) {
          return regex.test(input);
        }
      },
      {
        type: 'input',
        name: 'model',
        message: 'Model name',
        validate(input) {
          return regex.test(input);
        }
      }
    ]).then(answers => {
      this.answers = answers;

      let controller = answers.controller;
      let model = answers.model;

      this.answers.upperModel = model.charAt(0).toUpperCase() + model.slice(1);
      this.answers.lowerModel = model.charAt(0).toLowerCase() + model.slice(1);
      this.answers.upperRoute = controller.charAt(0).toUpperCase() + controller.slice(1);
      this.answers.lowerRoute = controller.charAt(0).toLowerCase() + controller.slice(1);

      this.answers.support = this.answers.upperModel + 'Support';
    });
  }

  writing() {
    let controllerFilename = this.answers.lowerRoute + '.ts';
    let modelFilename = this.answers.lowerModel + '.ts';
    let daoSpecFilename = this.answers.lowerModel + '.spec.ts';
    let controllerSpecFilename = this.answers.lowerRoute + '.spec.ts';

    this.alterTpl(
      this.destinationPath('controllers/' + controllerFilename),
      {
        imports: this.templatePath('controller/imports.ts'),
        subroutes: this.templatePath('controller/subroutes.ts')
      },
      this.answers
    );

    this.alterTpl(
      this.destinationPath('sequelize/dao/' + modelFilename),
      {
        methods: this.templatePath('dao/methods.ts')
      },
      this.answers
    );

    this.alterTpl(
      this.destinationPath('spec/controllers/' + controllerSpecFilename),
      {
        specs: this.templatePath('spec/controller/specs.ts')
      },
      this.answers
    );

    this.alterTpl(
      this.destinationPath('spec/dao/' + daoSpecFilename),
      {
        specs: this.templatePath('spec/dao/specs.ts')
      },
      this.answers
    );
  }
};
