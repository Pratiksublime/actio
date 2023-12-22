
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const awardController = require('../../../controller/v1/admin/awardCont');

module.exports = (app) => {
	app.post('/v1/admin/award/update',userAuth,awardController.updateAward);

	app.post('/v1/admin/award/list',userAuth,awardController.getMyAward);

	app.get('/v1/admin/award/awardlist',userAuth,awardController.getAward);
	app.post('/v1/admin/award/delete',awardController.Deleteaward);
	

}