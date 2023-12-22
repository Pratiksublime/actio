const db = require('../../../db');

const { userAuth } = require('../../../middleware/auth');

var controller = require('../../../controller/v1/website/master_permission');
// const auth = require('./../../../src/config/auth');

module.exports = (app) => {
	
	app.post('/v1/website/masterpermission/add', controller.Add);

	app.get('/v1/website/masterpermission/list', controller.List);   

	app.post('/v1/website/masterpermission/addsubmenu', controller.Addsubmenu); 
	
	app.post('/v1/website/masterpermission/addrole', controller.Addrole); 

	app.get('/v1/website/masterpermission/submenulist', controller.Submenulist); 

	app.post('/v1/website/masterpermission/rolelistbyid', controller.Rolelistbyid); 

	

	

	

	
	  
	
}