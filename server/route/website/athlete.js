const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../controller/website/athleteCont');


module.exports = (app) => {
	app.get('/v1/website/athlete/athletelist', controller.List);
	app.get('/v1/website/athlete/athletelist_by_id', controller.athletelistby_id);
	app.get('/v1/website/athlete/athleteQualification', controller.athleteQualificationList); 
	app.get('/v1/website/athlete/athletemy_teams', controller.athletemy_teamslist);
	app.get('/v1/website/athlete/athletevideos', controller.athletevideos);
	app.get('/v1/website/athlete/athleteImg', controller.athleteImg);
	app.get('/v1/website/athlete/athleteSponsor', controller.athleteSponsor);
	app.get('/v1/website/athlete/athleteAwards', controller.athleteAwards);
	app.get('/v1/website/athlete/citylist', controller.citylist);  
	app.get('/v1/website/athlete/clublist', controller.clublist); 

	app.get('/v1/website/athlete/athleteQualificationlimit', controller.athleteQualificationLimit);
	app.get('/v1/website/athlete/athletemy_teamslislimit', controller.athletemy_teamslisLimit); 
	app.get('/v1/website/athlete/athletevideoslimit', controller.athletevideosLimit);
	app.get('/v1/website/athlete/clublistlimit', controller.clublistLimit); 
	app.get('/v1/website/athlete/athleteSponsorlimit', controller.athleteSponsorLimit); 
	app.get('/v1/website/athlete/athleteAwardslimit', controller.athleteAwardsLimit); 



	app.get('/v1/website/athlete/athletelistAuth',userAuth,controller.List);
	app.get('/v1/website/athlete/athletelist_by_idAuth',userAuth,controller.athletelistby_id);
	app.get('/v1/website/athlete/athleteQualificationAuth',userAuth, controller.athleteQualificationList); 
	app.get('/v1/website/athlete/athletemy_teamsAuth',userAuth, controller.athletemy_teamslist);
	app.get('/v1/website/athlete/athletevideosAuth',userAuth, controller.athletevideos);
	app.get('/v1/website/athlete/athleteImgAuth',userAuth, controller.athleteImg);
	app.get('/v1/website/athlete/athleteSponsorAuth',userAuth, controller.athleteSponsor);
	app.get('/v1/website/athlete/athleteAwardsAuth',userAuth, controller.athleteAwards);
	app.get('/v1/website/athlete/citylistAuth', userAuth,controller.citylist);  
	app.get('/v1/website/athlete/clublistAuth',userAuth, controller.clublist); 

	

}