import { create, all, remove, update, get } from '../controllers/contact';
import { requireAuthentication } from "../utils/auth";
/**
 * 
 * 
 */

module.exports = app => {
    app.route('/contact/all').get(all);
    /**
     * Create the remaining routes
     * get,
     * create,
     * delete,
     * update,
     * remove
     */
    app.route("/contact/all").get(requireAuthentication, all);
    app.route("/contact/new").post(requireAuthentication, create);
    app.route("/contact/:contactId").get(requireAuthentication, get)
    app.route("/contact/delete/:contactId").delete(requireAuthentication, remove);
    app.route("/contact/update").put(requireAuthentication, update);
};
