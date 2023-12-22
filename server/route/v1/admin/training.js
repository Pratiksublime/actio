const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const trainingController = require('../../../controller/v1/admin/trainingCont');



module.exports = (app) => {
    // sport
    app.post('/v1/admin/training/insert',userAuth,trainingController.insert);
    app.post('/v1/admin/training/info',userAuth, trainingController.info);
    app.post('/v1/admin/training/update', userAuth,trainingController.update);
    app.post('/v1/admin/training/list', userAuth, trainingController.list)
    app.post('/v1/admin/training/delete',userAuth,  trainingController.Delete)
}