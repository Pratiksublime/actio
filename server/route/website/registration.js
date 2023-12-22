const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const registrationController = require('../../controller/website/registration');

module.exports = (app) => {
    // sport
    app.post('/v1/admin/registration/insert', registrationController.insert); 
    
}