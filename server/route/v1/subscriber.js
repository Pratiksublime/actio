const subscriberController = require('../../controller/v1/subscribers');
const { body, check } = require('express-validator');
const auth = require('../../middleware/auth');
const helper = require('../../helper/helper');

module.exports = (app) => {
    const initValidation = [
        body('countryID', 'Country ID must be number with in digits 1 to 10 ')
            .optional()
            .isNumeric()
            .isLength({ min: 1, max: 10 })
    ];
    // const submitvalidation = [
    //     body('userType','Invalid User type')
    //     .custom((value,{req, loc, path}) => {
    // if (value==1 || value=='1') {

    // } else if (value==2 || value=='2') {
    //     body('Mode','Mode Required')
    //     .isInt({min:1,max:3}),
    //     body('fullName','Name must be with in 5 to 100 Characters')
    //     .trim()
    //     .isLength({min:2,max:100}),
    //     body('designation','Designation must be with in 5 to 100 Characters')
    //     .trim()
    //     .isLength({min:2,max:100}),
    //     body('mobileNumber','Mobile must be number')
    //     .isNumeric(),
    //     body('emailID','Invalid Email ID')
    //     .isEmail(),
    //     //body('idType','ID type must be number and with in 10 digits')
    //    // .optional(),
    //    // body('idNumber','ID Number required and with in 1 to 50 Characters')
    //    // .optional(),
    //     body('userName', 'User Name Already Exist')
    //      .custom(subscriberController.isuserExist),
    //     body('userName', 'User name must ber with in 5 to 100 Characters')
    //     .isLength({min:5,max:100}),
    //     body('password','Password must be with in 5 to 50 Characters')
    //     .isLength({min:5,max:50}),
    //     body('confirmPassword')
    //     .custom((value,{req, loc, path}) => {
    //         if (value !== req.body.password) {
    //             return false;
    //         } else {
    //             return value;
    //         }
    //     }).withMessage('Mismatch in Password and Confirm Password')
    // }
    // return true;
    //     })
    // ];

    // Parent Check 
    const parentCheckvalidation = [
        body('relationID')
            .optional()
            .isNumeric()
            .withMessage('Relation ID must be Number'),
        body('fullName', 'Full name must ber with in 5 to 100 Characters')
            .isLength({ min: 5, max: 100 }),
    ];

    // parent id submit
    const parentIDvalidation = [
        body('parentID')
            .isNumeric()
            .withMessage('Parent ID must be Number')
            .isLength({ min: 1, max: 10 })
            .withMessage('Parent ID must be with in 10 digits'),
        body('Mode')
            .isInt({ min: 1, max: 2 })
            .withMessage('Mode Must be 1 or 2')
    ];

    // Parent Approval 
    const parentApprovalInitvalidation = [
        body('childID')
            .isNumeric()
            .withMessage('Child ID must be Number')
            .isLength({ min: 1, max: 10 })
            .withMessage('Child ID must be with in 10 digits'),
    ];

    // Parent Approval 
    const parentApprovalvalidation = [
        body('childID')
            .isNumeric()
            .withMessage('Child ID must be Number')
            .isLength({ min: 1, max: 10 })
            .withMessage('Child ID must be with in 10 digits'),
        body('relationID')
            .optional()
            .isNumeric()
            .withMessage('Relation ID must be Number'),
        body('Mode')
            .isInt({ min: 1, max: 2 })
            .withMessage('Mode Must be 1 or 2'),
        body('Status')
            .isInt({ min: 0, max: 1 })
            .withMessage('Status Must be 0 or 1')
    ];

    const getSubscribervalidation = [
        body('id')
            .isNumeric()
            .withMessage('Subscriber ID must be Number')
    ];

    const listValidation = [
        body('master').optional({ checkFalsy: true }).isBoolean().withMessage('Must be Boolean'),
        body('subscriberType').optional({ checkFalsy: true }).isNumeric().withMessage('Must be Number'),
        body('subscriberStatus').optional({ checkFalsy: true }).isNumeric().withMessage('Must be Number'),
        body('fromDate', 'From Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate),
        body('toDate', 'To Date must be in DD-MM-YYYY format').optional({ checkFalsy: true }).custom(helper.isValidDate)
            .custom((value, { req, loc, path }) => {
                if (typeof (value) != "undefined" && typeof (req.body.fromDate) != "undefined" && req.body.fromDate != '' && value != '') {
                    let strfromdate = req.body.fromDate.split('-');
                    let newfromDate = strfromdate[2] + '-' + strfromdate[1] + '-' + strfromdate[0];
                    let strtodate = value.split('-');
                    let newtoDate = strtodate[2] + '-' + strtodate[1] + '-' + strtodate[0];
                    let fromDate = new Date(newfromDate);
                    let toDate = new Date(newtoDate);
                    if (fromDate > toDate) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }).withMessage('Invalid To Date')
    ];

    const profileValidation = [
        body('subscriberID').isNumeric().withMessage('Subscriber ID must be Number')
    ];

    // subscriber 
    const subscriberValidation = [
        body('subscriberID', 'Required subscriber ID ').isNumeric(),
        body('fullName', 'Name must be with in 5 to 100 Characters')
            .trim().isLength({ min: 5, max: 100 }),
        body('isdCode', 'ISD Code be with in 1 to 10 Characters')
            .trim().isLength({ min: 1, max: 10 }),
        body('mobileNumber', 'Mobile must be number and 10 digits')
            .isNumeric().isLength({ min: 10, max: 10 }),
        body('emailID', 'Invalid Email ID').isEmail(),
        body('gender', 'Must be number').optional({ checkFalsy: true }).isNumeric(),
        body('dob', 'DOB must be in DD-MM-YYYY format').custom(helper.isValidDate),
        body('idType', 'ID type must be number and with in 10 digits').optional().isNumeric().isLength({ min: 1, max: 10 }),
        body('idNumber', 'ID Number required and with in 1 to 50 Characters').optional().isLength({ min: 1, max: 50 }),
        body('password', 'Password must be with in 5 to 50 Characters').optional({ checkFalsy: true }).isLength({ min: 5, max: 50 }),
        body('confirmPassword').optional({ checkFalsy: true }).custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                return false;
            } else {
                return value;
            }
        }).withMessage('Mismatch in Password and Confirm Password'),
        body('frontImage', 'Must be Image').optional({ checkFalsy: true })
            .custom((value, { req, loc, path }) => {
                if (typeof (value) == "undefined") {
                    return false;
                } else if (!value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)) {
                    return false;
                } else {
                    return true;
                }
            }),
        body('backImage', 'Must be Image').optional({ checkFalsy: true })
            .custom((value, { req, loc, path }) => {
                if (typeof (value) == "undefined") {
                    return false;
                } else if (!value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)) {
                    return false;
                } else {
                    return true;
                }
            }),
        body('profileImage', 'Must be Image').optional({ checkFalsy: true })
            .custom((value, { req, loc, path }) => {
                if (typeof (value) == "undefined") {
                    return false;
                } else if (!value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)) {
                    return false;
                } else {
                    return true;
                }
            })
    ];

    app.post('/v1/subscriber/init', initValidation, subscriberController.init);
    app.post('/v1/subscriber/register', subscriberController.register);
    app.post('/v1/subscriber/parentCheck', auth.userAuth, parentCheckvalidation, subscriberController.parentCheck);
    app.post('/v1/subscriber/parentID', auth.userAuth, parentIDvalidation, subscriberController.parentIDsubmit);
    app.post('/v1/subscriber/parentApprovalInit', auth.userAuth, parentApprovalInitvalidation, subscriberController.parentApprovalInit);
    app.post('/v1/subscriber/parentApproval', auth.userAuth, parentApprovalvalidation, subscriberController.parentCheck);
    app.post('/v1/subscriber/userstatusInfo', auth.userAuth, subscriberController.userstatusInfo);
    app.post('/v1/subscriber/getbyID', auth.userAuth, getSubscribervalidation, subscriberController.getbyID);
    app.post('/v1/subscriber/list', listValidation, subscriberController.list);

    app.post('/v1/subscriber/adharstatusupdate', subscriberController.adhar_statusupdate);
    //app.post('/v1/subscriber/profile', auth.userAuth, profileValidation, subscriberController.profile);
    app.post('/v1/subscriber/profile', subscriberController.profile);
    app.post('/v1/subscriber/edit', auth.userAuth, subscriberValidation, subscriberController.subscriberEdit);
    app.post('/v1/subscriber/getByIds', auth.userAuth, subscriberController.getByIds); 
};