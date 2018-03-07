import db from '../sequelize/models';
import Controller from '../controller';
import { NOT_FOUND } from '../lib/errors';

/* yeo: imports */

import {
    Get, Put, Post, Delete, Patch, Security,
    Tags, Route, Response, Body, SuccessResponse
} from 'tsoa';

@Route('<%= lowerName %>')
export class <%= upperName %>Controller extends Controller {
    /**
     * Controller methods go here. See TSOA documentation for details.
     */

    /* yeo: subroutes */
}