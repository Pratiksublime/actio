const { body } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const { app } = require('firebase-admin');
const Controller = require('../../controller/admin/country_state_city');

module.exports = (app) => {
    // activities
    app.post('/v1/admin/add', Controller.add);
    

}