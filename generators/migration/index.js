'use strict';
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Migration description',
        validate(input) {
          return /[a-zA-Z]+[a-zA-Z0-9_ ()]*/.test(input);
        }
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    let date = new Date().toISOString();
    let description = this.answers.description.replace(/\s/g, '-');
    let filename = date.replace(/-|T|:|\..*/g, '') + `-${description}.ts`;

    this.fs.copy(
      this.templatePath('migration.ts'),
      this.destinationPath('sequelize/migrations/' + filename)
    );
  }
};
