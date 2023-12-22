 
 const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../controller/website/login'); 
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('v1/website/login', controller.login);
	 
}