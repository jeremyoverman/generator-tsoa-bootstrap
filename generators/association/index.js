'use strict';
const Generator = require('../../CustomGenerator');
const pluralize = require('pluralize');

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.argument('source', {
      required: true,
      type: String,
      description: 'The source model'
    });

    this.argument('association', {
      required: true,
      type: String,
      description: 'The type of association'
    });

    this.argument('target', {
      required: true,
      type: String,
      description: 'The target model'
    });

    this.argument('through', {
      required: false,
      type: String,
      description: 'The through model for belongsToMany'
    });
  }

  prompting() {
    this.answers = {
      source: pluralize.singular(this.options.source),
      target: pluralize.singular(this.options.target),
      association: this.options.association,
      through: ''
    };

    this.answers.upperSource = this.upperCase(this.answers.source);
    this.answers.upperTarget = this.upperCase(this.answers.target);
    this.answers.upperTargetPlural = pluralize.plural(this.answers.upperTarget);

    if (this.options.through) {
      this.answers.through = pluralize.singular(this.options.through);
      this.answers.upperThrough = this.upperCase(this.answers.through);
    }

    let supported = ['belongsTo', 'hasOne', 'hasMany', 'belongsToMany'];

    if (supported.indexOf(this.answers.association) === -1) {
      throw new Error(
        `${
          this.options.association
        } is not a valid association. Valid associations are: ${supported.join(', ')}`
      );
    } else if (this.answers.association === 'belongsToMany' && !this.answers.through) {
      throw new Error(
        'You must provide a through model for a belongsToMany realtionship'
      );
    }
  }

  writing() {
    let sourceModel = this.destinationPath(
      'sequelize/models/' + this.answers.source + '.ts'
    );

    this.alterTpl(
      sourceModel,
      {
        associations: this.templatePath('model/associations.ejs'),
        instance: this.templatePath('model/instance.ejs'),
        imports: this.templatePath('model/imports.ejs')
      },
      this.answers
    );
  }
};
