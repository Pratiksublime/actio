const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/subscriber_coachController');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	console.log("3");
	app.get('/v1/website/subscriber_coach/list', controller.List);
	app.post('/v1/website/subscriber_coach/add', controller.Insert);
	app.post('/v1/website/subscriber_coach/info', controller.Info);
	app.post('/v1/website/subscriber_coach/update', controller.Update);
	app.post('/v1/website/subscriber_coach/delete', controller.Delete);
}
console.log("sub_coach")