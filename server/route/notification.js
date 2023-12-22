const helper = require('../helper/helper');
const { userAuth } = require('../middleware/auth');
const { body } = require('express-validator');
const notifyController = require('../controller/v1/notification');

module.exports = (app) => {
    const seenValidation = [
        body('notifyID', 'Notification ID required').isNumeric()
    ];

    app.post('/v1/notify/list', userAuth, notifyController.list);
    app.post('/v1/notify/seen', userAuth, seenValidation, notifyController.seen);
}