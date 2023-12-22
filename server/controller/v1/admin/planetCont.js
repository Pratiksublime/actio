const { validationResult } = require('express-validator');
const commonModel = require('../../../model/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const planetModel = require('../../../model/admin/planetModel');

const insert = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await planetModel.insert(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
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
        const bannerWesbite = await planetModel.list(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
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
        const bannerWesbite = await planetModel.update(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
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
        const bannerWesbite = await planetModel.info(req);
        result.status = process.env.STATUS_200;
        result.data = bannerWesbite;
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
        const Wesbite = await planetModel.Delete(req);
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





module.exports = { insert,list,update,info,Delete}