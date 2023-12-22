const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/matchscoreCont'); 
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	 
	app.post('/v1/website/score/add',controller.Add);
	app.post('/v1/website/score/addplayer',controller.Addplayer);

	app.post('/v1/website/score/insertplayerscore',controller.insertplayerscore);


	app.post('/v1/website/score/teamplayerlist',controller.teamplayerlist);
	app.get('/v1/website/score/playerscorelist',controller.playerscorelist);

	app.post('/v1/website/score/palyerstatus',controller.palyerstatus); 

	app.post('/v1/website/score/playerdelete',controller.playerdelete); 

	app.post('/v1/website/score/kpiinsert',controller.kpiinsert); 


	  app.get('/v1/website/score/kpiscorelist',controller.kpiscorelist); 

	
} 