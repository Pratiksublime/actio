const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const Model = require('../../../model/v1/website/master_permission');




const List = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.list(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

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
const Add = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.insert(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

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

const Addsubmenu = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.submenu(req);

        console.log("Wesbite: ");
        console.log(Wesbite);
        console.log(typeof Wesbite);

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

const Submenulist = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.submenulist(req);

        
        console.log(typeof Wesbite);

        result.status = process.env.STATUS_200;
        result.message = "successfully";
        result.data = Wesbite;
        res.status(result.status,result.message).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}


const Addrole = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.role(req);

        
        console.log(typeof Wesbite);

        result.status = process.env.STATUS_200;
        result.message = "successfully";
        result.data = Wesbite;
        res.status(result.status,result.message).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

const Rolelistbyid = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await Model.rolelistbyid(req);

        
        console.log(typeof Wesbite);

        result.status = process.env.STATUS_200;
        result.message = "successfully";
        result.data = Wesbite;
        res.status(result.status,result.message).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}












module.exports = { List ,Add,Addsubmenu,Submenulist ,Addrole,Rolelistbyid}