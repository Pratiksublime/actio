const commonModel = require('../../model/v1/website/login');
//const subscriberModel = require('../model/subscriber');
const helper = require('../../helper/helper');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const db = require('../../db');

const login = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() }); 
    // }
    const result = {};
    try {
    	console.log("hhhhhhhhhhhhhhhh------------");
        // if (req.body.Mode == 1 && (req.body.deviceToken == undefined || req.body.deviceToken == '')) {
        //     let customError = {};
        //     let cusError = {};
        //     cusError.value = req.body.deviceToken;
        //     cusError.msg = "Device Token Required";
        //     cusError.param = "deviceToken";
        //     cusError.location = "body";
        //     customError.errors = [cusError];
        //     customError.status = process.env.STATUS_TEMP_422;
        //     return res.status(process.env.STATUS_422).send(customError);
        // }

        // if (req.body.Mode == 1 && (req.body.role == undefined || req.body.role == '')) {
        //     req.body.role = 'subscriber';
        // }

        // if (req.body.Mode == 2 && (req.body.role == undefined || req.body.role == '')) {
        //     req.body.role = 'admin';
        // }

        // req.body.role = 'admin';
        
        const user = await commonModel.login(req);
        console.log(user);
        console.log("11111111111111111");
        if (user.user) {
            const token = jwt.sign({
                username: req.body.username,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'Login Success';
            result.token = token
            result.subscriberID = user.user.id;
            result.subscriberID_old = user.user.subscriber_id;
            // result.subscriberSeqID = user.user.id;
            // result.subscriberID = user.user.subscriber_id;
            result.profile_image = user.user.profile_image;
            result.userStatus = user.user.status;
            result.fullName = user.user.full_name;
            result.userName = user.user.username;
            result.emailID = user.user.email_id;
            result.isdCode = user.user.isd_code;
            result.mobileNumber = user.user.mobile_number;
            result.role = user.user.role;
            // const reqData = {};
            // reqData.ID = user.user.id;
            // reqData.deviceToken = req.body.deviceToken;
            // reqData.Mode = req.body.Mode
            // await commonModel.logSession(reqData);
        } else {
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'Invalid Login';
        }
        res.status(process.env.STATUS_200).send(result);  
    }
    catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const sendOTP = async (req, res) => {
    const result = {};
    try {
        let otpNumber = Math.floor(1000 + Math.random() * 9000);
        let smsMessage = (req.body.basicOTP) ? `Please enter this OTP ${otpNumber} to complete and submit the tournament registration to Actio Sport Team` : `Welcome to Actio Sport. Please use this OTP to confirm request ${otpNumber} /ADIISHA`;
        const user = await subscriberModel.getUserbyID(req.myID);
        let smsData = {};
        smsData.message = smsMessage;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = (req.body.newISD) ? (req.body.newISD) : user.user.isd_code;
        smsData.number = (req.body.newMobile) ? (req.body.newMobile) : user.user.mobile_number;
        smsData.mobileNumber = smsData.isdcode + smsData.number;
        smsData.subId = user.user.id;

        await subscriberModel.sendOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });

        //  if onlyOTP is sent in body, it will just sent otp and return without updating user status
        if (req.body.onlyOTP) {
            return res.status(process.env.STATUS_200).send({
                status: process.env.STATUS_200,
                msg: 'OTP has been sent to the mobile number !'
            });
        }

        await subscriberModel.updateUserStatus(smsData.subId, process.env.OTPAWAIT);
        result.status = process.env.STATUS_200;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const resendOTP = async (req, res) => {
    const result = {};
    try {
        const user = await subscriberModel.getUserbyName(req.body.username);
        let otpNumber = Math.floor(1000 + Math.random() * 9000);
        let smsData = {};
        smsData.message = `You have requested to reset your Actio Sport password. Please use this OTP for verification is ${otpNumber} /ADIISHA`;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = user.user.isd_code;
        smsData.number = user.user.mobile_number;
        smsData.mobileNumber = user.user.isd_code + user.user.mobile_number;
        smsData.subId = user.user.id;

        await subscriberModel.sendOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });
        await subscriberModel.updateUserStatus(smsData.subId, process.env.OTPAWAIT);
        result.status = process.env.STATUS_200;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const validateOTP = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        const userOTP = await commonModel.validateOTP(req);
        //if(userOTP.otp && "1234" == req.body.otp)
        if (userOTP.otp && userOTP.otp.otp == req.body.otp) {
            result.isValid = true;
            result.status = process.env.STATUS_200;
            result.msg = 'Success';
            await subscriberModel.updateUserStatus(req.myID, process.env.ACTIVE);
            result.userStatus = process.env.ACTIVE;
            const maildata = {};
            maildata.To = userOTP.otp.email_id;
            maildata.Content = 'Welcome to actio , your subscriber id :' + userOTP.otp.subscriber_id + ', User Name :' + userOTP.otp.username;
            maildata.Subject = 'Welcome ' + userOTP.otp.full_name;
            await helper.sendMail(maildata);
        } else {
            result.isValid = false;
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'Invalid OTP';
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const logout = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    try {
        const result = {};
        if (req.body.Mode == 1 && (req.body.deviceToken == undefined || req.body.deviceToken == '')) {
            let customError = {};
            let cusError = {};
            cusError.value = req.body.deviceToken;
            cusError.msg = "Device Token Required";
            cusError.param = "deviceToken";
            cusError.location = "body";
            customError.errors = [cusError];
            customError.status = process.env.STATUS_TEMP_422;
            return res.status(process.env.STATUS_422).send(customError);
        }
        await commonModel.logout(req);
        result.status = process.env.STATUS_200;
        result.msg = 'Logout Success';
        return res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}



const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await commonModel.getUserForgotPassword(req);
    if (!returnedRows.length) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    }
    forgotPasswordOTP(req, res, returnedRows[0]);
}

const forgotPasswordOTP = async (req, res, user) => {
    const result = {};
    try {
        let otpNumber = Math.floor(1000 + Math.random() * 9000);
        let smsData = {};
        smsData.message = `You have requested to reset your Actio Sport password. Please use this OTP for verification is ${otpNumber} /ADIISHA`;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = user.isd_code;
        smsData.number = user.mobile_number;
        smsData.mobileNumber = user.isd_code + user.mobile_number;
        smsData.subId = user.id;

        await subscriberModel.sendOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });
        result.status = process.env.STATUS_200;
        result.msg = `OTP password has been sent to ${user.username} mobile number`;
        result.username = user.username
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const validateForgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    };
    commonModel.validateUserForgotPassword(req, res);
};

const updatePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    };
    commonModel.updatePassword(req, res);
}

const forgotUsername = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await commonModel.getUserForgotUsername(req);
    if (typeof returnedRows === 'object' && Object.keys(returnedRows).length === 0) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    }
    return res.status(process.env.STATUS_200).send({ status: process.env.STATUS_200, result: returnedRows });
}














module.exports = {
    
     login, forgotUsername, resendOTP, sendOTP, validateOTP, logout,
     forgotPassword, validateForgotPassword, updatePassword
}
