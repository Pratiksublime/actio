const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const trainingMod = require('../../../model/v1/admin/trainingMod');

const insert = async (req, res) => {
    try { 
        const result = {};
        const trainingInfo = await trainingMod.insert(req);
        result.status = process.env.STATUS_200;
        result.data = trainingInfo;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const list = async (req, res) => {
    try {
        const result = {};
        const trainingInfo = await trainingMod.list(req);
        result.status = process.env.STATUS_200;
        result.data = trainingInfo;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const update = async (req, res) => {
    try {
        const result = {};
        const trainingInfo = await trainingMod.update(req);
        result.status = process.env.STATUS_200;
        result.data = trainingInfo;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const info = async (req, res) => {
    try {
        const result = {};
        const trainingInfo = await trainingMod.info(req);
        result.status = process.env.STATUS_200;
        result.data = trainingInfo;
        res.status(result.status).send(result);
    } catch (err) {
        console.log("err: ");
        console.log(err);

        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const Delete = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await trainingMod.Delete(req);
        result.status = process.env.STATUS_200;
        result.data = Wesbite;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}



module.exports = { insert,list,update,info,Delete }