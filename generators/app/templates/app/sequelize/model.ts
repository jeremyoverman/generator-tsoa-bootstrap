import * as sequelize from 'sequelize';

export interface RawInstance {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Instance<A> extends sequelize.Instance<A> {}