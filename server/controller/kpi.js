const kpiModel = require('../model/kpi');
const { validationResult } = require('express-validator');

const actioKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.actioKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        event: result
    })
}

const insertActioKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.insertActioKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully submitted KPI !'
    })
}

const nonActioKPI1 = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.nonActioKPI1();
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    })
}

const registerNonActioEvents = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.registerNonActioEvents(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully registered !'
    })
}

const nonActioFilterKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.nonActioFilterKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    })
}

const registerNonActioEventsKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.registerNonActioEventsKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully submitted KPI !'
    })
}

const performanceReview = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.performanceReview(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        list: result
    })
}

const performanceReviewerList = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.performanceReviewerList(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        list: result
    })
}

const performanceCoachReviewList = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.performanceCoachReviewList(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    })
}

const updateKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.updateKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Successfully Updated'
    })
}

const getEventKPIForCoach = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.getEventKPIForCoach(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        result: result
    })
}

const coachReviewKPI = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const result = await kpiModel.coachReviewKPI(req);
    if (typeof result === 'object' && result.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: result.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        msg: 'Thanks for validating !'
    })
}

module.exports = {
    coachReviewKPI, getEventKPIForCoach, updateKPI, performanceCoachReviewList, performanceReviewerList,
    performanceReview, actioKPI, insertActioKPI, nonActioKPI1, registerNonActioEvents, nonActioFilterKPI, registerNonActioEventsKPI
};