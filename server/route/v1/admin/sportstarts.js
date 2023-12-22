
const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const stacController = require('../../../controller/v1/admin/sportStarts');

module.exports = (app) => {

	app.post('/v1/admin/stac/insert',userAuth,stacController.sportStart);

	app.get('/v1/admin/stac/list',userAuth,stacController.getlist);

	app.post('/v1/admin/stac/update',userAuth,stacController.updatedata);

	app.post('/v1/admin/stac/info',userAuth,stacController.getinfo); 

	app.post('/v1/admin/stac/delete',userAuth,stacController.deleteinfo);

	app.get('/v1/admin/stac/list_by_id',userAuth,stacController.listByID);  

}