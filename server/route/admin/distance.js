const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const distanceController = require('../../controller/admin/distanceCont');

module.exports = (app) => {
    // distance
    app.post('/v1/admin/distance/insert',userAuth, distanceController.insert);
    app.get('/v1/admin/distance/list', userAuth, distanceController.list);
    app.post('/v1/admin/distance/update',userAuth, distanceController.update);
    app.post('/v1/admin/distance/info', userAuth, distanceController.info);
    app.post('/v1/admin/distance/delete',userAuth, distanceController.Delete);


    

}