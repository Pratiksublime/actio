const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const positionController = require('../../controller/admin/positionCont');

module.exports = (app) => {
    // position
    app.post('/v1/admin/position/insert', positionController.insert);
    app.get('/v1/admin/position/list',  positionController.list);
    app.post('/v1/admin/position/update', positionController.update);
    app.post('/v1/admin/position/info', positionController.info);
    app.post('/v1/admin/position/delete', positionController.Delete);

    app.post('/v1/admin/position/insertlevel', positionController.insertlevel);
    app.get('/v1/admin/position/listlevel', positionController.listlevel);
    app.post('/v1/admin/position/updatelevel', positionController.updatelevel);
    app.post('/v1/admin/position/infolevel', positionController.infolevel);
    app.post('/v1/admin/position/deletelevel', positionController.Deletelevel);
    

}