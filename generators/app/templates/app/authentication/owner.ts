import db from '../sequelize/models';
import { NOT_OWNER } from '../lib/errors';

export default {
    /**
     * Define your resource ownership checks here. `authenentication/index.ts`
     * will use these to determine if the user_id passed in is the owner of the
     * resource_id passed in. The name of the resource should be the method name.
     * 
     * When defining your controller, whichever resource you wish to authenticate
     * has to be formatted like `resource_id`.
     * 
     * For instance, if you have a resource named "project" and in your controller,
     * you use the following decorator:
     * 
     * ```javascript
     * @Security('owner', ['project']);
     * @Patch('{project_id}')
     * 
     * updateProject(project_id: number) {
     *     // The user is authenticated and owns this project
     * }
     * ```
     * 
     * Then you would create a method like so:
     * 
     * ```javascript
     * project (project_id, user_id) {
     *     return db.project.DAO.getOwner(project_id).then(owner => {
     *         if (owner.id !== user_id) throw NOT_OWNER;
     *     });
     * }
     * ```
     */
}