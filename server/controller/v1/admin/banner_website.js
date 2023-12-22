const { validationResult } = require('express-validator');
const commonModel = require('../../../model/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const bannerWebsiteModel = require('../../../model/admin/banner_website');


const insert = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await bannerWebsiteModel.insert(req);
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
        const bannerWesbite = await bannerWebsiteModel.update(req);
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
        const bannerWesbite = await bannerWebsiteModel.list(req);
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
    console.log("banner website controller info")
    try {
        const result = {};
        const bannerWesbite = await bannerWebsiteModel.info(req);
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

const deletedata = async (req, res) => {
    try {
        const result = {};
        const bannerWesbite = await bannerWebsiteModel.deletedata(req);
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


module.exports = { insert, update, list, info ,deletedata}