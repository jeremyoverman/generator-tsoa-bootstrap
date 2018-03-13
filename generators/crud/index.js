'use strict';
const Generator = require('../../CustomGenerator');
const pluralize = require('pluralize');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('controller', {
      description: 'The controller name'
    });

    this.argument('model', {
      description: 'The model name. Defaults to the singular controller name',
      required: false
    });
  }

  prompting() {
    if (!this.options.model) {
      this.options.model = pluralize.singular(this.options.controller);
    }

    this.answers = {
      upperModel:
        this.options.model.charAt(0).toUpperCase() + this.options.model.slice(1),
      lowerModel:
        this.options.model.charAt(0).toLowerCase() + this.options.model.slice(1),
      upperRoute:
        this.options.controller.charAt(0).toUpperCase() +
        this.options.controller.slice(1),
      lowerRoute:
        this.options.controller.charAt(0).toLowerCase() + this.options.controller.slice(1)
    };

    this.answers.support = this.answers.upperModel + 'Support';
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
        specs: this.templatePath('spec/controller/specs.ts'),
        imports: this.templatePath('spec/controller/imports.ts')
      },
      this.answers
    );

    this.alterTpl(
      this.destinationPath('spec/dao/' + daoSpecFilename),
      {
        specs: this.templatePath('spec/dao/specs.ts'),
        imports: this.templatePath('spec/dao/imports.ts')
      },
      this.answers
    );
  }
};
