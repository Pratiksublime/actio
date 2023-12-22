
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const yearsmasterController = require('../../../controller/v1/admin/academicyearsmaster');

module.exports = (app) => {
	app.post('/v1/admin/year_master/add',yearsmasterController.insert);

	app.get('/v1/admin/year_master/list',yearsmasterController.list);

	app.post('/v1/admin/year_master/info',yearsmasterController.info);

	app.post('/v1/admin/year_master/delete',yearsmasterController.Delete);

	app.post('/v1/admin/year_master/update',yearsmasterController.update);

}