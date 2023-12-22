const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const stacrModel = require('../../model/admin/sportStarts');
//const commonModel = require('../../model/common');



const sportStart = async (req, res) => {
    try {
       
        const result = {};
        const adWebsite = await stacrModel.insert(req);
       
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


const getlist = async (req, res) => {
    let result = await stacrModel.list(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_statastic: result
    });
}

const updatedata = async (req, res) => {
    try {
       
        const result = {};
        const adWebsite = await stacrModel.update(req);
       
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
const getinfo = async (req, res) => {
    let result = await stacrModel.info(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_statastic: result
    });
}

const deleteinfo = async (req, res) => {
    let result = await stacrModel.Delete(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_statastic: result
    });
}

const listByID = async (req, res) => {
    let result = await stacrModel.listByID(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        my_statastic: result
    });
}


module.exports = { sportStart,getlist,updatedata,getinfo ,deleteinfo, listByID}