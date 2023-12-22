const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const disciplineController = require('../../../controller/v1/admin/disciplineCont');

module.exports = (app) => {
    // discipline
    app.post('/v1/admin/discipline/insert',userAuth, disciplineController.insert);
    app.get('/v1/admin/discipline/list', userAuth, disciplineController.list);
    app.post('/v1/admin/discipline/update',userAuth, disciplineController.update);
    app.post('/v1/admin/discipline/info', userAuth, disciplineController.info);
    app.post('/v1/admin/discipline/delete',userAuth, disciplineController.Delete);


    

}