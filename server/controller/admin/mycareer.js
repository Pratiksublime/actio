const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const careerModel = require('../../model/admin/mycareer');
//const commonModel = require('../../model/common');



const updateMycareer = async (req, res) => {
    try {
        /*console.log('req...........')
        console.log(req)*/
        const result = {};
        const adWebsite = await careerModel.updateMycareer(req);
       
        result.status = process.env.STATUS_200;
        result.data = adWebsite;
        
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const getMycareer = async (req, res) => {
    let result = await careerModel.getMycareer(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_career: result
    });
}




module.exports = { updateMycareer,getMycareer }