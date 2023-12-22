const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/subscriber_othersController');

//var controllerdata = require('../../../controller/v1/website/subscriberCont');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	app.get('/v1/website/subscriber_others/list', controller.List);
	app.post('/v1/website/subscriber_others/add', controller.Insert);
	app.post('/v1/website/subscriber_others/info', controller.Info);
	app.post('/v1/website/subscriber_others/update', controller.Update);
	app.post('/v1/website/subscriber_others/delete', controller.Delete);

	 


 
}