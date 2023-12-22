const { validationResult, Result } = require('express-validator');
const tournamentModel = require('../model/v1/tournament');
const helper = require('../helper/helper');

const list = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let list;
    list = await tournamentModel.list(req);
    if (typeof list === 'object' && list.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: list.error })
    }
    if (list.favorites) {
        list.favorites = helper.convertFalsytoEmptyString(list.favorites);
    }
    if (list.nearMe) {
        list.nearMe = helper.convertFalsytoEmptyString(list.nearMe);
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        list: list
    });
}

const search = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    let tournament = await tournamentModel.search(req);
    if (typeof tournament === 'object' && tournament.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: tournament.error })
    }
    if (tournament) {
        tournament = helper.convertFalsytoEmptyString(tournament);
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        tournament: tournament
    });
}

const organizer = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const organizer = await tournamentModel.organizer(req);
    res.status(process.env.STATUS_200).send({
        status: (!organizer || Object.keys(organizer).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        tournament: organizer
    });
}

const eventCategory = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const eventCategory = await tournamentModel.eventCategory(req);
    if (typeof eventCategory === 'object' && eventCategory.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: eventCategory.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        eventCategory: eventCategory
    });
}

const prize = async (req, res) => {
}

const location = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const location = await tournamentModel.location(req);
    res.status(process.env.STATUS_200).send({
        status: (!location || Object.keys(location).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        location: location
    });
}

const affliation = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const affliation = await tournamentModel.affliation(req);
    res.status(process.env.STATUS_200).send({
        status: (!affliation || Object.keys(affliation).length === 0) ? process.env.STATUS_TEMP_422 : process.env.STATUS_200,
        affliation: affliation
    });
}

const event = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const event = await tournamentModel.event(req);
    if (typeof event === 'object' && event.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: event.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        event: event
    });
}

const eventMatches = async (req, res) => {
}

const eventReviews = async (req, res) => {
}

const updateTournament = async (req, res) => {
    // input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(process.env.STATUS_422).send({ status: process.env.STATUS_TEMP_422, errors: errors.array() });
    }
    const update = await tournamentModel.updateTournament(req);
    if (typeof update === 'object' && update.serverError) {
        return res.status(process.env.STATUS_TEMP_422).send({ error_type: 'Server Error', error_message: update.error })
    }
    res.status(process.env.STATUS_200).send({
        status: process.env.STATUS_200,
        message: 'Update successfull',
        list: update.list
    });
}

const deletedata = async (req, res) => {
    try {
        const result = {};
        const deletetournament = await tournamentModel.deletedata(req);
        result.status = process.env.STATUS_200;
        result.data = deletetournament;
        res.status(result.status).send(result);
    } catch (err) {
        const error = {};
        error.status = process.env.STATUS_500;
        error.message = "something wen't wrong...!!"
        res.status(error.status).send({ status: error.status, msg: error.message });
    }
}

module.exports = { updateTournament, list, search, organizer, eventCategory, prize, location, affliation, event, eventMatches, eventReviews ,deletedata}