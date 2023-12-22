const db = require('../../../db');

const { userAuth } = require('../../../middleware/auth');

var controller = require('../../../controller/v1/website/match_sheCont');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('/v1/website/matchdata/list', controller.accesscodeList);
	app.post('/v1/website/matchdata/matchlisbyid', controller.matchlisbyid);

	app.get('/v1/website/matchdata/poollist', controller.poollist); 

	app.get('/v1/website/matchdata/eventlist', controller.eventlist);  

	app.post('/v1/website/matchdata/insertteamscore', controller.insertteamscore);


	app.get('/v1/website/matchdata/kpilist', controller.kpilist); 
	app.get('/v1/website/matchdata/matchilistdetails', controller.matchilistdetails); 

	app.post('/v1/website/matchdata/insermatchhighlights', controller.insermatchhighlights); 

	app.post('/v1/website/matchdata/insermatchimages', controller.insermatchimages);  
	   
	
	
	app.get('/v1/website/matchdata/leaderboardlist', controller.leaderboardlist); 

	app.get('/v1/website/matchdata/imglist', controller.imglist); 
	
	app.post('/v1/website/matchdata/updatematchstatistics', controller.updatematchstatistics); 

	app.post('/v1/website/matchdata/insertstatzero', controller.inserststzero); 

	app.get('/v1/website/matchdata/statisticslist', controller.statisticslist); 

	app.post('/v1/website/matchdata/deletematchimg', controller.deletematchimg); 

	app.get('/v1/website/matchdata/matchhighlightslist', controller.matchhighlightslist);
	  
	
}