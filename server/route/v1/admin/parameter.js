const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const parameterController = require('../../../controller/v1/admin/parameterCont');

module.exports = (app) => {
    // parameter
    app.post('/v1/admin/parameter/insert', parameterController.insert);
    app.get('/v1/admin/parameter/list', parameterController.list);
    app.post('/v1/admin/parameter/update', parameterController.update);
    app.post('/v1/admin/parameter/info', parameterController.info);
    app.post('/v1/admin/parameter/delete', parameterController.Delete);


    

}