const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
var controller = require('../../controller/website/toursCont');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.get('/v1/website/tours/list', controller.List);
	app.get('/v1/website/tours/tourtype', controller.tourtype);

	app.get('/v1/website/tours/info', controller.ToursInfo);
	app.get('/v1/website/tours/documents', controller.ToursDocumentsInfo);
	app.get('/v1/website/tours/downloads', controller.ToursDownloadsInfo);
	app.get('/v1/website/tours/exclustions', controller.ToursExclustionsInfo);
	app.get('/v1/website/tours/gallery', controller.ToursGalleryInfo);
	app.get('/v1/website/tours/video', controller.ToursvideoInfo);
	
	app.get('/v1/website/tours/inclutions', controller.ToursInclutionsInfo);
	app.get('/v1/website/tours/iternary', controller.ToursIternaryInfo); 
	app.get('/v1/website/tours/presentation', controller.ToursPresentationInfo);
	app.get('/v1/website/tours/location', controller.locationList);
	app.get('/v1/website/tours/tourtype', controller.tourtypeList); 

	
	
}