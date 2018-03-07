let commentTemplate = require('../../../lib/commentTemplate');

module.exports = {
  template(source, model) {
    let upperModel = model.charAt(0).toUpperCase() + model.slice(1);
    let lowerModel = model.charAt(0).toLowerCase() + model.slice(1);

    return commentTemplate.commentTpl(source, {
      imports: `import { Raw${upperModel}Instance, ${upperModel}Attributes } from '../sequelize/models/${lowerModel}';`,
      subroutes: `
    /**
     * Get all ${lowerModel}s
     */
    @Get()

    get${upperModel}s(): PromiseLike<Raw${upperModel}Instance[]> {
        return db.${lowerModel}.DAO.getAll();
    }

    /**
     * Get a single ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     */
    @Get('{${lowerModel}_id}')
    @Response(404)

    get${upperModel}(${lowerModel}_id: number): PromiseLike<Raw${upperModel}Instance | void> {
        return db.${lowerModel}.DAO.get(${lowerModel}_id).catch(err => {
            if (err === NOT_FOUND) this.setStatus(404);
        });
    }

    /**
     * Create a new ${lowerModel}
     * 
     * @param attributes The attributes to create the ${lowerModel} with
     */
    @Post()
    @Response(201)
    @Response(400)

    create${upperModel}(@Body() attributes: ${upperModel}Attributes): PromiseLike<Raw${upperModel}Instance> {
        return db.${lowerModel}.DAO.create(attributes).then(${lowerModel} => {
            this.setStatus(201);
            return ${lowerModel};
        });
    }

    /**
     * Update an existing ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     * @param attributes The attributes to update the ${lowerModel} with
     */
    @Patch('{${lowerModel}_id}')
    @Response(404)
    @Response(400)

    update${upperModel}(${lowerModel}_id: number, @Body() attributes: ${upperModel}Attributes): PromiseLike<Raw${upperModel}Instance | void> {
        return db.${lowerModel}.DAO.update(${lowerModel}_id, attributes).catch(err => {
            if (err === NOT_FOUND) this.setStatus(404);
        });
    }

    /**
     * Delete an existing ${lowerModel}
     * 
     * @param ${lowerModel}_id The id of the ${lowerModel}
     */
    @Delete('{${lowerModel}_id}')
    @Response(404)
    @Response(204)

    delete${upperModel}(${lowerModel}_id: number): PromiseLike<void> {
        return db.${lowerModel}.DAO.delete(${lowerModel}_id).then(() => {
            this.setStatus(204);
        }).catch(err => {
            if (err === NOT_FOUND) this.setStatus(404);
        });
    }
      `
    });
  }
};
