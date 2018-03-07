let commentTemplate = require('../../../lib/commentTemplate');

module.exports = {
  template(source, model) {
    let upperModel = model.charAt(0).toUpperCase() + model.slice(1);
    let lowerModel = model.charAt(0).toLowerCase() + model.slice(1);

    return commentTemplate.commentTpl(source, {
      imports: `import * as ${upperModel}Support from '../support/model/${lowerModel}';`,
      specs: `
    describe('calling the getAll method', () => {
        beforeEach(() => {
            return db.${lowerModel}.bulkCreate([${upperModel}Support.goodAttributes, ${upperModel}Support.goodAttributes]);
        });

        it('should return an array of ${lowerModel}s', () => {
            return dao.getAll().then(${lowerModel}s => {
                expect(${lowerModel}s.length).toBe(2);
            });
        });
    });

    describe('calling the get method', () => {
        beforeEach(() => db.${lowerModel}.create(${upperModel}Support.goodAttributes));

        describe('with a good id', () => {
            it('should return the ${lowerModel}', () => {
                return dao.get(1);
            });
        });

        describe('with a bad id', () => {
            it('should get rejected', () => {
                return dao.get(2).then(() => {
                    throw new Error('Should reject');
                }).catch(() => {});
            });
        });
    });

    describe('calling the create method', () => {
        describe('with good attributes', () => {
            it('should return the ${lowerModel}', () => {
                return dao.create(${upperModel}Support.goodAttributes).then(${lowerModel} => {
                    expect(${lowerModel}).toEqual(jasmine.objectContaining(${upperModel}Support.goodAttributes));
                });
            });

            it('should create the ${lowerModel}', () => {
                return dao.create(${upperModel}Support.goodAttributes).then(() => {
                    return db.${lowerModel}.findById(1, { rejectOnEmpty: true }).then(${lowerModel} => {
                        expect(${lowerModel}).toEqual(jasmine.objectContaining(${upperModel}Support.goodAttributes));
                    });
                });
            });
        });
        
        describe('with bad attributes', () => {
            it('should get rejected', () => {
                return dao.create(${upperModel}Support.badAttributes).then(() => {
                    throw new Error('should reject');
                }).catch(() => {});
            });
        });
    });

    describe('calling the update method', () => {
        beforeEach(() => db.${lowerModel}.create(${upperModel}Support.goodAttributes));

        describe('with a good id', () => {
            describe('and good attributes', () => {
                it('should return the ${lowerModel}', () => {
                    return dao.update(1, ${upperModel}Support.goodUpdateAttributes).then(${lowerModel} => {
                        expect(${lowerModel}).toEqual(jasmine.objectContaining(${upperModel}Support.goodUpdateAttributes));
                    });
                });

                it('should update the ${lowerModel}', () => {
                    return dao.update(1, ${upperModel}Support.goodUpdateAttributes).then(() => {
                        return db.${lowerModel}.findById(1).then(${lowerModel} => {
                            expect(${lowerModel}).toEqual(jasmine.objectContaining(${upperModel}Support.goodUpdateAttributes));
                        });
                    });
                });
            });

            describe('and bad attributes', () => {
                it('should get rejected', () => {
                    return dao.update(1, ${upperModel}Support.badAttributes).then(() => {
                        throw new Error('should reject')
                    }).catch(() => {});
                });

                it('should not update the ${lowerModel}', () => {
                    return dao.update(1, ${upperModel}Support.badAttributes).catch(() => {
                        return db.${lowerModel}.findById(1).then(${lowerModel} => {
                            expect(${lowerModel}).toEqual(jasmine.objectContaining(${upperModel}Support.goodAttributes));
                        });
                    });
                });
            });
        });

        describe('with a bad id', () => {
            it('should get rejected', () => {
                return dao.update(2, ${upperModel}Support.goodAttributes).then(() => {
                    throw new Error('should reject');
                }).catch(() => {});
            });
        });
    });

    describe('calling the delete method', () => {
        beforeEach(() => db.${lowerModel}.create(${upperModel}Support.goodAttributes));

        describe('with a good id', () => {
            it('should delete the ${lowerModel}', () => {
                return dao.delete(1).then(() => {
                    return db.${lowerModel}.findById(1).then(${lowerModel} => {
                        expect(${lowerModel}).toBe(null);
                    });
                });
            });
        });

        describe('with a bad id', () => {
            it('should get rejected', () => {
                return dao.delete(2).then(() => {
                    throw new Error('should reject');
                }).catch(() => {});
            });
        });
    });
      `
    });
  }
};
