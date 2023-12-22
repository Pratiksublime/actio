const { validationResult } = require('express-validator');
const commonModel = require('../../../model/v1/common');
const helper = require('../../../helper/helper');
const log = require('../../../helper/config.json').log.master;
const calenderMod = require('../../../model/v1/website/calendar');

//const commonModel = require('../../model/common');






const getCalender = async (req, res) => {
    console.log(req)
    let result = await calenderMod.getCalender(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_200).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        getCalender: result
    });
}




module.exports = { getCalender }