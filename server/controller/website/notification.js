const { validationResult } = require('express-validator');
const commonModel = require('../../model/v1/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const notificationMod = require('../../model/v1/website/notification');

//const commonModel = require('../../model/common');








const requestnotification = async (req, res) => {
    let result = await notificationMod.requestnotification(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    result
    res.status(process.env.STATUS_200).send({
        //status: process.env.STATUS_200,
        result
        //data: result
    });


 //    try {
 //        const result = {};
 //        const Wesbite = await notificationMod.requestnotification(req);
 //       result.status = process.env.STATUS_200;
 //        result.message = 'data added successfully ...';
 //        res.status(result.status).send(result);
 //    } catch (err) {
 //        const error = {};
 //        error.status = process.env.STATUS_500;
 //        error.message = "something wen't wrong...!!"
 //        res.status(error.status).send({ status: error.status, msg: error.message });
	// }
}

const list = async (req, res) => {
    let result = await notificationMod.list(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    result
    res.status(process.env.STATUS_200).send({
        //status: process.env.STATUS_200,
        result
        //data: result
    });


 
}




module.exports = { requestnotification,list }