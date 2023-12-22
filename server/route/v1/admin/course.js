const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const couresController = require('../../../controller/v1/admin/courescont');

module.exports = (app) => {
    // activities
    app.post('/v1/admin/coures/insert', couresController.insert);
    app.get('/v1/admin/coures/list',  couresController.list); 
    app.post('/v1/admin/coures/update', couresController.update);
    app.post('/v1/admin/coures/info', couresController.info);
    app.post('/v1/admin/coures/delete', couresController.Delete)

}