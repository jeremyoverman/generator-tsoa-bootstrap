let commentTemplate = require('../../../lib/commentTemplate');

module.exports = {
  template(source, model) {
    let upperModel = model.charAt(0).toUpperCase() + model.slice(1);
    let lowerModel = model.charAt(0).toLowerCase() + model.slice(1);

    return commentTemplate.commentTpl(source, {
      import: `import * as ${upperModel} from '../sequelize/models/${lowerModel}';`,
      crud: `
    /**
     * Get all ${lowerModel}s
     */
    @Get()

    get${upperModel}s(): PromiseLike<${upperModel}.Raw${upperModel}Instance[]> {
        return db.${lowerModel}.DAO.getAll();
    }

    /**
     * Get a single ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     */
    @Get('{${lowerModel}_id}')

    get${upperModel}(${lowerModel}_id: number): PromiseLike<${upperModel}.Raw${upperModel}Instance> {
        return db.${lowerModel}.DAO.get(${lowerModel}_id);
    }

    /**
     * Create a new ${lowerModel}
     * 
     * @param attributes The attributes to create the ${lowerModel} with
     */
    @Post()

    create${upperModel}(@Body() attributes: ${upperModel}.${upperModel}Attributes): PromiseLike<${upperModel}.Raw${upperModel}Instance> {
        return db.${lowerModel}.DAO.create(attributes);
    }

    /**
     * Update an existing ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     * @param attributes The attributes to update the ${lowerModel} with
     */
    @Patch('{${lowerModel}_id}')

    update${upperModel}(${lowerModel}_id: number, @Body() attributes: ${upperModel}.${upperModel}Attributes): PromiseLike<${upperModel}.Raw${upperModel}Instance> {
        return db.${lowerModel}.DAO.update(${lowerModel}_id, attributes);
    }

    /**
     * Delete an existing ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     */
    @Delete('{${lowerModel}_id}')

    delete${upperModel}(${lowerModel}_id: number): PromiseLike<void> {
        return db.${lowerModel}.DAO.delete(${lowerModel}_id);
    }
            `
    });
  }
};
