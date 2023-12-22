const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const meetingdataController = require('../../controller/admin/meetingCont');

module.exports = (app) => {
    // sport
    app.post('/v1/admin/meetingdata/insert',userAuth,meetingdataController.insert);
    app.post('/v1/admin/meetingdata/info',userAuth, meetingdataController.info);
    app.post('/v1/admin/meetingdata/update',userAuth, meetingdataController.update);
    app.post('/v1/admin/meetingdata/list', userAuth, meetingdataController.list)
    app.post('/v1/admin/meetingdata/delete', userAuth, meetingdataController.Delete)
}