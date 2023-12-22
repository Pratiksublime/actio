const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../../controller/v1/website/performance');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	app.get('/v1/website/performance/performancelist', controller.List);
	app.get('/v1/website/performance/performancemasterlist', controller.msterList);

	app.get('/v1/website/performance/awardList', controller.awardList); 
	app.get('/v1/website/performance/clublist', controller.clublist); 
	app.get('/v1/website/performance/individualgallerylist', controller.individualgallerylist);
	app.get('/v1/website/performance/individualvideoslist', controller.individualvideoslist); 
	app.get('/v1/website/performance/yearlist', controller.yearlist);  
	
	
}