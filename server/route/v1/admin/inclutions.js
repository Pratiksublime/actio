
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const inclutionsController = require('../../../controller/v1/admin/inclutions');

module.exports = (app) => {
	app.post('/v1/admin/inclutions/add',inclutionsController.insert);

	app.get('/v1/admin/inclutions/list',inclutionsController.list);

	app.post('/v1/admin/inclutions/info',inclutionsController.info);

	app.post('/v1/admin/inclutions/delete',inclutionsController.Delete);

	app.post('/v1/admin/inclutions/update',inclutionsController.update);

}