
const commonController = require('../../controller/v1/common');
const { body, check } = require('express-validator');
const auth = require('../../middleware/auth');



module.exports = (app) => {
    //login
    const loginvalidation = [
        body('username', 'User Name Required')
            .isLength({ min: 1 }),
        body('password', 'Password Rquired')
            .isLength({ min: 1 }),
        body('Mode', 'Mode Required')
            .isInt({ min: 1, max: 3 })
    ];

    //resendOTP
    const resendOTPValidation = [
        body('username', 'User Name Required')
            .isLength({ min: 1 }),
    ];

    const otpvalidation = [
        body('otp')
            .isNumeric()
            .withMessage('OTP must number')
            .isLength({ min: 4, max: 4 })
            .withMessage('OTP must have 4 digits'),
    ];

    const logoutvalidation = [
        body('Mode')
            .isInt({ min: 1, max: 3 })
            .withMessage('Mode Required'),
    ];

    const forgotPasswordValidation = [
        body('username', 'User Name Required')
    ];

    const validateForgotPasswordValidation = [
        body('username')
            .isLength({ min: 1 }),
        body('otp', 'OTP invalid')
            .isNumeric()
            .withMessage('OTP must number')
            .isLength({ min: 4, max: 4 })
            .withMessage('OTP must have 4 digits'),
    ];

    const validateUpdatePasswordValidation = [
        body('password1', 'Password must be with in 5 to 50 Characters')
            .isLength({ min: 5, max: 50 }),
        body('password2', 'Password must be with in 5 to 50 Characters')
            .isLength({ min: 5, max: 50 }),
        body('username')
            .isLength({ min: 1 }),
        body('oldpassword')
            .custom((value, { req, loc, path }) => {
                if (!req.body.oldpassword) {
                    return true;
                }
                if (req.body.oldpassword.length < 5 || req.body.oldpassword.length > 50) {
                    return false;
                }
                return true
            })
    ];

    
    const forgotUsername = [
        body('emailID', 'Invalid Email ID')
            .isEmail(),
        body('mobileNumber', 'Mobile must be number and 10 digits')
            .isNumeric()
            .isLength({ min: 10, max: 10 })
    ];

    let suggestionvalidation = [
        body('search'),
        body('type')
    ];

    app.post('/v1/login', loginvalidation, commonController.login);
    app.post('/v1/academylogin', commonController.academy_login);
    app.post('/v1/sendotp', auth.userAuth, commonController.sendOTP);
    app.post('/v1/forgotpasswordresendotp', resendOTPValidation, commonController.resendOTP);
    app.post('/v1/validateotp', auth.userAuth, otpvalidation, commonController.validateOTP);
    app.post('/v1/logout', auth.userAuth, logoutvalidation, commonController.logout);
    app.post('/v1/menu', auth.userAuth, commonController.userMenu);
    app.post('/v1/forgotpassword', forgotPasswordValidation, commonController.forgotPassword);
    app.post('/v1/validateforgotpassword', validateForgotPasswordValidation, commonController.validateForgotPassword);
    app.post('/v1/updatepassword', validateUpdatePasswordValidation, commonController.updatePassword);
    app.post('/v1/getRelations', commonController.getRelations);
    app.post('/v1/forgotUsername', forgotUsername, commonController.forgotUsername);
    app.post('/v1/suggestion', suggestionvalidation, commonController.suggestion);

    app.get('/v1/getRequestValidationToken', commonController.getRequestValidationToken);
    app.get('/v1/getProfileInformation', auth.userAuth, commonController.sendClient);
    app.get('/v1/getCalendarInformation', auth.userAuth, commonController.getCalendarInformation);
    app.get('/v1/getSpecificCalendarInformation', auth.userAuth, commonController.getSpecificCalendarInformation);


    app.get('/v1/website/banner', loginvalidation, commonController.bannerList);
    app.get('/v1/website/testimonial', loginvalidation, commonController.testimonialList);

    
    
};