'use strict';
const Generator = require('yeoman-generator');
const updateDAO = require('./lib/updateDAO');
const updateDAOSpec = require('./lib/updateDAOSpec');
const updateController = require('./lib/updateController');
const updateControllerSpec = require('./lib/updateControllerSpec');

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

      this.answers.upperModelName = model.charAt(0).toUpperCase() + model.slice(1);
      this.answers.lowerModelName = model.charAt(0).toLowerCase() + model.slice(1);
      this.answers.upperControllerName =
        controller.charAt(0).toUpperCase() + controller.slice(1);
      this.answers.lowerControllerName =
        controller.charAt(0).toLowerCase() + controller.slice(1);
    });
  }

  writing() {
    /* Get filenames */
    let controllerFilename = this.answers.lowerControllerName + '.ts';
    let modelFilename = this.answers.lowerModelName + '.ts';
    let daoSpecFilename = this.answers.lowerModelName + '.spec.ts';
    let controllerSpecFilename = this.answers.lowerControllerName + '.spec.ts';

    /* Get file contents */
    let controllerText = this.fs.read(
      this.destinationPath('controllers/' + controllerFilename)
    );

    let daoText = this.fs.read(this.destinationPath('sequelize/dao/' + modelFilename));

    let daoSpecText = this.fs.read(this.destinationPath('spec/dao/' + daoSpecFilename));

    let controllerSpecText = this.fs.read(
      this.destinationPath('spec/controllers/' + controllerSpecFilename)
    );

    /* Replace file contents */
    let controllerResult = updateController.template(controllerText, this.answers.model);
    let daoResult = updateDAO.template(daoText, this.answers.model);
    let daoSpecResult = updateDAOSpec.template(daoSpecText, this.answers.model);
    let controllerSpecResult = updateControllerSpec.template(
      controllerSpecText,
      this.answers.controller,
      this.answers.model
    );

    /* Rewrite files */
    this.fs.write(
      this.destinationPath('controllers/' + controllerFilename),
      controllerResult
    );

    this.fs.write(this.destinationPath('sequelize/dao/' + modelFilename), daoResult);

    this.fs.write(this.destinationPath('spec/dao/' + daoSpecFilename), daoSpecResult);

    this.fs.write(
      this.destinationPath('spec/controllers/' + controllerSpecFilename),
      controllerSpecResult
    );

    /* Copy extra files */

    this.fs.copy(
      this.templatePath('support.ts'),
      this.destinationPath('spec/support/model/' + modelFilename)
    );
  }
};
