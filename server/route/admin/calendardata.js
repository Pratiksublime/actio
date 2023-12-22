
const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const calController = require('../../controller/admin/calenderCont');

module.exports = (app) => {
	

	app.post('/v1/admin/calender/calenderdata',userAuth,calController.getCalender);

}