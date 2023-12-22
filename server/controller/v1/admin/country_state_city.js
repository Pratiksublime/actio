const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Model = require('../../../model/admin/country_city_state');
//const commonModel = require('../../model/common');



const add = async (req, res) => {
    try {

        console.log('demo');
        const result = {};
        const adminsit = await Model.add(req);
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


module.exports = { add }