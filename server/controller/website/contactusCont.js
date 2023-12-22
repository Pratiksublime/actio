const { validationResult } = require('express-validator');
const commonModel = require('../../model/v1/common');
const subscriberModel = require('../../model/v1/subscriber');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const jwt = require('jsonwebtoken');

const Model = require('../../model/v1/website/contactus');


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
        console.log('HHHHHHHHHHHHHHHHHH');
        const Wesbite = await Model.Insert(req);
        
        //if(userOTP.otp && "1234" == req.body.otp)
        if (Wesbite) {
            
            result.isValid = true;
            result.status = process.env.STATUS_200; 
            result.msg = 'Success';
            
            const maildata = {};
            maildata.To = Wesbite.email_id;
            maildata.Content = 'Please give me a phone call when available: Mobile Number:';
            maildata.Subject = 'Call Back Request ';
            

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
        const user = await Model.createprofile(req);
        
        console.log('user----------------------------------------------------------------------------------')
        console.log(user)
        if (user.user) {

        
            const token = jwt.sign({
                //username: req.body.email_id,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'data added successfully.....';
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
            result.msg = 'Invalid Login';
        }
        res.status(process.env.STATUS_200).send(result);  


        // result.status = process.env.STATUS_200;
        // result.message = 'data added successfully.....';
        // result.data = Wesbite;
        // res.status(result.status).send(result);
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
               
            }, process.env.SECRET,{ expiresIn: '7d'} );
 
           const user = await Model.shearlinkToken(req,token);     
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
       
        jwt.verify(token,SECRET, function(err, decoded) {
        
        if (err) {
            name = 'TokenExpiredError';  
            message = 'jwt token expired';
            res.status(401).send({ msg: message,status:1});   
            
           }

           else {

                message = 'valid token'; 
                res.status(200).send({ msg: message,status:0 }); 
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
		maildata.Content = 'OTP <br> for login:'+otpNumber; 
        maildata.Subject = 'OTP';
            
		await helper.sendMailweb(maildata);
		await Model.sendOtp(smsData);
        await helper.sendSMS(smsData, (err, data) => { 
			 global.smsResponse = data;
        });
            


        result.status = process.env.STATUS_200;
        result.exist = 1; 
        if(typeof user.mobile_number!=='undefined' ){
        result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;  
    }
    else{
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
        res.status(error.status).send({ status: error.status, msg: error.message ,exist:error.exist});
    }
}

const sendmobileOTPdata = async (req, res, user) => {
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
        maildata.Content = 'OTP for login:'+otpNumber; 
        maildata.Subject = 'OTP';
            
        //await helper.sendMailweb(maildata);
        await Model.sendwithMobileOtp(smsData);
         await helper.sendSMS(smsData, (err, data) => { 
              global.smsResponse = data;
         });
            


        result.status = process.env.STATUS_200;
        result.exist = 1; 
        if(typeof user.mobile_number!=='undefined' ){
        result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;  
    }
    else{
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
        res.status(error.status).send({ status: error.status, msg: error.message ,exist:error.exist});
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
        maildata.Content = 'OTP for login:'+otpNumber; 
        
        maildata.Subject = 'OTP';
            
        await helper.sendMailweb(maildata);
        await Model.sendwithemailOtp(smsData);
        // await helper.sendSMS(smsData, (err, data) => { 
        //      global.smsResponse = data;
        // });
            


        result.status = process.env.STATUS_200;
        result.exist = 1; 
        if(typeof user.mobile_number!=='undefined' ){
        result.msg = `OTP password has been sent to ${user.mobile_number} mobile number and email_id`;  
    }
    else{
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
        res.status(error.status).send({ status: error.status, msg: error.message ,exist:error.exist});
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
            result.msg = 'Login Success';
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
};

const validotpwithMobile = async (req, res) => { 
    const result = {};
    

    try {
     
        const user = await Model.validmobileotp(req); 
         console.log("hhhhpppp------------");
        console.log(user);
        if (user.user) {

        
            const token = jwt.sign({
                //username: req.body.email_id,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'Login Success';
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
};


const validotpwithemail = async (req, res) => { 
    const result = {};
    try {
        const user = await Model.validemailotp(req); 
        console.log("hhhhpppp------------");
        console.log(user);
        if (user.user) {

        
            const token = jwt.sign({
                //username: req.body.email_id,
                id: user.user.id
            }, process.env.SECRET);
            result.status = process.env.STATUS_200;
            result.msg = 'Login Success';
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
};








module.exports = { Insert ,login,mobilelogin,forgotPasswordOTP,logimobileotp,createaccountInsert,createprofile,shearlinkToken,shearlinkTokenexpired,Sendmobileotpformobile,Sendemailotp,validotpwithMobile,validotpwithemail};