const { body } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const roleController = require('../../../controller/v1/admin/role');
const helper = require('../../../helper/helper');

module.exports = (app) => {
    const initValidation = [
        body('subscriberID', 'Subscriber ID Required')
            .isString()
            .isLength({ min: 1 })
    ];
    
    const submitValidation = [
        body('subscriberID', 'Subscriber ID Required').isNumeric(),
        body('roleID', 'Role ID Required').isNumeric(),
        body('validityDate', 'Date must be in DD-MM-YYYY format').custom(helper.isValidDate).optional({ checkFalsy: true }),
        body('menuID', 'Menu ID Must Numeric').optional({ checkFalsy: true }).isArray()
    ];

    app.post('/v1/role/init', userAuth, initValidation, roleController.init);
    app.post('/v1/role/submit', userAuth, submitValidation, roleController.submit);
}