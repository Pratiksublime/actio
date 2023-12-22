const dashboardController = require('../../controller/v1/dashboard');
const { body, check } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const helper = require('../../helper/helper');

module.exports = (app) => {

    app.post('/v1/dashboard/count', userAuth, dashboardController.count);
    app.post('/v1/dashboard/module/list', userAuth, dashboardController.listModule);
};