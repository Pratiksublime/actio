const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/subscriber_managerController');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	app.get('/v1/website/subscriber_manager/list', controller.List);
	app.post('/v1/website/subscriber_manager/add', controller.Insert);
	app.post('/v1/website/subscriber_manager/info', controller.Info);
	app.post('/v1/website/subscriber_manager/update', controller.Update);
	app.post('/v1/website/subscriber_manager/delete', controller.Delete);
}