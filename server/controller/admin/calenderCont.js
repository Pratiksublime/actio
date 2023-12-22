const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const calenderMod = require('../../model/admin/calenderMod');
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