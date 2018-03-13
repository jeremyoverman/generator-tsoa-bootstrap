'use strict';

const sqliteParser = require('sqlite-parser');
const Generator = require('../../CustomGenerator');
const beautify = require('gulp-beautify');
const pluralize = require('pluralize');

let datatypes = {
  integer: 'INTEGER',
  varchar: 'STRING',
  datetime: 'DATE',
  tinyint: 'BOOLEAN'
};

let attributes = {
  varchar: 'string',
  integer: 'number',
  datetime: 'Date',
  tinyint: 'boolaen'
};

function parseSQL(raw) {
  const sql = sqliteParser(raw);

  return sql.statement
    .filter(statement => {
      return (
        statement.type === 'statement' &&
        statement.variant === 'create' &&
        statement.format === 'table'
      );
    })
    .map(statement => {
      return {
        name: statement.name.name.replace(/.*?\./, ''),
        definitions: parseDefinitions(statement.definition),
        constraints: parseConstraintDefinitions(statement.definition)
      };
    });
}

function parseConstraintDefinitions(constraints) {
  return constraints
    .filter(constraint => {
      return (
        constraint.type === 'definition' &&
        constraint.variant === 'constraint' &&
        constraint.definition.length === 1 &&
        constraint.definition[0].type === 'constraint'
      );
    })
    .map(constraint => {
      let result = {};

      let def = constraint.definition[0];

      result.type = def.variant;
      result.name = constraint.name;
      result.fromColumn = constraint.columns
        .map(column => {
          return `'${column.name}'`;
        })
        .join(', ');

      if (def.variant === 'foreign key') {
        result.toTable = def.references.name;
        result.toColumn = def.references.columns[0].name;
      }

      return result;
    });
}

function parseConstraints(constraints) {
  let result = {};

  constraints
    .filter(constraint => {
      return constraint.type === 'constraint';
    })
    .forEach(constraint => {
      if (constraint.variant === 'primary key') {
        result.primaryKey = true;

        if (constraint.autoIncrement) {
          result.autoIncrement = true;
        }
      } else if (constraint.variant === 'not null') {
        result.allowNull = false;
      } else if (constraint.variant === 'default') {
        result.defaultValue = constraint.value.value;
      }
    });

  return result;
}

function parseDefinitions(definitions) {
  return definitions
    .filter(def => {
      return def.variant === 'column';
    })
    .map(def => {
      let type = def.datatype.variant;

      let results = {
        name: def.name,
        type: datatypes[type] || type.toUpperCase(),
        constraints: parseConstraints(def.definition),
        attr: attributes[type] || type.toLowerCase()
      };

      return results;
    });
}

module.exports = class extends Generator {
  constructor(opts, args) {
    super(opts, args);

    this.registerTransformStream(
      beautify({
        brace_style: 'collapse-preserve-inline' // eslint-disable-line camelcase
      })
    );

    this.argument('input', {
      type: String,
      description: 'The sqlite file to use for scaffolding'
    });

    this.option('initial', {
      description: 'Undo and delete all migrations?'
    });
  }

  prompting() {
    this.answers = {
      inputFile: this.options.input
    };
  }

  configuring() {
    let input = this.fs.read(this.answers.inputFile);

    this.tables = parseSQL(input);

    if (this.options.initial) {
      let migrationsPath = this.destinationPath('sequelize/migrations');

      return this.getDirectoryFileCount(migrationsPath).then(count => {
        if (count > 1) {
          throw new Error(
            "You can only run with the --initial option if there's 0 or 1 migrations already existing."
          );
        } else {
          return this.emptyDirectory(migrationsPath);
        }
      });
    }
  }

  prewriting() {
    this.tables.forEach(table => {
      let path = this.destinationPath(`sequelize/models/${table.name}.ts`);

      if (!this.fs.exists(path)) {
        this.composeWith(require.resolve('../model'), {
          arguments: [table.name]
        });
      }
    });
  }

  writing() {
    let migrationFilename =
      new Date().toISOString().replace(/-|T|:|\..*/g, '') + '-initial.ts';

    this.fs.copyTpl(
      this.templatePath('migration/migration.ejs'),
      this.destinationPath('sequelize/migrations/' + migrationFilename),
      {
        tables: this.tables
      }
    );
  }

  conflicts() {
    this.tables.forEach(table => {
      let name = pluralize.singular(table.name);
      let path = this.destinationPath(`sequelize/models/${name}.ts`);

      this.alterTpl(
        path,
        {
          attributes: this.templatePath('model/attributes.ejs'),
          definitions: this.templatePath('model/definitions.ejs'),
          associationComments: this.templatePath('model/associationComments.ejs')
        },
        {
          definitions: table.definitions,
          constraints: table.constraints,
          associations: table.constraints
        }
      );
    });
  }

  end() {
    let destMigrationsPath = this.destinationPath('dist/sequelize/migrations');

    if (this.options.initial) {
      this.spawnCommandSync('npm', ['run', 'sequelize:migrate:undo:all']);
    }

    return this.emptyDirectory(destMigrationsPath).then(() => {
      this.spawnCommandSync('npm', ['run', 'build']);
      this.spawnCommandSync('npm', ['run', 'sequelize:migrate']);
    });
  }
};
