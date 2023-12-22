const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const subscriberModel = require('../../../model/v1/subscriber');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const jwt = require('jsonwebtoken');

const Model = require('../../../model/v1/website/contactus');
// const {queryMongo,mongoose} = require('/var/www/code/play_actio_api/mongoserver/mongodb');
// const {Schema} = require('/var/www/code/play_actio_api/mongoserver/model/schema');
const { queryMongo, mongoose } = require('../../../../mongoserver/mongodb');
const { Schema } = require('../../../../mongoserver/model/schema');


// const Insert = async (req, res) => {
//     try {
//         const result = {};
//         const Wesbite = await Model.Insert(req);
//         result.status = process.env.STATUS_200;
//         result.data = Wesbite;
//         res.status(result.status).send(result);
//     } catch (err) {
//         const error = {};
//         error.status = process.env.STATUS_500;
//         error.message = "something wen't wrong...!!"
//         res.status(error.status).send({ status: error.status, msg: error.message });
// 	}
// }

const Insert = async (req, res) => {

    const result = {};
    try {

        const Wesbite = await Model.Insert(req, res);
        console.log('HHHHHHHHHHHHHHHHHH Wesbite');
        console.log(Wesbite)

        let email_id = Wesbite.rows[0].email_id;
        console.log(email_id);

        //if(userOTP.otp && "1234" == req.body.otp)
        if (Wesbite) {

            result.isValid = true;
            result.status = process.env.STATUS_200;
            result.msg = 'Success';

            const maildata = {};
            maildata.To = email_id;
            maildata.Content = 'Thank you for getting in touch! We appreciate you contacting Actio Sports. One of our colleagues will get back in touch with you soon! Have a great day!';
            maildata.Subject = 'Call Back Request ';

            maildata.html = '<b>Thank you</b> for getting in touch! We appreciate you contacting Actio Sports. One of our colleagues will get back in touch with you soon! Have a great day!';


            console.log("maildata");
            console.log(maildata);

            await helper.sendMailweb(maildata);
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


const createprofile = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.createprofile(req);
        console.log('Wesbite.....................');
        console.log(Wesbite)
        const token = jwt.sign({

        }, process.env.SECRET);

        console.log('token........eeeeeee');
        console.log(token)
        result.status = process.env.STATUS_200;
        result.message = 'data added successfully.....';
        result.token = token;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const shearlinkToken = async (req, res) => {

    const result = {};
    try {


        const token = jwt.sign({

        }, process.env.SECRET, { expiresIn: '7d' });

        const user = await Model.shearlinkToken(req, token);
        result.status = process.env.STATUS_200;
        result.msg = 'Success';
        result.token = token


        res.status(process.env.STATUS_200).send(result);
    }
    catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const shearlinkTokenexpired = async (req, res) => {
    try {

        let decodedToken = '';
        const token = req.get('Authorization').split(' ')[1];



        console.log(token);

        let SECRET = process.env.SECRET

        jwt.verify(token, SECRET, function (err, decoded) {

            if (err) {
                name = 'TokenExpiredError';
                message = 'jwt token expired';
                res.status(401).send({ msg: message, status: 1 });

            }

            else {

                message = 'valid token';
                res.status(200).send({ msg: message, status: 0 });
            }
        });


    }
    catch (err) {

    }
}




const login = async (req, res) => {

    const result = {};
    try {

        const user = await Model.login(req);

        if (user.user) {
            const token = jwt.sign({
                username: req.body.email_id,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'Login Success';
            result.token = token
            result.subscriberID = user.user.id;


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


const mobilelogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await Model.mobilelogin(req);

    // if (!returnedRows.length) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    // }
    forgotPasswordOTP(req, res, returnedRows[0]);
}

const Sendmobileotpformobile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await Model.Sendmobileotp(req);

    // if (!returnedRows.length) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    // }
    sendmobileOTPdata(req, res, returnedRows[0]);
}

const Sendemailotp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await Model.Sendemailotp(req);

    // if (!returnedRows.length) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    // }
    sendemailOTPdata(req, res, returnedRows[0]);
}


const createaccountInsert = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const returnedRows = await Model.createaccountInsert(req);

    // if (!returnedRows.length) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, msg: 'No matching records found' });
    // }
    forgotPasswordOTP(req, res, returnedRows[0]);
}

const forgotPasswordOTP = async (req, res, user) => {
    const result = {};
    try {


        let otpNumber = Math.floor(100000 + Math.random() * 900000);
        let smsData = {};
        const maildata = {};
        smsData.message = `You have requested to reset your Actio Sport password. Please use this OTP for verification is ${otpNumber} /ADIISHA`;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = user.isd_code;
        smsData.number = user.mobile_number;
        smsData.mobileNumber = user.isd_code + user.mobile_number;
        smsData.subId = user.id;
        smsData.email_id = user.email_id;


        //.................send otp on email id ...............//
        maildata.To = user.email_id;
        maildata.Content = 'OTP for login:' + otpNumber;
        maildata.Subject = 'OTP';
        maildata.html = 'Dear Customer,<br>Your one time password for completing your transaction is <b> ' + otpNumber + '</b>.<br>Please use this password to complete your process your account opening process.Do not share this OTP with anyone. <br>Thank You <br> ActioSport<br> Disclaimer: This email and any file transmitted with it are confidential and intended solely for the use of the individual entity whose they are addressed'

        await helper.sendMailweb(maildata);
        await Model.sendOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });



        result.status = process.env.STATUS_200;
        result.exist = 1;
        if (typeof user.mobile_number !== 'undefined') {
            result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;
        }
        else {
            result.msg = `already exist`;
            result.exist = 0;
        }
        //result.token = token;
        result.id = user.id;
        result.isd_code = user.isd_code;
        result.number = user.mobile_number;
        result.email_id = user.email_id;

        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = 200;
        error.message = 'not exist login.';
        error.exist = 0
        res.status(error.status).send({ status: error.status, msg: error.message, exist: error.exist });
    }
}

const sendmobileOTPdata = async (req, res, user) => {
    const result = {};
    try {


        //let otpNumber = Math.floor(100000 + Math.random() * 900000); 
        let otpNumber = '111111';
        let smsData = {};
        const maildata = {};
        smsData.message = `You have requested to reset your Actio Sport password. Please use this OTP for verification is ${otpNumber} /ADIISHA`;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = user.isd_code;
        smsData.number = user.mobile_number;
        smsData.mobileNumber = user.isd_code + user.mobile_number;
        smsData.subId = user.id;
        smsData.email_id = user.email_id;


        //.................send otp on email id ...............//
        maildata.To = user.email_id;
        maildata.Content = 'OTP for login:' + otpNumber;
        maildata.Subject = 'OTP';

        //await helper.sendMailweb(maildata);
        await Model.sendwithMobileOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });



        result.status = process.env.STATUS_200;
        result.exist = 1;
        if (typeof user.mobile_number !== 'undefined') {
            result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;
        }
        else {
            result.msg = `already exist`;
            result.exist = 0;
        }
        //result.token = token;
        result.id = user.id;
        result.isd_code = user.isd_code;
        result.number = user.mobile_number;
        result.email_id = user.email_id;

        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = 200;
        error.message = 'not exist login data.';
        error.exist = 0
        res.status(error.status).send({ status: error.status, msg: error.message, exist: error.exist });
    }
}


const sendemailOTPdata = async (req, res, user) => {
    const result = {};
    try {


        let otpNumber = Math.floor(100000 + Math.random() * 900000);
        let smsData = {};
        const maildata = {};
        smsData.message = `You have requested to reset your Actio Sport password. Please use this OTP for verification is ${otpNumber} /ADIISHA`;
        smsData.otpNumber = otpNumber;
        smsData.isdcode = user.isd_code;
        smsData.number = user.mobile_number;
        smsData.mobileNumber = user.isd_code + user.mobile_number;
        smsData.subId = user.id;
        smsData.email_id = user.email_id;


        //.................send otp on email id ...............//
        maildata.To = user.email_id;
        maildata.Content = 'OTP for login:' + otpNumber;
        maildata.Subject = 'OTP';
        maildata.html = 'Dear Customer,<br>Your one time password for completing your transaction is <b> ' + otpNumber + '</b>.<br>Please use this password to complete your process your account opening process.Do not share this OTP with anyone. <br>Thank You <br> ActioSport<br> Disclaimer: This email and any file transmitted with it are confidential and intended solely for the use of the individual entity whose they are addressed'

        await helper.sendMailweb(maildata);
        await Model.sendwithemailOtp(smsData);
        // await helper.sendSMS(smsData, (err, data) => { 
        //      global.smsResponse = data;
        // });



        result.status = process.env.STATUS_200;
        result.exist = 1;
        if (typeof user.mobile_number !== 'undefined') {
            result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;
        }
        else {
            result.msg = `already exist`;
            result.exist = 0;
        }
        //result.token = token;
        result.id = user.id;
        result.isd_code = user.isd_code;
        result.number = user.mobile_number;
        result.email_id = user.email_id;

        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = 200;
        error.message = 'not exist login data email_id.';
        error.exist = 0
        res.status(error.status).send({ status: error.status, msg: error.message, exist: error.exist });
    }
}


const logimobileotp = async (req, res) => {
    const result = {};
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    // };
    // Model.validateUserForgotPassword(req, res);


    try {


        console.log("hhhhpppp------------");
        console.log(req);
        const user = await Model.validateUserForgotPassword(req);
        console.log("hhhhpppp------------");
        console.log(user);
        if (user.user) {


            const token = jwt.sign({
                //username: req.body.email_id,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'Academy Success';
            result.token = token
            result.subscriberID = user.user.subscriber_sid;
            result.name = user.user.full_name;


            result.Status = user.user.status;
            //result.fullName = user.user.full_name;
            //result.userName = user.user.username;
            result.email_id = user.user.email_id;
            result.isd_code = user.user.isd_code;
            result.mobileNumber = user.user.mobile_number;



        } else {
            result.status = process.env.STATUS_200;
            result.msg = 'Invalid';
        }
        res.status(process.env.STATUS_200).send(result);
    }
    catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
};

const validotpwithMobile = async (req, res) => {

    const result = {};

    try {
        const user = await Model.validmobileotp(req);

        if (!user || !user.user) {
            result.status = 200;
            result.msg = 'Invalid ';
            return res.status(200).send(result);
        }

        let acd = mongoose.model('Mainaccounts', Schema.Mainaccounts);
        let acdm = await acd.findOne({ status: 1, role_id: 2, subscriberID: user.user.subscriber_sid });

        let levelquery = mongoose.model('leveldata', Schema.leveldata);
        let leveldata = await levelquery.findOne({ status: 1, subscriberID: user.user.subscriber_sid });

        let academy = null;
        let academy_role = null;
        let level = null;
        let level_role = null;
        let academy_id = null;

        if (acdm) {
            academy = acdm.id;
            academy_role = acdm.role_id;
        }

        if (leveldata) {
            level = leveldata.id;
            level_role = leveldata.role_id;
            academy_id = leveldata.academy_id;
        }

        const token = jwt.sign({
            id: user.user.subscriber_sid
        }, process.env.SECRET);

        result.status = 200;
        result.msg = 'Academy Success';
        result.token = token;
        result.subscriberID = user.user.subscriber_sid;
        // ... [other fields]
        result.academy_id = academy;
        result.levelacademyid = academy_id;
        result.academy_role = academy_role;
        result.level_id = level;
        result.level_role = level_role;

        res.status(200).send(result);

    } catch (err) {
        res.status(500).send({ status: 500, msg: 'Something Went Wrong' });
    }

    //     const result = {};


    //     try {

    //         const user = await Model.validmobileotp(req); 
    //          console.log("hhhhpppp------------");
    //         console.log(user);




    //             let Collection = "Mainaccounts";
    //             let acd = mongoose.model(Collection, Schema.Mainaccounts);
    //             let acdm = await acd.findOne({ subscriberID: user.user.subscriber_sid });
    //             let academy = null;
    //             let academy_role = null;



    //             let levelquery = mongoose.model('leveldata', Schema.leveldata);
    //             let leveldata = await levelquery.findOne({ subscriberID: user.user.subscriber_sid });
    //             let level = null;
    //             let level_role = null;


    //             console.log(leveldata.length);
    //             console.log(leveldata);


    //             console.log(acdm.length);


    //             console.log(acdm);

    //             console.log("acdm and levael data.length...........*************************************."); 



    //             if(acdm.length >0 && acdm){

    //                 console.log("academydata ....... ");
    //                 academy = acdm.id;
    //                 academy_role = acdm.role_id;
    //                 console.log(academy)
    //             }

    //             if(leveldata.length >0 && leveldata){
    //                 level = leveldata.id;
    //                 level_role = leveldata.role_id,
    //                 academy_id = leveldata.academy_id
    //                 console.log(level)
    //             }




    //         console.log('academy_role.....11111111111111111111111111111111111111111111111111....................................')
    //         console.log(academy_role)
    //         if (user.user) {


    //             const token = jwt.sign({
    //                 //username: req.body.email_id,
    //                 id: user.user.subscriber_sid
    //             }, process.env.SECRET);
    //             result.status = process.env.STATUS_200;
    //             result.msg = 'Academy Success';
    //             result.token = token
    //             result.subscriberID = user.user.subscriber_sid;
    //             result.name = user.user.full_name;
    //             result.role = user.user.role;


    //             result.Status = user.user.status;
    //             result.gender = user.user.gender;
    //             result.age = user.user.age;
    //             result.date_of_birth =user.user.date_of_birth
    //             result.email_id = user.user.email_id;
    //             result.isd_code = user.user.isd_code;
    //             result.mobileNumber = user.user.mobile_number; 
    //             result.academy_id = academy;
    //             result.levelacademyid = academy_id;
    //             result.academy_role = academy_role;
    //             result.level_id = level;
    //             result.level_role = level_role;

    //  console.log('resultresultresultresultresultresult.....11111111111111111111111111111111111111111111111111....................................')
    //         console.log(result)

    //         } else {
    //             result.status = process.env.STATUS_200;
    //             result.msg = 'Invalid ';
    //         }
    //         res.status(process.env.STATUS_200).send(result);  
    //     }
    //     catch (err) {
    //         const error = {};
    //         error.status = process.env.STATUS_500;
    //         error.message = 'Something Went Wrong';
    //         res.status(error.status).send({ status: error.status, msg: error.message });
    //     }
};



const validotpwithemail = async (req, res) => {
    //     const result = {};
    //     try {
    //         const user = await Model.validemailotp(req); 
    //         console.log("hhhhpppp------------");
    //         console.log(user);

    //         console.log('acdm........***********************************88.qqqqqqqqq44444444444');
    //         console.log(user.user.subscriber_sid);

    //         let Collection = "Mainaccounts";
    //         let acd = mongoose.model(Collection, Schema.Mainaccounts);
    //         let acdm = await acd.findOne({ subscriberID: user.user.subscriber_sid });
    //         let academy = null;
    //         academy_role = null;

    //         console.log("acdm.length............");

    //         let levelquery = mongoose.model('leveldata', Schema.leveldata);
    //             let leveldata = await levelquery.findOne({ subscriberID: user.user.subscriber_sid });
    //             let level = null;
    //             let level_role = null;

    //             console.log("acdm.length............");

    //             if(leveldata){
    //                 level = leveldata.id;
    //                 level_role = leveldata.role_id;
    //                 console.log(level)
    //             }

    //             else if(acdm ) {

    //                 console.log("No matching document found ");
    //                 academy = acdm.id;
    //                 academy_role = acdm.role_id;
    //                 console.log(academy)
    //             }else{
    //                 console.log("No matching document found in Mainaccounts collection");
    //             }



    //         console.log('acdm.....11111111111111111111111111111111111111111111111111....................................')
    //         console.log(acdm)


    //         console.log("hhhhpppp------------ttttttttttttttttttttt");
    //         console.log(user);
    //         if (user.user) {


    //             const token = jwt.sign({
    //                 //username: req.body.email_id,
    //                 id: user.user.subscriber_sid
    //             }, process.env.SECRET);
    //             result.status = process.env.STATUS_200;
    //             result.msg = 'Academy Success';
    //             result.token = token
    //             result.subscriberID = user.user.subscriber_sid;
    //             result.name = user.user.full_name + ' ' + user.user.last_name;
    //             result.role = user.user.role;
    //             result.date_of_birth =user.user.date_of_birth
    //             result.Status = user.user.status;
    //             result.gender = user.user.gender;
    //             result.age = user.user.age;
    //             result.email_id = user.user.email_id;
    //             result.isd_code = user.user.isd_code;
    //             result.mobileNumber = user.user.mobile_number; 
    //             result.academy_id = academy;
    //             result.academy_role = academy_role;
    //             result.level_id = level;
    //             result.level_role = level_role;
    //             console.log("resultyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    // console.log(result);

    //         } else {
    //             result.status = process.env.STATUS_200;
    //             result.msg = 'Invalid';
    //         }
    //         res.status(process.env.STATUS_200).send(result);  
    //     }
    //     catch (err) {
    //         const error = {};
    //         error.status = process.env.STATUS_500;
    //         error.message = 'Something Went Wrong';
    //         res.status(error.status).send({ status: error.status, msg: error.message });
    //     }
    const result = {};

    try {
        const user = await Model.validemailotp(req);

        if (!user || !user.user) {
            result.status = 200;
            result.msg = 'Invalid ';
            return res.status(200).send(result);
        }

        let acd = mongoose.model('Mainaccounts', Schema.Mainaccounts);
        let acdm = await acd.findOne({ status: 1, subscriberID: user.user.subscriber_sid });

        let levelquery = mongoose.model('leveldata', Schema.leveldata);
        let leveldata = await levelquery.findOne({ status: 1, subscriberID: user.user.subscriber_sid });

        let academy = null;
        let academy_role = null;
        let level = null;
        let level_role = null;
        let academy_id = null;

        if (acdm) {
            academy = acdm.id;
            academy_role = acdm.role_id;
        }

        if (leveldata) {
            level = leveldata.id;
            level_role = leveldata.role_id;
            academy_id = leveldata.academy_id;
        }

        const token = jwt.sign({
            id: user.user.subscriber_sid
        }, process.env.SECRET);

        result.status = 200;
        result.msg = 'Academy Success';
        result.token = token;
        result.subscriberID = user.user.subscriber_sid;

        result.name = user.user.full_name + ' ' + user.user.last_name;
        result.role = user.user.role;
        result.date_of_birth = user.user.date_of_birth
        result.gender = user.user.gender;
        result.age = user.user.age;
        result.email_id = user.user.email_id;
        result.isd_code = user.user.isd_code;
        result.mobileNumber = user.user.mobile_number;
        result.academy_id = academy;
        //result.levelacademyid = academy_id;
        // result.academy_role = academy_role;
        //result.level_id = level;
        //result.level_role = level_role;

        res.status(200).send(result);

    } catch (err) {
        res.status(500).send({ status: 500, msg: 'Something Went Wrong' });
    }
};










module.exports = { Insert, login, mobilelogin, forgotPasswordOTP, logimobileotp, createaccountInsert, createprofile, shearlinkToken, shearlinkTokenexpired, Sendmobileotpformobile, Sendemailotp, validotpwithMobile, validotpwithemail };