const auth = require('../middleware/auth');
const calendarController = require('../controller/v1/calendar.controller');

module.exports = (app) => {

    app.post('/v1/calendar/getCalendarInformation', auth.userAuth, calendarController.getCalendarInformation);
    app.post('/v1/calender/getTypeBasedCalendarInformation', auth.userAuth, calendarController.getTypeBasedCalendarInformation)
}