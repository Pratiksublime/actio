const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const sportController = require('../../../controller/v1/admin/sport');

module.exports = (app) => {
    // sport
    app.post('/v1/admin/sport/insert', sportController.insert);
    app.post('/v1/admin/sport/info', sportController.info);
    app.post('/v1/admin/sport/update', sportController.update);
    app.get('/v1/admin/sport/list',  sportController.list)
    app.post('/v1/admin/sport/delete',  sportController.deletedata)
    app.post('/v1/admin/sport/checksportdublicate',  sportController.checksportdublicate)
    app.post('/v1/admin/sport/notDelete',  sportController.notDelete)

    
    
}