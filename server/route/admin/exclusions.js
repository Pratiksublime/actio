
const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const exclusionsController = require('../../controller/admin/exclusions');

module.exports = (app) => {
	app.post('/v1/admin/exclusions/add',exclusionsController.insert);

	app.get('/v1/admin/exclusions/list',exclusionsController.list);

	app.post('/v1/admin/exclusions/info',exclusionsController.info);

	app.post('/v1/admin/exclusions/delete',exclusionsController.Delete);

	app.post('/v1/admin/exclusions/update',exclusionsController.update);

}