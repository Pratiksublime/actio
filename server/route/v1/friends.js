const friendsController = require('../../controller/v1/friends');
const { body, check } = require('express-validator');
const { userAuth } = require('../../middleware/auth');
const helper = require('../../helper/helper');

module.exports = (app) => {
    const findValidation = [
        body('search', 'Required Search Key').isLength({ min: 1, max: 100 }),
    ];

    const actionValidation = [
        body('friendID', 'Friend ID required').isNumeric(),
        body('actionID', 'Action ID required').isNumeric()
    ];
    
    const listValidation = [
        body('friendID', 'Friend ID required').isNumeric(),
    ];

    app.post('/v1/friend/find', userAuth, findValidation, friendsController.find);
    app.post('/v1/friend/action', userAuth, actionValidation, friendsController.action);
    app.post('/v1/friend/list', userAuth, listValidation, friendsController.list);
}