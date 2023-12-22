const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const toursController = require('../../controller/admin/toursCont');

module.exports = (app) => {
    // sport
    app.post('/v1/admin/tours/insert', toursController.insert);
    app.get('/v1/admin/tours/list', toursController.list);
    app.post('/v1/admin/tours/info', toursController.info);
    app.post('/v1/admin/tours/update', toursController.update);
    app.post('/v1/admin/tours/delete', toursController.deletedata);
    app.get('/v1/admin/tours/master', toursController.master);

    app.post('/v1/admin/tours/tourspresentation', toursController.tours_presentation);
    app.post('/v1/admin/tours/presentation_update', toursController.tours_presentation_update);
    app.post('/v1/admin/tours/presentation_info', toursController.tours_presentation_info);
    app.post('/v1/admin/tours/downloadsinsert', toursController.toursdownloads);

    app.post('/v1/admin/tours/tourtypeinsert', toursController.tourtypeMst);
    app.get('/v1/admin/tours/tourtypelists', toursController.tourtypeselect);
    app.post('/v1/admin/tours/tourtypeinfo', toursController.tourstypeinfo);
    app.post('/v1/admin/tours/tourtypeupdate', toursController.tourtypeupdate);
    app.post('/v1/admin/tours/tourtypedelete', toursController.tourtypedelete);
    app.post('/v1/admin/tours/toursdownloadsinfo', toursController.tours_downloadsinfo);
    app.post('/v1/admin/tours/deletealltoursdata', toursController.tours_deletealltoursdata);

    app.post('/v1/admin/tours/city', toursController.citylist);
    app.post('/v1/admin/tours/countrylist', toursController.countrylist);
    app.post('/v1/admin/tours/statelist', toursController.statelist);
    



    

    
    
    

    

     
    
    
    
    
}