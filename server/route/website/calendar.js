const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../controller/website/calendar'); 
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.get('/v1/website/calendar/list',userAuth,controller.getCalender);
	
}