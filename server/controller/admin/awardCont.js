const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const awardModel = require('../../model/admin/awardMod');
//const commonModel = require('../../model/common');



const updateAward = async (req, res) => {
    try {

        console.log('demo');
        const result = {};
        const adminsit = await awardModel.updateAward(req);
        result.status = process.env.STATUS_200;
        result.data = adminsit;
        result.message = "Successfully...!!";
        res.status(result.status).send(result);

    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const getMyAward = async (req, res) => {
    console.log(req)
    let result = await awardModel.getMyAward(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        awards: result
    });
}

const getAward = async (req, res) => {
    console.log(req)
    let result = await awardModel.getAward(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        awards: result
    });
}

const Deleteaward = async (req, res) => {
    console.log(req)
    let result = await awardModel.Deleteaward(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        awards: result
    });
}



module.exports = { updateAward,getMyAward,getAward,Deleteaward }