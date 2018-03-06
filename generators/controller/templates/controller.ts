import db from '../sequelize/models';
import Controller from '../controller';

/* yeo: import */

import {
    Get, Put, Post, Delete, Patch, Security,
    Tags, Route, Response, Body, SuccessResponse
} from 'tsoa';

@Route('<%= lowerName %>')
export class <%= upperName %>Controller extends Controller {
    /**
     * Controller methods go here. See TSOA documentation for details.
     */

    /* yeo: crud */
}