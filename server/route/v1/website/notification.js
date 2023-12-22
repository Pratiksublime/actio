
const db = require('../../../db');

const { userAuth } = require('../../../middleware/auth');

var controller = require('../../../controller/v1/website/notification');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('/v1/website/notification/requestnotification', controller.requestnotification);
	app.post('/v1/website/notification/list', controller.list); 

	app.post('/v1/website/notification/allnotification', controller.allnotification); 

	app.post('/v1/website/notification/accesscodedata', controller.accesscodeList); 

	app.post('/v1/website/notification/seennotification', controller.seennotification);     
 
	

	

	

	

	
	  
	
}