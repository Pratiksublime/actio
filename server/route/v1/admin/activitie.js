const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const activitiesController = require('../../../controller/v1/admin/activities');

module.exports = (app) => {
    // activities
    app.post('/v1/admin/activities/insert', activitiesController.insert);
    app.get('/v1/admin/activities/list',  activitiesController.list);
    app.post('/v1/admin/activities/update', activitiesController.update);
    app.post('/v1/admin/activities/info', activitiesController.info);
    app.post('/v1/admin/activities/delete', activitiesController.Delete)

}