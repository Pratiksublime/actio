
const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const mycareerController = require('../../controller/admin/mycareer');

module.exports = (app) => {
	app.post('/v1/admin/mycareer/update', userAuth,mycareerController.updateMycareer);
	app.post('/v1/admin/mycareer/list', userAuth,mycareerController.getMycareer);
}