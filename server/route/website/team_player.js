const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../controller/website/team_playerController');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	app.get('/v1/website/team_player/list', controller.List);
	app.post('/v1/website/team_player/add', controller.Insert);
	app.post('/v1/website/team_player/info', controller.Info);
	app.post('/v1/website/team_player/update', controller.Update);
	app.post('/v1/website/team_player/delete', controller.Delete);
}