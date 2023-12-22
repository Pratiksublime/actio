const { validationResult } = require('express-validator');
const commonModel = require('../../model/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const subSportsModel = require('../../model/admin/sub_sports');


const insert = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await subSportsModel.insert(req);
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
        const bannerWesbite = await subSportsModel.update(req);
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
        const bannerWesbite = await subSportsModel.list(req);
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

const subsport_list = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await subSportsModel.sub_sports_list(req);
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
        const bannerWesbite = await subSportsModel.info(req);
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

const listBySportId = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await subSportsModel.listBySportId(req);
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

const deletedata = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await subSportsModel.deletedata(req);
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


module.exports = { insert, update, list, info, listBySportId ,subsport_list,deletedata}