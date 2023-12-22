const calendarModel = require('../model/calendar.model');

const getCalendarInformation = async (req, res) => {
    try {
        let result = await calendarModel.GetCalendarInformation(req);
        return res.status(process.env.STATUS_200).send({ status: process.env.STATUS_200, result: result });
    } catch (error) {
        console.log(error);
    }
}

const getTypeBasedCalendarInformation = async (req, res) => {
    try {
        let result = await calendarModel.GetTypeBasedCalendarInformation(req);
        return res.status(process.env.STATUS_200).send(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getCalendarInformation, getTypeBasedCalendarInformation
}