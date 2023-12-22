const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const { app } = require('firebase-admin');
const scoreboardController = require('../../../controller/v1/website/scoreboardCont');

const cron = require('../../../controller/admin/cron');

const paymentController = require('../../../controller/v1/website/paymentCont');

module.exports = (app) => {
    // sport
    app.get('/v1/website/scoreboard/actionlist', scoreboardController.actionlist);
    app.get('/v1/website/scoreboard/kpilist', scoreboardController.kpilist);
    


}