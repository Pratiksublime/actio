
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const awardmasterController = require('../../../controller/v1/admin/award_master');

module.exports = (app) => {
	app.post('/v1/admin/award_master/add',userAuth,awardmasterController.insert);

	app.get('/v1/admin/award_master/list',userAuth,awardmasterController.list);

	app.post('/v1/admin/award_master/info',userAuth,awardmasterController.info);

	app.post('/v1/admin/award_master/delete',userAuth,awardmasterController.Delete);

	app.post('/v1/admin/award_master/update',userAuth,awardmasterController.update);

}