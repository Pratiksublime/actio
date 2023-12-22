const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const matchdataController = require('../../controller/admin/matchCont');

module.exports = (app) => {
    // sport
    app.post('/v1/admin/matchdata/insert',userAuth,matchdataController.insert);
    app.post('/v1/admin/matchdata/info', matchdataController.info);
    app.post('/v1/admin/matchdata/update', matchdataController.update);
    app.post('/v1/admin/matchdata/list',  matchdataController.list)
    app.post('/v1/admin/matchdata/delete',  matchdataController.Delete)
}