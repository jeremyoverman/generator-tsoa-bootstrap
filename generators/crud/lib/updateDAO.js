let commentTemplate = require('../../../lib/commentTemplate');

module.exports = {
  template(source, model) {
    let upperModel = model.charAt(0).toUpperCase() + model.slice(1);
    let lowerModel = model.charAt(0).toLowerCase() + model.slice(1);

    return commentTemplate.commentTpl(source, {
      methods: `
    getAll() {
        return db.${lowerModel}.findAll();
    }

    get(id: number) {
        return db.${lowerModel}.findById(id, {
            rejectOnEmpty: true
        }).catch(() => {
            throw NOT_FOUND;
        });
    }

    create(attributes: ${upperModel}Attributes) {
        return db.${lowerModel}.create(attributes);
    }

    update (id: number, attributes: ${upperModel}Attributes) {
        return this.get(id)
            .then(${lowerModel} => ${lowerModel}.update(attributes))
            .then(() => this.get(id));
    }

    delete (id: number) {
        return this.get(id)
            .then(${lowerModel} => ${lowerModel}.destroy());
    }`
    });
  }
};
