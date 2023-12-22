const db = require('../../../db');
const helper = require('../../../helper/helper');

const getPush = async (req, res) => {
    let str = "SELECT * FROM " + process.env.SCHEMA + ".subscriber_push WHERE status=0 ORDER BY id";
    const result = {};
    try {
        const push = await db.query(str);
        result.success = true;
        result.data = push.rows;
        return result;
    } catch (err) {
        return result.success = false;
    }
}

const updatePush = async (req, res) => {
    let str = "UPDATE " + process.env.SCHEMA + ".subscriber_push SET status=1 , updated_at = NOW() WHERE id=" + req.id + "";
    const result = {};
    try {
        let smsData = {};
        smsData.message = 'Welcome to Actio Sport. To know more or update profile, visit , https://playactio.com /ADIISHA';
        smsData.mobileNumber = req.isd_code + req.mobile_number;
        await helper.sendSMS(smsData, (err, data) => {
            global.smsResponse = data;
        });
        await db.query(str);

        return true;
    } catch (err) {
        return false;
    }
}

const getBulk = async (req, res) => {
    let str = "SELECT * ,to_char(date_of_birth,'YYYY-MM-DD') as dob FROM " + process.env.SCHEMA + ".subscriber_bulk WHERE status=0 ORDER BY id";
    const result = {};
    try {
        const bulk = await db.query(str);
        result.success = true;
        result.data = bulk.rows;
        return result;
    } catch (err) {
        return result.success = false;
    }
}

const getnonSubscriber = async (req, res) => {
    let str = "SELECT * FROM " + process.env.SCHEMA + ".subscriber WHERE subscriber_id=0 ORDER BY id";
    const result = {};
    try {
        const bulk = await db.query(str);
        result.success = true;
        result.data = bulk.rows;
        return result;
    } catch (err) {
        return result.success = false;
    }
}

const updateSubscriber = async (req, res) => {
    try {
        let seqID = req.id;
        const subID = await helper.subscriberid(seqID);
        let subIDStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET subscriber_id=" + subID + " where id = " + seqID;
        await db.query(subIDStr);

        let updateStr = "UPDATE " + process.env.SCHEMA + ".subscriber_bulk SET status=1,updated_at=NOW() WHERE id=" + req.id + " "
        await db.query(updateStr);

        const maildata = {};
        maildata.To = req.email_id;
        maildata.Content = 'Welcome to actio , your subscriber id :' + subID;
        maildata.Subject = 'Welcome ' + req.full_name;
        await helper.sendMail(maildata);
    } catch (err) {

    }
}

const createBulk = async (req, res) => {
    try {
        let registerStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber (full_name,isd_code,mobile_number,email_id,username,password,date_of_birth,proof_type,proof_number_sole,proof_number_pair,status,subscriber_reference) values ('" + req.full_name + "','" + req.isd_code + "'," + req.mobile_number + ",'" + req.email_id + "','" + req.username.toLowerCase() + "', '" + req.password + "','" + req.dob + "'," + req.proof_type + ",'" + req.proof_number_sole + "','" + req.proof_number_pair + "'," + process.env.ACTIVE + "," + req.id + ")";
        await db.query(registerStr);

        /*
        let strID      = "SELECT currval(pg_get_serial_sequence('"+process.env.SCHEMA+".subscriber','id'))";
        const subseqID = await db.query(strID);

         let seqID      = subseqID.rows[0].currval;
        const subID    = await helper.subscriberid(seqID);
        let subIDStr   = "UPDATE "+process.env.SCHEMA+".subscriber SET subscriber_id="+subID+" where id = "+seqID;
        await db.query(subIDStr); 

        let updateStr  = "UPDATE "+process.env.SCHEMA+".subscriber_bulk SET status=1,updated_at=NOW() WHERE id="+req.id+" "
        await db.query(updateStr);

        const maildata = {};
        maildata.To       = req.email_id;
        maildata.Content  = 'Welcome to actio , your subscriber id :'+subID ;
        maildata.Subject  = 'Welcome '+req.full_name;

        await helper.sendMail(maildata);
        */

    } catch (err) {
        let error = 'Invalid Data';
        if (err.detail) {
            error = err.detail;
        }
        let updateStr = "UPDATE " + process.env.SCHEMA + ".subscriber_bulk SET remarks='" + error + "',status=2,updated_at=NOW() WHERE id=" + req.id + " "
        await db.query(updateStr);
        let data = { dateTime: new Date().toString(), type: "Cron Job Bulk", errors: err };
        await helper.logError(data);
    }
}

const menuPermission = async (req, res) => {
    let str = "UPDATE " + process.env.SCHEMA + ".menu_permission SET status=0,updated_at=NOW(),updated_by=1 WHERE status=1 AND validity_date < CURRENT_DATE";
    try {
        await db.query(str);
        return true;
    } catch (err) {
        return false;
    }
}

const nonSubscriber = async (req, res) => {
    const result = {};
    try {
        let playerStr = " SELECT  e_r.id ,  (array (SELECT DISTINCT e_p.isd_code||e_p.mobile_number AS mobile FROM " + process.env.SCHEMA + ".event_players AS e_p WHERE  e_r.id=e_p.registration_id AND e_p.subscriber_id is null )) AS mobile FROM  " + process.env.SCHEMA + ".event_registration AS e_r WHERE e_r.id NOT IN ( SELECT DISTINCT reference_id FROM " + process.env.SCHEMA + ".sms_log WHERE type='" + process.env.SMS_TYPE_NS + "' AND status=1 ) AND e_r.status=" + process.env.REG_SUBMIT + " ";
        let players = await db.query(playerStr);
        result.players = players.rows;
    } catch (err) {
        result.players = [];
    }

    return result.players;
}

const logSMS = async (req, res) => {
    try {
        let m = JSON.stringify(req);
        let str = "INSERT INTO " + process.env.SCHEMA + ".sms_log (type,reference_id,data,status,created_by) VALUES ('" + process.env.SMS_TYPE_NS + "'," + req.id + ",$$" + m + "$$,1,1)";
        await db.query(str);
        return true;
    } catch (err) {
        return false;
    }
}

const playerEmail = async (req, res) => {
    const result = {};
    try {
        let playerStr = " SELECT e_r.team_name,e.event_name,tour.tournament_name,s.sports_name,to_char(e.event_start_date,'DD-MM-YYYY') AS start_date, to_char(e.event_end_date,'DD-MM-YYYY') AS end_date , to_char(e.from_time_slot,'HH12:MI AM') AS from_time, to_char(e.to_time_slot,'HH12:MI AM') AS to_time, e_r.id , e_r.coach_name,e_r.coach_email_id, (array (SELECT DISTINCT e_p.email_id  FROM " + process.env.SCHEMA + ".event_players AS e_p WHERE  e_r.id=e_p.registration_id )) AS email  FROM  " + process.env.SCHEMA + ".event_registration AS e_r INNER JOIN " + process.env.SCHEMA + ".event AS e ON e_r.event_id=e.id INNER JOIN " + process.env.SCHEMA + ".tournament AS tour ON e.tournament_id = tour.id INNER JOIN " + process.env.SCHEMA + ".sports AS s ON e.sports_id=s.id WHERE e_r.id NOT IN ( SELECT DISTINCT reference_id FROM " + process.env.SCHEMA + ".email_log WHERE type='" + process.env.EMAIL_TYPE_AKG + "' AND status=1 ) AND   e_r.status=" + process.env.REG_SUBMIT + " ";
        let players = await db.query(playerStr);
        result.players = players.rows;
    } catch (err) {
        result.players = [];
    }

    return result.players;
}

const playerEmailStatus = async (req, res) => {
    const result = {};
    try {
        let playerStr = " SELECT e_r.team_name,e_r.log_status,e.event_name,tour.tournament_name,s.sports_name,to_char(e.event_start_date,'DD-MM-YYYY') AS start_date, to_char(e.event_end_date,'DD-MM-YYYY') AS end_date , to_char(e.from_time_slot,'HH12:MI AM') AS from_time, to_char(e.to_time_slot,'HH12:MI AM') AS to_time, e_r.id , e_r.coach_name,e_r.coach_email_id, (array (SELECT DISTINCT e_p.email_id  FROM " + process.env.SCHEMA + ".event_players AS e_p WHERE  e_r.id=e_p.registration_id )) AS email  FROM  " + process.env.SCHEMA + ".event_registration AS e_r INNER JOIN " + process.env.SCHEMA + ".event AS e ON e_r.event_id=e.id INNER JOIN " + process.env.SCHEMA + ".tournament AS tour ON e.tournament_id = tour.id INNER JOIN " + process.env.SCHEMA + ".sports AS s ON e.sports_id=s.id WHERE e_r.id NOT IN ( SELECT DISTINCT reference_id FROM " + process.env.SCHEMA + ".email_log WHERE type='" + process.env.EMAIL_TYPE_STATUS + "' AND status=1 ) AND   e_r.status=" + process.env.REG_SUBMIT + "  AND e_r.log_status IN (" + process.env.REG_LOG_31 + "," + process.env.REG_LOG_32 + ")";
        let players = await db.query(playerStr);
        result.players = players.rows;
    } catch (err) {
        result.players = [];
    }
    return result.players;
}

const logEmail = async (req, res) => {
    try {
        let m = JSON.stringify(req);
        let str = "INSERT INTO " + process.env.SCHEMA + ".email_log (type,reference_id,data,status,created_by) VALUES ('" + req.type + "'," + req.id + ",$$" + m + "$$,1,1)";
        await db.query(str);
        return true;
    } catch (err) {
        return false;
    }
}

const notify = async (req, res) => {
    const result = {};
    try {
        let notifyStr = "SELECT s.full_name,n.id AS notification_id,n.message,n.from_id,n.to_id,array_to_json(array(SELECT d FROM (SELECT distinct device_token,mode FROM  " + process.env.SCHEMA + ".user_session  WHERE subscriber_id=n.to_id AND status=1 AND mode IN (1,3) ) d)) fcm FROM  " + process.env.SCHEMA + ".notification AS n INNER JOIN  " + process.env.SCHEMA + ".subscriber AS s ON n.from_id=s.id  WHERE 1=1  AND n.status = 0 AND n.seen_status = 0 ";
        const notify = await db.query(notifyStr);
        result.notify = notify.rows;
    } catch (err) {
        result.notify = [];
    }
    return result.notify;
}

const notifySent = async (id, res) => {
    const result = {};
    try {
        let notifyStr = "UPDATE " + process.env.SCHEMA + ".notification SET status=1,updated_at=NOW(),updated_by=1 WHERE id=" + id + " ";
        await db.query(notifyStr);
        return true;
    } catch (err) {
        return false;
    }
}


module.exports = {
    getPush, updatePush, createBulk, getBulk, getnonSubscriber, updateSubscriber, menuPermission, nonSubscriber, logSMS, playerEmail,
    logEmail, playerEmailStatus, notify, notifySent
}