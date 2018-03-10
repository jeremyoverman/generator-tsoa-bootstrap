    describe('calling GET /<%= lowerRoute %>', () => {
        beforeEach(() => {
            return db.<%= lowerModel %>.bulkCreate([<%= upperModel %>Support.goodAttributes, <%= upperModel %>Support.goodAttributes]);
        });

        it('should return a 200', () => {
            return supertest(app)
                .get('/<%= lowerRoute %>')
                .expect(200);
        });

        it('should return an array of <%= lowerModel %>s', () => {
            return supertest(app)
                .get('/<%= lowerRoute %>')
                .then(res => {
                    expect(res.body.length).toBe(2);
                });
        });
    });

    describe('calling GET /<%= lowerRoute %>/{<%= lowerModel %>_id}', () => {
        beforeEach(() => db.<%= lowerModel %>.create(<%= upperModel %>Support.goodAttributes));

        describe('with a good id', () => {
            it('should return a 200', () => {
                return supertest(app)
                    .get('/<%= lowerRoute %>/1')
                    .expect(200);
            });

            it('should return the <%= lowerModel %>', () => {
                return supertest(app)
                    .get('/<%= lowerRoute %>/1')
                    .then(res => {
                        expect(res.body).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodAttributes));
                    });
            });
        });

        describe('with a bad id', () => {
            it('should return a 404', () => {
                return supertest(app)
                    .get('/<%= lowerRoute %>/2')
                    .expect(404);
            });
        });
    });

    describe('calling POST /<%= lowerRoute %>', () => {
        describe('with good attributes', () => {
            it('should return a 201', () => {
                return supertest(app)
                    .post('/<%= lowerRoute %>')
                    .send(<%= upperModel %>Support.goodAttributes)
                    .expect(201);
            });

            it('should return the <%= lowerModel %>', () => {
                return supertest(app)
                    .post('/<%= lowerRoute %>')
                    .send(<%= upperModel %>Support.goodAttributes)
                    .then(res => {
                        expect(res.body).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodAttributes));
                    });
            });

            it('should create the <%= lowerModel %>', () => {
                return supertest(app)
                    .post('/<%= lowerRoute %>')
                    .send(<%= upperModel %>Support.goodAttributes)
                    .then(res => {
                        return db.<%= lowerModel %>.findById(1, { rejectOnEmpty: true }).then(<%= lowerModel %> => {
                            expect(<%= lowerModel %>).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodAttributes));
                        });
                    });
            });
        });
        
        describe('with bad attributes', () => {
            it('should return a 400', () => {
                return supertest(app)
                    .post('/<%= lowerRoute %>')
                    .send(<%= upperModel %>Support.badAttributes)
                    .expect(400);
            });

            it('should not create the <%= lowerModel %>', () => {
                return supertest(app)
                    .post('/<%= lowerRoute %>')
                    .send(<%= upperModel %>Support.badAttributes)
                    .then(() => {
                        return db.<%= lowerModel %>.findAll().then(<%= lowerModel %>s => {
                            expect(<%= lowerModel %>s.length).toBe(0);
                        });
                    });
            });
        });
    });

    describe('calling PATCH /<%= lowerRoute %>/{<%= lowerModel %>_id}', () => {
        beforeEach(() => db.<%= lowerModel %>.create(<%= upperModel %>Support.goodAttributes));

        describe('with a good id', () => {
            describe('and good attributes', () => {
                it('should return a 200', () => {
                    return supertest(app)
                        .patch('/<%= lowerRoute %>/1')
                        .send(<%= upperModel %>Support.goodUpdateAttributes)
                        .expect(200);
                });

                it('should return the <%= lowerModel %>', () => {
                    return supertest(app)
                        .patch('/<%= lowerRoute %>/1')
                        .send(<%= upperModel %>Support.goodUpdateAttributes)
                        .then(res => {
                            expect(res.body).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodUpdateAttributes));
                        });
                });

                it('should update the <%= lowerModel %>', () => {
                    return supertest(app)
                        .patch('/<%= lowerRoute %>/1')
                        .send(<%= upperModel %>Support.goodUpdateAttributes)
                        .then(res => {
                            return db.<%= lowerModel %>.findById(1).then(<%= lowerModel %> => {
                                expect(<%= lowerModel %>).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodUpdateAttributes));
                            });
                        });
                });
            });

            describe('and bad attributes', () => {
                it('should return a 400', () => {
                    return supertest(app)
                        .patch('/<%= lowerRoute %>/1')
                        .send(<%= upperModel %>Support.badAttributes)
                        .expect(400);
                });

                it('should not update the <%= lowerModel %>', () => {
                    return supertest(app)
                        .patch('/<%= lowerRoute %>/1')
                        .send(<%= upperModel %>Support.badAttributes)
                        .then(res => {
                            return db.<%= lowerModel %>.findById(1).then(<%= lowerModel %> => {
                                expect(<%= lowerModel %>).toEqual(jasmine.objectContaining(<%= upperModel %>Support.goodAttributes));
                            });
                        })
                });
            });
        });

        describe('with a bad id', () => {
            it('should return a 404', () => {
                return supertest(app)
                    .patch('/<%= lowerRoute %>/2')
                    .send(<%= upperModel %>Support.goodAttributes)
                    .expect(404);
            });
        });
    });

    describe('calling DELETE /<%= lowerRoute %>/{<%= lowerModel %>_id}', () => {
        beforeEach(() => db.<%= lowerModel %>.create(<%= upperModel %>Support.goodAttributes));

        describe('with a good id', () => {
            it('should return a 204', () => {
                return supertest(app)
                    .delete('/<%= lowerRoute %>/1')
                    .expect(204)
            });

            it('should delete the <%= lowerModel %>', () => {
                return supertest(app)
                    .delete('/<%= lowerRoute %>/1')
                    .then(res => {
                        return db.<%= lowerModel %>.findById(1).then(<%= lowerModel %> => {
                            expect(<%= lowerModel %>).toBe(null);
                        });
                    })
            });
        });

        describe('with a bad id', () => {
            it('should return a 404', () => {
                return supertest(app)
                    .delete('/<%= lowerRoute %>/2')
                    .expect(404);
            });
        });
    });