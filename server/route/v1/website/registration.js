const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const registrationController = require('../../../controller/v1/website/registration');

const cron = require('../../../controller/admin/cron');

const paymentController = require('../../../controller/v1/website/paymentCont');

module.exports = (app) => {
    // sport
    app.post('/v1/website/registration/insert', registrationController.insert);
    app.post('/v1/website/registration/singleplayerinsert', registrationController.singleplayer);
    app.get('/v1/website/registration/eventfilter', registrationController.eventfilter); 

    app.get('/v1/website/registration/rolelist', registrationController.rolelist);  
    app.post('/v1/website/registration/yearlist', registrationController.yearlist); 


    app.post('/v1/website/registration/payment', paymentController.payment); 

    app.post('/v1/website/registration/qualificationstatus', registrationController.qualificationstatus); 

    app.get('/v1/website/registration/subscriberbyid', registrationController.Listdata); 

    app.post('/v1/website/registration/update', registrationController.updatesubscriber); 

    app.post('/v1/website/registration/registrationbysublid', registrationController.registrationbysublid); 

    app.post('/v1/website/registration/demo', registrationController.demo);  
 

    app.post('/v1/website/registration/registrationinfo', registrationController.registrationinfo);

     app.post('/v1/website/registration/subscribermatchlist', registrationController.subscribermatchlist); 

     app.post('/v1/website/registration/registrationstatus', registrationController.registrationstatus); 

    app.post('/v1/website/registration/updateregistration', registrationController.update);

    app.post('/v1/website/registration/sendreminder', cron.sendreminder); 


    app.post('/v1/website/registration/pastregistrationbysublid', registrationController.pastregistrationbysublid);
    
    app.post('/v1/website/registration/mongoinser', registrationController.mongoinser);   


}