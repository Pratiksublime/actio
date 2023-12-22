const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const subSportsController = require('../../controller/admin/sub_sports');


module.exports = (app) => {
    // sport
    app.post('/v1/admin/sub_sports/insert', subSportsController.insert);
    app.post('/v1/admin/sub_sports/info', subSportsController.info);
    app.post('/v1/admin/sub_sports/update', subSportsController.update);
    app.post('/v1/admin/sub_sports/list',  subSportsController.list);
    app.post('/v1/admin/sub_sports/list_by_sport_id',  subSportsController.listBySportId);
    app.get('/v1/admin/sub_sports/subsport_list',  subSportsController.subsport_list);
    app.post('/v1/admin/sub_sports/delete',  subSportsController.deletedata); 
}