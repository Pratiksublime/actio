
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/match_sheCont');





module.exports = (app) => {
	
	app.post('v1/website/match/list', controller.accesscodeList);  

	}