const { validationResult } = require('express-validator');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const commonModel = require('../../model/v1/website/callbackRequest');
const List = async (req, res) => {
    
    const result = {};
    try {
        const number = await commonModel.list(req);
        
        //if(userOTP.otp && "1234" == req.body.otp)
        if (number) {
            
            result.isValid = true;
            result.status = process.env.STATUS_200; 
            result.msg = 'Success';
            
            const maildata = {};
            maildata.To = "contactus@actiosport.com";
            maildata.Content = 'Please give me a phone call when available: Mobile Number:'+ number;
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


module.exports = { List };