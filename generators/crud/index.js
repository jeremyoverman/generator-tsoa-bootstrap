'use strict';
const Generator = require('yeoman-generator');
const updateDAO = require('./lib/updateDAO');
const updateController = require('./lib/updateController');

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
    let controllerFilename = this.answers.lowerControllerName + '.ts';
    let modelFilename = this.answers.lowerModelName + '.ts';

    let controllerText = this.fs.read(
      this.destinationPath('controllers/' + controllerFilename)
    );

    let daoText = this.fs.read(this.destinationPath('sequelize/dao/' + modelFilename));

    let controllerResult = updateController.template(controllerText, this.answers.model);
    let daoResult = updateDAO.template(daoText, this.answers.model);

    this.fs.write(
      this.destinationPath('controllers/' + controllerFilename),
      controllerResult
    );

    this.fs.write(this.destinationPath('sequelize/dao/' + modelFilename), daoResult);
  }
};
