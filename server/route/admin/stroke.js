const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const strokeController = require('../../controller/admin/strokeCont');

module.exports = (app) => {
    // stroke
    app.post('/v1/admin/stroke/insert',userAuth, strokeController.insert);
    app.get('/v1/admin/stroke/list', userAuth, strokeController.list);
    app.post('/v1/admin/stroke/update',userAuth, strokeController.update);
    app.post('/v1/admin/stroke/info', userAuth, strokeController.info);
    app.post('/v1/admin/stroke/delete',userAuth, strokeController.Delete);


    

}