    getAll() {
        return db.<%= lowerModel %>.findAll();
    }

    get(id: number) {
        return db.<%= lowerModel %>.findById(id, {
            rejectOnEmpty: true
        }).catch(() => {
            throw NOT_FOUND;
        });
    }

    create(attributes: <%= upperModel %>Attributes) {
        return db.<%= lowerModel %>.create(attributes);
    }

    update (id: number, attributes: <%= upperModel %>Attributes) {
        return this.get(id)
            .then(<%= lowerModel %> => <%= lowerModel %>.update(attributes))
            .then(() => this.get(id));
    }

    delete (id: number) {
        return this.get(id)
            .then(<%= lowerModel %> => <%= lowerModel %>.destroy());
    }