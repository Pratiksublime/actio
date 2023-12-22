const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/subscriber_teamController');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	app.get('/v1/website/subscriber_team/list', controller.List);
	app.post('/v1/website/subscriber_team/add', controller.Insert);
	app.post('/v1/website/subscriber_team/info', controller.Info);
	app.post('/v1/website/subscriber_team/update', controller.Update);
	app.post('/v1/website/subscriber_team/delete', controller.Delete);
}

