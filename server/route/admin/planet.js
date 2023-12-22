const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const planetController = require('../../controller/admin/planetCont');

module.exports = (app) => {
    // activities
    app.post('/v1/admin/planet/insert', planetController.insert);
    app.get('/v1/admin/planet/list',  planetController.list);
    app.post('/v1/admin/planet/update', planetController.update);
    app.post('/v1/admin/planet/info', planetController.info);
    app.post('/v1/admin/planet/delete', planetController.Delete);


}