    
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/subscriberCont');





module.exports = (app) => {
	
	app.get('v1/website/subscriberinfo/list', controller.List);   

	}