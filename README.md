# generator-tsoa-bootstrap [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] 
> TSOA, Sequelize, and Jasmine project generator

## Installation

First, install [Yeoman](http://yeoman.io) and generator-tsoa-bootstrap using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-tsoa-bootstrap
```

Then generate your new project:

```bash
yo tsoa-bootstrap
```

## Usage

Once you have the app installed, there's a few things you'll want to do.

### Sequelize Config

First, in `/app/sequelize/config/config.ts`, you'll want to configure your database settings. The `test` settings are already set up to connect to an in-memory sqlite database.

See [The Sequelize Docs](http://docs.sequelizejs.com) for more information.

## Generators

The following generators are available to you:

* [model](#model)
* [controller](#controller)
* [association](#association)
* [crud](#crud)
* [migration](#migration)
* [sqlite-scaffold](#sqlite-scaffold)

### model

You can run `yo tsoa-bootstrap:model <modelName>` to generate a new model. The model name will automatically be singularized for you.

#### `/sequelize/models/ModelName.ts`

This is where you'll define what you want your model to look like and it's associations. The model defined in here will automatically be added to the default export in `/sequelize/models/index` so it can be imported as:

```javascript
import db from './models';

db.YourModel.findById(id);
```

#### `/sequelize/dao/ModelName.ts`

The DAO (Data Access Object) will be a class containing methods for accessing data from your model. This class will automatically be instantiated and added to your model with the `DAO` property.

```javascript
import db from './models';

db.YourModel.DAO.createModelWithData(data);
```

#### `/spec/dao/ModelName.spec.ts`

This will be the test file for your DAO. Before every test, a sqlite database will be created in memory and all migrations will be run. This ensures that you start with a fresh environment for every test that's as close to production as possible.

### controller

Controllers are where you define your routes and the logic behind your routes.

You can generate a new controller with:

```bash
yo tsoa-bootstrap:controller <name>
```

See https://github.com/lukeautry/tsoa for more information on how to set your controller up.

### association

The association generator will allow you to associate two tables together. The syntax is like:

```bash
yo tsoa-bootstrap:assocaition <from> <type> <to> <through>
```

* `from` is the model to add the association to
* `type` is the type of association. It must be one of the following
    * `hasOne`
    * `hasMany`
    * `belongsTo`
    * `belongsToMany` (must provide a `through` model)

This will automatically add the association to the model and add all of the supporting methods to the models instance interface.

### crud

The `crud` generator will take a controller and model as input and create the standard CRUD methods in the model's DAO, and the standard CRUD routes in the controller, along with tests to support them.

The syntax is like so:

```bash
yo tsoa-bootstrap:crud <controller> [<model>]
```

If you do not provide a model, the model will be inferred from the controller name (i.e., the controller singularized).

### migration

Migration scripts are used to create and modify your database tables. You create a new migration with:

```bash
yo tsoa-bootstrap:migration
```

In the `up` method, you will place all methods you want to use to alter your database in the migration. In the `down` method, you will place all methods to rollback the migration.

To run the migration (and all pending migrations), run `npm run sequelize:migrate`.

To undo the last migration, run `npm run :sequelize:migrate:undo`.

See [The Sequelize Migration Docs](http://docs.sequelizejs.com/manual/tutorial/migrations.html) for more information.

### sqlite-scaffold

The `sqlite-scaffold` generator allows you to take an input sqlite create script and auto generate a migration and models using the script. It will automatically determine the columns and types, primary/foreign keys, unique constraints, and default values for you and them both to the migration script and model.

The syntax is as follows:

```bash
yo tsoa-bootstrap:sqlite-scaffold <path-to-sql> [--initial]
```

If you pass the `--initial` flag, the script will automatically undo all migrations, delete all migrations, then create a new migration. The normal workflow for starting an app would be to use the `--initial` flag until you get to a point where you release your app. Once released, you should stop using the flag and start adding new migrations to support release rollback.

**Tip:** You can use MySQL Workbench to [create models](https://dev.mysql.com/doc/workbench/en/wb-getting-started-tutorial-creating-a-model.html) and use the [mysql-wb-exportsqlite](https://github.com/tatsushid/mysql-wb-exportsqlite) script to convert the models to sqlite automatically for you. Then, you can use this generator to generate your migration and models for you based on your MySQL Workbench model.

## Building and Running the Server

Build the server using `npm run build`. This will do a few things for you:

* Compile the typescript
* Create a swagger file with `tsoa swagger`
* Create your routes with `tsoa routes`
* Copy all of this over to `dist/`

Once you have your projet built, you can run it using `npm start`. Visiting
`localhost:3000/docs` will load the Swagger UI where you can see your swagger documentation and manually test your routes.

Running `npm test` will run all of your Jasmine tests in the `spec/` folder.

## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

Apache-2.0 © [Jeremy Overman]()


[npm-image]: https://badge.fury.io/js/generator-tsoa-bootstrap.svg
[npm-url]: https://npmjs.org/package/generator-tsoa-bootstrap
[travis-image]: https://travis-ci.org/jeremyoverman/generator-tsoa-bootstrap.svg?branch=master
[travis-url]: https://travis-ci.org/jeremyoverman/generator-tsoa-bootstrap
[daviddm-image]: https://david-dm.org/jeremyoverman/generator-tsoa-bootstrap.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/jeremyoverman/generator-tsoa-bootstrap
[coveralls-image]: https://coveralls.io/repos/jeremyoverman/generator-tsoa-bootstrap/badge.svg
[coveralls-url]: https://coveralls.io/r/jeremyoverman/generator-tsoa-bootstrap
