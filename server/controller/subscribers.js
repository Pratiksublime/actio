const subscriberModel = require('../model/v1/subscriber');
const profileModel = require('../model/v1/profile');
const commonModel = require('../model/v1/common');
const { validationResult, body } = require('express-validator');
const request = require('postman-request');
const jwt = require('jsonwebtoken');
const helper = require('../helper/helper');
const log = require('../helper/config.json').log.subscriber;
const Notifylog = require('../helper/config.json').log.notification;
const notificationmodel = require('../model/v1/notification');
const db = require('../db');
// const db = require('../db');

const init = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = {};
    try {
        result = await subscriberModel.init(req);
        result.status = process.env.STATUS_200;
        return res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const register = async (req, res) => {
    if (req.body.userType == 1 || req.body.userType == '1') {
        // input validation
        await body('Mode', 'Mode Required')
            .isInt({ min: 1, max: 3 })
            .run(req)
        await body('fullName', 'Name must be with in 5 to 100 Characters')
            .trim()
            .isLength({ min: 2, max: 100 })
            .run(req)
        // body('isdCode','ISD Code be with in 1 to 10 Characters')
        // .trim()
        // .isLength({min:1,max:10}),
        await body('mobileNumber', 'Mobile must be number')
            .isNumeric().run(req)
        // .isLength({min:10,max:10}),
        await body('emailID', 'Invalid Email ID')
            .isEmail().run(req)
        await body('dob', 'DOB must be in DD-MM-YYYY format')
            .custom(helper.isValidDate).run(req)
        await body('idType', 'ID type must be number and with in 10 digits')
            .optional().run(req)
        // .custom((value,{req, loc, path}) => {
        //     if(req.body.idType == '' || req.body.idType == null) {
        //         return true
        //     }
        //     if(isNaN(req.body.idType)) {
        //         return false;
        //     }
        //     if(req.body.idType.length < 1 || req.body.idType.length >10) {
        //         return false
        //     }
        //     return true
        // }),
        await body('idNumber', 'ID Number required and with in 1 to 50 Characters')
            .optional().run(req)
        // .custom((value,{req, loc, path}) => {
        //     if(req.body.idNumber == '' || req.body.idNumber == null) {
        //         return true
        //     }
        //     // if(isNaN(req.body.idNumber)) {
        //     //     return false;
        //     // }
        //     if(req.body.idNumber.length < 3 || req.body.idNumber.length >50) {
        //         return false
        //     }
        //     return true
        // }),
        await body('userName', 'User Name Already Exist')
            .custom(isuserExist).run(req),
            await body('userName', 'User name must ber with in 5 to 100 Characters')
                .isLength({ min: 5, max: 100 }).run(req),
            await body('password', 'Password must be with in 5 to 50 Characters')
                .isLength({ min: 5, max: 50 }).run(req),
            await body('confirmPassword')
                .custom((value, { req, loc, path }) => {
                    if (value !== req.body.password) {
                        return false;
                    } else {
                        return value;
                    }
                }).withMessage('Mismatch in Password and Confirm Password')
                .run(req)
        await body('frontImage')
            .optional()
            .custom((value, { req, loc, path }) => {
                if (req.files) {
                    if (req.files.frontImage) {
                        let t_file = req.files.frontImage.mimetype;
                        t_file = t_file.split('/');
                        if (t_file[0] == 'image') {
                            return true;
                        }
                    }
                }
            }).withMessage('Front Image Required and Expected Image Format Only').run(req)
        await body('backImage')
            .optional()
            .custom((value, { req, loc, path }) => {
                if (req.files) {
                    if (req.files.backImage) {
                        let t_file = req.files.backImage.mimetype;
                        t_file = t_file.split('/');
                        if (t_file[0] !== 'image') {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }).withMessage('Back Image  Expected Image Format Only').run(req)
        await body('gender', 'Invalid Gender ID')
            .isNumeric()
            .isLength({ min: 1, max: 1 }).run(req)
    }
    else if (req.body.userType == 2 || req.body.userType == '2') {
        await body('Mode', 'Mode Required')
            .isInt({ min: 1, max: 3 })
            .run(req),
            await body('fullName', 'Full Name must be with in 5 to 100 Characters')
                .trim()
                .isLength({ min: 2, max: 100 })
                .run(req),
            await body('companyName', 'Company Name must be with in 5 to 100 Characters')
                .trim()
                .isLength({ min: 2, max: 100 })
                .run(req),
            await body('designation', 'Designation must be with in 5 to 100 Characters')
                .trim()
                .isLength({ min: 2, max: 100 })
                .run(req),
            await body('mobileNumber', 'Mobile must be number')
                .isNumeric()
                .run(req),
            await body('emailID', 'Invalid Email ID')
                .isEmail()
                .run(req),
            //body('idType','ID type must be number and with in 10 digits')
            // .optional(),
            // body('idNumber','ID Number required and with in 1 to 50 Characters')
            // .optional(),
            await body('userName', 'User Name Already Exist')
                .custom(isuserExist).run(req),
            await body('userName', 'User name must ber with in 5 to 100 Characters')
                .isLength({ min: 5, max: 100 }).run(req),
            await body('password', 'Password must be with in 5 to 50 Characters')
                .isLength({ min: 5, max: 50 }).run(req),
            await body('confirmPassword')
                .custom((value, { req, loc, path }) => {
                    if (value !== req.body.password) {
                        return false;
                    } else {
                        return value;
                    }
                }).withMessage('Mismatch in Password and Confirm Password').run(req)
    }
    else {
        let customError = {};
        let cusError = {};
        cusError.value = req.body.userType;
        cusError.msg = "User type invalid";
        cusError.param = "userType";
        cusError.location = "body";
        customError.errors = [cusError];
        customError.status = process.env.STATUS_TEMP_422;
        return res.status(process.env.STATUS_422).send(customError);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }

    let result = {};
    try {
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

        let isuserExist = await subscriberModel.userNameOrEmailExist(req.body.userName, req.body.emailID);
        if (!isuserExist.success || isuserExist.userExist) {
            let customError = {};
            let cusError = {};
            cusError.value = req.body.userName;
            cusError.msg = "User Name or Email Already Exists";
            cusError.param = "userName";
            cusError.location = "body";
            customError.errors = [cusError];
            customError.status = process.env.STATUS_TEMP_422;
            return res.status(process.env.STATUS_422).send(customError);
        }

        req.body.frontImageName = '';
        if (req.files && req.files.frontImage != null && typeof req.files.frontImage == 'object') {
            var file = req.files.frontImage;
            var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var imageName = random + file.name;
            var path = 'images/proof/' + imageName;
            req.body.frontImageName = path;
            file.mv(path, function (err) { });
        }
        req.body.backImageName = '';
        if (req.files && req.files.backImage != null && typeof req.files.backImage == 'object') {
            var file = req.files.backImage;
            var random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var imageName = random + file.name;
            var path = 'images/proof/' + imageName;
            req.body.backImageName = path;
            file.mv(path, function (err) { });
        }
        let mobileCheck = await subscriberModel.mobileCheck(req.body.mobileNumber);
        if (mobileCheck.mobileCheck && (mobileCheck.user && mobileCheck.user.status == '10')) {
            let customError = {};
            let cusError = {};
            cusError.msg = "Another user is currently using this number";
            customError.errors = [cusError];
            customError.status = process.env.STATUS_TEMP_422;
            return res.status(process.env.STATUS_422).send(customError);
        }

        let data4 = '';
        if (req.body.dob && (req.body.userType == 1 || req.body.userType == '1')) {
            let strDOB1 = req.body.dob.split('-');
            let newDOB1 = strDOB1[2] + '-' + strDOB1[1] + '-' + strDOB1[0];
            let data2 = new Date(newDOB1).getFullYear();
            let data3 = new Date(Date.now()).getFullYear();
            data4 = (data3 - data2) < 18;
        }

        if (!mobileCheck.mobileCheck && data4) {
            let mesobj = {};
            let strDOB = req.body.dob.split('-');
            let newDOB = '';
            let newDOBKey = '';
            if (strDOB) {
                newDOB = "'" + strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0] + "',";
                newDOBKey = 'date_of_birth,'
            }
            let gender = ""; let genderval = "";
            if (typeof req.body.gender != "undefined" && req.body.gender != "") {
                gender = ",gender";
                genderval = "," + req.body.gender;
            }
            let designation = ""; let designationval = "";
            if (typeof req.body.designation != "undefined" && req.body.designation != "") {
                designation = ",designation";
                designationval = ",'" + req.body.designation + "'";
            }
            let idType = ''; let idTypeVal = ''
            if (req.body.idType) {
                idType = ",proof_type";
                idTypeVal = `,${req.body.idType}`
            }
            let idNumber = ''; let idNumberVal = '', idNumber2 = '', idNumber2Val = '';
            if (req.body.idNumber) {
                idNumber = ",proof_number_sole";
                idNumberVal = `,'${req.body.idNumber.slice(0, 5)}'`;
                idNumber2 = ",proof_number_pair";
                idNumber2Val = `,'${req.body.idNumber.slice(5)}'`
            }
            let frontImageName = '', frontImageNameVal = ''
            if (req.body.frontImageName) {
                frontImageName = ',proof_copy_sole'
                frontImageNameVal = ",'" + req.body.frontImageName + "'"
            }
            let backImageName = '', backImageNameVal = ''
            if (req.body.backImageName) {
                backImageName = ',proof_copy_pair';
                backImageNameVal = ",'" + req.body.backImageName + "'"
            }

            let NewregisterStr = "INSERT INTO " + process.env.SCHEMA
                + ".subscriber (full_name,user_type,isd_code,mobile_number,email_id,username,password," + newDOBKey + "status" +
                gender + `${idType}${idNumber}${idNumber2}${frontImageName}${backImageName}`
                + ") values ('"
                + req.body.fullName + `','${req.body.userType}','` + req.body.isdCode + "'," + req.body.mobileNumber + ",'"
                + req.body.emailID + "','" + req.body.userName.toLowerCase() + "',MD5('"
                + req.body.password + "')," + newDOB
                + process.env.PARENTCHECK + genderval + `${idTypeVal}${idNumberVal}${idNumber2Val}
        ${frontImageNameVal}${backImageNameVal}`
                +
                ")";
            await db.query(NewregisterStr);
            let strID1 = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".subscriber','id'))";
            const subseqID = await db.query(strID1);
            mesobj.subscriberSeqID = subseqID.rows[0].currval;
            if (req.body.userType == 2 || req.body.userType == '2') {
                await db.query(`INSERT INTO company_profile(name,designation,subscriber_id,created_at) VALUES('${req.body.companyName}','${req.body.designation}',${mesobj.subscriberSeqID},NOW()) `)
            }
            const subID1 = await subscriberid(mesobj.subscriberSeqID);
            let subIDStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET subscriber_id=" + subID1 + " where id = " + mesobj.subscriberSeqID;
            await db.query(subIDStr);
            mesobj.subscriberID = subID1;
            const token = jwt.sign({
                username: req.body.username,
                id: mesobj.subscriberSeqID
            }, process.env.SECRET);
            mesobj.token = token;
            mesobj.fullName = req.body.fullName;
            mesobj.userName = req.body.userName;
            mesobj.emailID = req.body.emailID;
            mesobj.isdCode = req.body.isdCode;
            mesobj.mobileNumber = req.body.mobileNumber;
            mesobj.status = process.env.STATUS_200;
            mesobj.userStatus = process.env.PARENTCHECK;
            return res.status(process.env.STATUS_422).send(mesobj);
        }
        result = await subscriberModel.register(req);
        // If company register  ==> 2
        if (req.body.userType == '2') {
            result = await companyTypeuserStatus(result, req);
        } // If user register ==> 1
        else {
            result = await userStatus(result, req);
        }
        const token = jwt.sign({
            username: req.body.username,
            id: result.subscriberSeqID
        }, process.env.SECRET);
        result.token = token;
        result.fullName = req.body.fullName;
        result.userName = req.body.userName;
        result.emailID = req.body.emailID;
        result.isdCode = req.body.isdCode;
        result.mobileNumber = req.body.mobileNumber;
        result.status = process.env.STATUS_200;
        const reqData = {};
        reqData.ID = result.subscriberSeqID;
        reqData.deviceToken = req.body.deviceToken;
        reqData.Mode = req.body.Mode
        await commonModel.logSession(reqData);
        return res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        console.log(err)
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const isuserExist = async (val) => {
    const user = await subscriberModel.userNameOrEmailExist(val, '');
    if (!user.success || user.userExist) {
        return false;
    } else {
        return true;
    }
}

const companyTypeuserStatus = async (data, req, res) => {
    try {
        switch (data.userStatus) {
            case process.env.INITIALIZE:
                const isMobileExist = await subscriberModel.checkCompanyMobileDuplicate(req.body.mobileNumber);
                if (isMobileExist.isExist) {
                    await subscriberModel.updateUserStatus(data.subscriberSeqID, process.env.PARENTMOBILEAWAIT);
                    data.userStatus = process.env.PARENTMOBILEAWAIT;
                } else {
                    let otpNumber = Math.floor(1000 + Math.random() * 9000);
                    //let otpNumber = 1234;
                    let smsData = {};
                    smsData.message = `Welcome to Actio Sport. Please use this OTP to confirm request ${otpNumber} /ADIISHA`;
                    smsData.otpNumber = otpNumber
                    smsData.isdcode = req.body.isdCode;
                    smsData.number = req.body.mobileNumber;
                    smsData.mobileNumber = req.body.isdCode + req.body.mobileNumber;
                    smsData.subId = data.subscriberSeqID;
                    const otp = await subscriberModel.sendOtp(smsData);
                    await helper.sendSMS(smsData, (err, data) => {
                        if (err) {
                            console.log(eerr)
                        }
                        global.smsResponse = data;
                    });
                    await subscriberModel.updateUserStatus(smsData.subId, process.env.OTPAWAIT);
                    data.userStatus = process.env.OTPAWAIT;
                }
                break;
            default:
        }
    }
    catch (err) {
    }
    return data;
}

const userStatus = async (data, req, res) => {
    try {
        switch (data.userStatus) {
            case process.env.INITIALIZE:
                /* new registerd user : validate
                   - Exist Mobile & Min Age */
                const newUser = await subscriberModel.vaidatenewUser(data);
                if (newUser.user.min_age > newUser.user.age) // validate subsciber age based on country
                {
                    //  set status get parent id
                    await subscriberModel.updateUserStatus(newUser.user.id, process.env.PARENTAGEAWAIT);
                    data.userStatus = process.env.PARENTAGEAWAIT;
                } else if (newUser.user.o_number != null) {
                    // sms trigger to Exist subscriber , allow  mobile number use new subscriber
                    await subscriberModel.updateUserStatus(newUser.user.id, process.env.PARENTMOBILEAWAIT);
                    data.userStatus = process.env.PARENTMOBILEAWAIT;
                } else {
                    let otpNumber = Math.floor(1000 + Math.random() * 9000);
                    let smsData = {};
                    smsData.message = `Welcome to Actio Sport. Please use this OTP to confirm request ${otpNumber} /ADIISHA`;
                    smsData.otpNumber = otpNumber
                    smsData.isdcode = req.body.isdCode;
                    smsData.number = req.body.mobileNumber;
                    smsData.mobileNumber = req.body.isdCode + req.body.mobileNumber;
                    smsData.subId = data.subscriberSeqID;
                    const otp = await subscriberModel.sendOtp(smsData);
                    await helper.sendSMS(smsData, (err, data) => {
                        if (err) {
                            console.log(eerr)
                        }
                        global.smsResponse = data;
                    });
                    await subscriberModel.updateUserStatus(smsData.subId, process.env.OTPAWAIT);
                    data.userStatus = process.env.OTPAWAIT;
                }
                break;
            default:
                break;
        }
    } catch (err) {
    }
    return data;
}

const parentIDsubmit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        // validate parent active status.
        const parent = await subscriberModel.isParentByID(req.body.parentID);
        let notification = {};
        notification.from = req.myID;
        notification.message = {};
        notification.message.msg = Notifylog.msg.parent_submit;
        notification.message.icon = Notifylog.icon.parent_submit;
        notification.message.type = 'parent_submit';
        if (parent.user && parent.user.allow == '1') {
            let NewStauts = '';
            let smsData = {};
            notification.to = parent.user.id;
            if (req.body.Mode == 1) {
                result.isValid = true;
                NewStauts = process.env.AGEAWAIT;
                //smsData.message    = 'Child Requested for Parent Verification';
                smsData.message = `Please confirm Subscriber's request to add this mobile as contact number. url: https://actiosport.com/x?c=${req.myID}&p=${parent.user.id} /ADIISHA`;
                await notificationmodel.create(notification, req);
            } else {
                const childUser = await subscriberModel.getUserbyID(req.myID);
                if (parent.user.mobile_number == childUser.user.mobile_number && parent.user.isd_code == childUser.user.isd_code) {
                    result.isValid = true;
                    NewStauts = process.env.MOBILEAWAIT;
                    //smsData.message    = 'Mobile Await for Parent Verification';
                    smsData.message = `Please confirm Subscriber's request to add this mobile as contact number. url: https://actiosport.com/x?c=${req.myID}&p=${parent.user.id} /ADIISHA`;
                    await notificationmodel.create(notification, req);
                } else {
                    result.isValid = false;
                    result.msg = 'Requested Parent Was not belong same Mobile number';
                }
            }

            if (result.isValid) {
                smsData.mobileNumber = parent.user.isd_code + parent.user.mobile_number;
                await helper.sendSMS(smsData, (err, data) => {
                    global.smsResponse = data;
                });
                let appData = {};
                appData.parentId = parent.user.id;
                appData.childId = req.myID;
                await subscriberModel.approvalRequest(appData);
                await subscriberModel.updateUserStatus(req.myID, NewStauts);
                result.userStatus = NewStauts;
            }
            result.status = process.env.STATUS_200;
        } else {
            result.isValid = false;
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'Requested Subscriber Was not a Parent / Active subscriber';
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const parentApprovalInit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        const request = await subscriberModel.isValidApproval(req);
        if (request.request) {
            const child = await subscriberModel.getUserbyID(req.body.childID);
            if (child.user && (child.user.status == process.env.AGEAWAIT || child.user.status == process.env.MOBILEAWAIT)) {
                const relation = await commonModel.relation();
                result.status = process.env.STATUS_200;
                result.relation = relation.relation;
                result.isValid = true;
                result.name = child.user.full_name;
                result.dob = child.user.dob;
                result.mobile = child.user.mobile_number;
                result.childuserStatus = child.user.status;
            } else {
                result.status = process.env.STATUS_TEMP_422;
                result.isValid = false;
                result.msg = 'No Current Request From Subscriber';
            }
        } else {
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'No active Request';
            result.isValid = false;
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const parentApproval = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    if (req.body.Status == 1 && (req.body.relationID == undefined || req.body.relationID == '')) {
        let customError = {};
        let cusError = {};
        cusError.value = req.body.relationID;
        cusError.msg = "Relation ID Can't be empty";
        cusError.param = "relationID";
        cusError.location = "body";
        customError.errors = [cusError];
        customError.status = process.env.STATUS_TEMP_422;
        return res.status(process.env.STATUS_422).send(customError);
    }

    let result = {};
    try {
        const request = await subscriberModel.isValidApproval(req);
        let notification = {};
        notification.from = req.myID;
        notification.to = req.body.childID;
        notification.message = {};
        if (request.request) {
            result.isValid = true;
            //const fcmData = {};
            if (req.body.Status == 1) {
                notification.message.msg = Notifylog.msg.parent_approve;
                notification.message.icon = Notifylog.icon.parent_approve;
                notification.message.type = 'parent_approve';
                //fcmData.Message = 'Request has been approved by parent';
                if (req.body.Mode == 1 || req.body.Mode == 2) {
                    let updateData = {};
                    updateData.reqID = request.request.id;
                    updateData.relationID = req.body.relationID;
                    updateData.mobile_allow = null;
                    await subscriberModel.updateRelationship(updateData);
                    let ids = await db.query("SELECT * FROM subscriber WHERE id IN (" + req.myID + ", " + req.body.childID + ");");
                    let numberSame = false;
                    if (ids.rowCount == 2) {
                        if (ids.rows[0].mobile_number == ids.rows[1].mobile_number) {
                            numberSame = true;
                        }
                    }
                    if (!numberSame) {
                        await subscriberModel.updateUserStatus(request.request.child_id, process.env.OTPAWAIT);
                        result.userStatus = process.env.OTPAWAIT;
                        //fcmData.userStatus = process.env.OTPAWAIT;
                        notification.message.userStatus = process.env.OTPAWAIT;
                        const user = await subscriberModel.getUserbyID(request.request.child_id);
                        let otpNumber = Math.floor(1000 + Math.random() * 9000);
                        let smsData = {};
                        smsData.message = `Welcome to Actio Sport. Please use this OTP to confirm request ${otpNumber} /ADIISHA`;
                        smsData.otpNumber = otpNumber
                        smsData.isdcode = user.user.isd_code;
                        smsData.number = user.user.mobile_number;
                        smsData.mobileNumber = user.user.isd_code + user.user.mobile_number;
                        smsData.subId = user.user.id;
                        await subscriberModel.sendOtp(smsData);
                        await helper.sendSMS(smsData, (err, data) => {
                            global.smsResponse = data;
                        });
                    }
                    else {
                        await subscriberModel.updateUserStatus(request.request.child_id, process.env.ACTIVE);
                        result.userStatus = process.env.ACTIVE;
                        //fcmData.userStatus = process.env.OTPAWAIT;
                        notification.message.userStatus = process.env.ACTIVE;
                    }
                } else {
                    let updateData = {};
                    updateData.reqID = request.request.id;
                    updateData.relationID = req.body.relationID;
                    updateData.mobile_allow = 1;
                    await subscriberModel.updateRelationship(updateData);
                    await subscriberModel.updateUserStatus(request.request.child_id, process.env.ACTIVE);
                    result.userStatus = process.env.ACTIVE;
                    //fcmData.userStatus = process.env.ACTIVE;
                    notification.message.userStatus = process.env.ACTIVE;
                    const childDet = await subscriberModel.getUserbyID(request.request.child_id)
                    const maildata = {};
                    maildata.To = childDet.user.email_id;
                    maildata.Content = 'Welcome to actio , your subscriber id :' + childDet.user.subscriber_id + ', User Name :' + childDet.user.username;
                    maildata.Subject = 'Welcome ' + childDet.user.full_name;
                    await helper.sendMail(maildata);
                }
            } else {
                await subscriberModel.updateUserStatus(request.request.child_id, process.env.REJECTAWAIT);
                result.userStatus = process.env.REJECTAWAIT;
                //fcmData.Message = 'Request has been rejected by parent';
                //fcmData.userStatus = process.env.REJECTAWAIT;
                notification.message.userStatus = process.env.REJECTAWAIT;
                // notification insert 
                notification.message.msg = Notifylog.msg.parent_reject;
                notification.message.icon = Notifylog.icon.parent_reject;
                notification.message.type = 'parent_reject';
            }
            const otp = await subscriberModel.sendOtp(smsData);
            await notificationmodel.create(notification, req);
            /*  
             
            const fToken = await commonModel.getfcmTokenbyID(request.request.child_id);
             if(fToken.status)
             {
                 const fcmToken = [];
                 fToken.fcmToken.forEach(e => {
                     fcmToken.push(e.device_token);
                 });
                 fcmData.fcmToken=fcmToken;
                 fcmData.type = process.env.FCM_VERIFY;
                 await helper.fcmAndroid(fcmData);
             } 
             
             */
        } else {
            return res.status(process.env.STATUS_200).send(userstatuschange);
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const userstatusInfo = async (req, res) => {
    try {
        const result = {};
        const user = await subscriberModel.getUserbyID(req.myID);
        let parent = '';
        if (user.user) {
            switch (user.user.status) {
                case process.env.PARENTAGEAWAIT:
                    parent = await subscriberModel.parentMobileUser(req.myID);
                    result.status = process.env.STATUS_200;
                    if (parent.user) {
                        result.parentName = parent.user.full_name;
                        result.parentIsd = parent.user.isd_code;
                        result.parentMobile = parent.user.mobile_number;
                    }
                    break;
                case process.env.PARENTMOBILEAWAIT:
                    parent = await subscriberModel.parentMobileUser(req.myID);
                    if (parent.user) {
                        result.status = process.env.STATUS_200;
                        result.parentName = parent.user.full_name;
                        result.parentIsd = parent.user.isd_code;
                        result.parentMobile = parent.user.mobile_number;
                    } else {
                        result.status = process.env.STATUS_TEMP_422;
                        result.msg = 'No Parent';
                    }
                    break;
                case process.env.AGEAWAIT:
                case process.env.MOBILEAWAIT:
                    const parentR = await subscriberModel.requestParentUser(req.myID);
                    if (parentR.user) {
                        result.status = process.env.STATUS_200;
                        result.parentName = parentR.user.full_name;
                        result.parentIsd = parentR.user.isd_code;
                        result.parentMobile = parentR.user.mobile_number;
                    } else {
                        result.status = process.env.STATUS_TEMP_422;
                        result.msg = 'No Parent';
                    }
                    break;
                default:
                    result.status = process.env.STATUS_200;
                    result.parentName = "";
                    result.parentIsd = "";
                    result.parentMobile = "";
                    break;
            }
            result.currentUserStatus = user.user.status;
        } else {
            result.status = process.env.STATUS_TEMP_422;
            result.msg = 'Invalid User Details';
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const getbyID = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = {};
    try {
        const subscriber = await subscriberModel.getUserbySubID(req.body.id);
        if (subscriber.user && subscriber.user.status == 1) {
            result.status = process.env.STATUS_200;
            result.user = subscriber.user;
        } else {
            result.status = process.env.STATUS_TEMP_422;
            result.status = 'Invalid Subscriber ID';
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const list = async (req, res) => {
    try {

      console.log("tttttttttttttttnnnnnnnnnnnnnnn");
      //console.log(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("sdffffffffffffff");
            console.log(errors);
            await commonModel.activityLog(log.invalidProfilelist.id, log.invalidProfilelist.value, req);
            return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invalidProfilelist.id, errors: errors.array() });
        }
        let menuid = req.get('menuID');
        const menuPermission = await commonModel.menuPermission(req.myID, menuid);
        // if (!menuPermission) {
        //     console.log('menu...............');
        //     await commonModel.activityLog(log.menu.id, log.menu.value, req);
        //     let result = {};
        //     result.status = process.env.STATUS_401;
        //     result.logID = log.menu.id;
        //     result.msg = log.menu.msg;
        //     res.status(result.status).send(result);
        //     return false;
        // }
        const result = {};
        console.log("tttttttttttttttnnnnnnnnnnnnnnn");
        const list = await subscriberModel.list(req);

        
        await commonModel.activityLog(log.subscriber.id, log.subscriber.value, req);
        result.status = process.env.STATUS_200;
        result.logID = log.subscriber.id;
        result.list = list;
        if (req.body.master) {
            const master = await subscriberModel.listMaster(req);
            result.master = master;
        }
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SS500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const profile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.invalidProfile.id, log.invalidProfile.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invalidProfile.id, errors: errors.array() });
    }
    try {
        const result = {};
        const subscriber = await subscriberModel.profile(req.body.subscriberID);
        const profile = await profileModel.getprofile(req.body.subscriberID);
        const event = await profileModel.eventAssociated(req.body.subscriberID);
        const parentDetails = await profileModel.checkParent(subscriber.mobile_number, req.body.subscriberID);
        await commonModel.activityLog(log.subscriberProfile.id, log.subscriberProfile.value, req);
        result.status = process.env.STATUS_200;
        result.logID = log.subscriberProfile.id;
        result.subscriber = subscriber;
        result.profile = profile;
        result.event_associated = event;
        result.parentDetails = parentDetails;
        res.status(process.env.STATUS_200).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SS500.msg;
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const subscriberEdit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        await commonModel.activityLog(log.invalideditSubscriber.id, log.invalideditSubscriber.value, req);
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, logID: log.invalideditSubscriber.id, errors: errors.array() });
    }
    try {
        let path = 'images/proof/';
        if (typeof (req.body.frontImage) != "undefined" && req.body.frontImage != "") {
            const frontImageName = helper.uploadBase64(req.body.frontImage, path);
            req.body.frontImageName = frontImageName.path;
        }

        if (typeof (req.body.backImage) != "undefined" && req.body.backImage != "") {
            const backImageName = helper.uploadBase64(req.body.backImage, path);
            req.body.backImageName = backImageName.path;
        }
        path = 'images/profile/';

        if (typeof (req.body.profileImage) != "undefined" && req.body.profileImage != "") {
            const displayPictureName = helper.uploadBase64(req.body.profileImage, path);
            req.body.displayPictureName = displayPictureName.path;
        }
        await subscriberModel.editSubscriber(req);
        const result = {};
        result.status = process.env.STATUS_200;
        result.logID = log.editSubscriber.id;
        result.msg = log.editSubscriber.update;
        await commonModel.activityLog(log.editSubscriber.id, log.editSubscriber.value, req);
        res.status(result.status).send(result);
    } catch (err) {
        await commonModel.activityLog(log.SS500.id, err, req);
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = log.SS500.msg;
        res.status(error.status).send({ status: error.status, logID: log.SS500.id, msg: error.message });
    }
}

const getByIds = async (req, res) => {
    try {
        let data = await subscriberModel.getByIds(req);
        return res.status(process.env.STATUS_200).send({
            status: 200,
            result: data
        })
    }
    catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(200).send({ status: error.status, msg: error.message });
    }
}

const parentCheck = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let result = {};
    try {
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
        let userstatuschange = {};
        let NewregisterStr = "INSERT INTO " + process.env.SCHEMA + ".under_age (subscriber_id,relationship_id,relationship_full_name,created_at) values (" + req.myID + ", " + req.body.relationID + ",'" + req.body.fullName + "',now())";
        await db.query(NewregisterStr);

        let UpdateregisterStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET status=" + process.env.OTPAWAIT + ", updated_at=now() WHERE id=" + req.myID + "";
        await db.query(UpdateregisterStr);

        let mobileno = `SELECT mobile_number,isd_code FROM ${process.env.SCHEMA}.subscriber WHERE id=${req.myID};`
        let mobile = await db.query(mobileno);
        if (mobile.rowCount) {
            let otpNumber = Math.floor(1000 + Math.random() * 9000);
            let smsData = {};
            smsData.message = `Welcome to Actio Sport. Please use this OTP to confirm request ${otpNumber} /ADIISHA`;
            smsData.otpNumber = otpNumber;
            smsData.mobileNumber = mobile.rows[0].isd_code + mobile.rows[0].mobile_number;
            smsData.number = mobile.rows[0].mobile_number;
            smsData.isdcode = mobile.rows[0].isd_code;
            smsData.subId = req.myID;
            await subscriberModel.sendOtp(smsData);
            await helper.sendSMS(smsData, (err, data) => {
                if (err) {
                }
                global.smsResponse = data;
            });
            userstatuschange.userStatus = process.env.OTPAWAIT;
            userstatuschange.status = '200'
            return res.status(process.env.STATUS_200).send(userstatuschange);
        }
    } catch (err) {
        console.log(err)
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = 'Something Went Wrong';
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const subscriberid = async (seqid) => {
    let text = "000000000";
    let limit = text.length - seqid.toString().length;
    text = text.substring(0, limit) + seqid;
    let digits = text.split('');
    let i = 0;
    let digit = 0;
    digits.forEach(val => {
        i++;
        switch (i) {
            case 1:
            case 4:
            case 7:
                digit += (val * 1);
                break;
            case 2:
            case 5:
            case 8:
                digit += (val * 3);
                break;
            case 3:
            case 6:
            case 9:
                digit += (val * 7);
                break;
        }
    });
    while (digit > 9) {
        let n_text = "000";
        let n_limit = n_text.length - digit.toString().length;
        n_text = n_text.substring(0, n_limit) + digit.toString();
        digits = n_text.split('');
        digit = 0;
        digits.forEach(val => {
            digit += +val;
        });
    }
    return seqid.toString() + digit.toString();
}

module.exports = {
    parentCheck, init, register, isuserExist, userStatus, parentIDsubmit, parentApprovalInit, parentApproval,
    userstatusInfo, getbyID, list, profile, subscriberEdit, getByIds
}