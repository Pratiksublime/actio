const { validationResult } = require('express-validator');
const commonModel = require('../../model/v1/common');
const helper = require('../../helper/helper');
const log = require('../../helper/config.json').log.master;
const model = require('../../model/v1/website/registerModel/stud_registation');


const add = async (req, res) => {
    try {
        const result = {};
        const Wesbite = await model.add(req);
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


module.exports = { add };
