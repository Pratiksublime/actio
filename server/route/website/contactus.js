const db = require('../../db');

const { userAuth } = require('../../middleware/auth');

var controller = require('../../controller/website/contactusCont');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('/v1/website/contact/insert', controller.Insert);  

	app.post('/v1/website/contact/login', controller.login);  

	app.post('/v1/website/contact/mobilelogin', controller.mobilelogin); 

	app.post('/v1/website/contact/logimobileotp', controller.logimobileotp);

	app.post('/v1/website/contact/createaccountInsert', controller.createaccountInsert);


	app.post('/v1/website/contact/createprofile', controller.createprofile);

	app.post('/v1/website/contact/shearlink', controller.shearlinkToken);
 
	app.post('/v1/website/contact/shearlinkTokenexpired', controller.shearlinkTokenexpired); 

	app.post('/v1/website/contact/sendmobileotp', controller.Sendmobileotpformobile);

	app.post('/v1/website/contact/validotpwithMobile', controller.validotpwithMobile); 

	app.post('/v1/website/contact/sendemailotp', controller.Sendemailotp);

	app.post('/v1/website/contact/validotpwithEmail', controller.validotpwithemail);     

	  

	

	

	

	
	  
	
}