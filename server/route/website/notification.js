const db = require('../../db');

const { userAuth } = require('../../middleware/auth');

var controller = require('../../controller/website/notification');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('/v1/website/notification/requestnotification', controller.requestnotification);
	app.post('/v1/website/notification/list', controller.list);    

	

	

	

	
	  
	
}