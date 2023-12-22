const db = require('../../db');
const { Result } = require('express-validator');

const schedule = async (req, res) => {
    try {
        let scheduleStr = "";
        let resetScheduleStr = "UPDATE " + process.env.SCHEMA + ".event_match_schedule SET status=0,updated_at=NOW(),updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " ";
        await db.query(resetScheduleStr);
        let resetCustomStr = "UPDATE " + process.env.SCHEMA + ".event_match_custom_schedule SET status=0,updated_at=NOW(),updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " ";
        await db.query(resetCustomStr);
        req.body.schedule.forEach(e => {
            let idand = ""; let idval = "";
            if (typeof (e.scheduleID) != "undefined" && e.scheduleID != "") {
                idand = "id,";
                idval = e.scheduleID + ",";
            }
            let strdate = e.date.split('-');
            let newdate = strdate[2] + '-' + strdate[1] + '-' + strdate[0];
            if (!e.isCustom) {
                scheduleStr += "INSERT INTO " + process.env.SCHEMA + ".event_match_schedule (" + idand + "event_id,match_type_id,match_date,from_time,to_time,competitor_id,opponent_id,status,order_by,description,match_name,created_by,venue_asset_id) VALUES (" + idval + "" + req.body.eventID + "," + e.matchType + ",'" + newdate + "','" + e.fromTime + "','" + e.toTime + "'," + e.competitor + "," + e.opponent + ",1," + e.orderBy + ",$$" + e.description + "$$,$$" + e.name + "$$," + req.myID + "," + e.venueAsset + ") ON CONFLICT (id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",event_id=" + req.body.eventID + ",match_type_id=" + e.matchType + ",match_date='" + newdate + "',from_time='" + e.fromTime + "',to_time='" + e.toTime + "',competitor_id=" + e.competitor + ",opponent_id=" + e.opponent + ",status=1,order_by=" + e.orderBy + ",description=$$" + e.description + "$$,match_name=$$" + e.name + "$$,venue_asset_id=" + e.venueAsset + " ;";
            } else {
                scheduleStr += "INSERT INTO " + process.env.SCHEMA + ".event_match_custom_schedule (" + idand + "event_id,match_type,match_date,from_time,to_time,competitor_team,opponent_team,status,order_by,description,match_name,created_by,venue_asset_name) VALUES (" + idval + "" + req.body.eventID + ",$$" + e.matchType + "$$,'" + newdate + "','" + e.fromTime + "','" + e.toTime + "',$$" + e.competitor + "$$,$$" + e.opponent + "$$,1," + e.orderBy + ",$$" + e.description + "$$,$$" + e.name + "$$," + req.myID + ",$$" + e.venueAsset + "$$) ON CONFLICT (id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",event_id=" + req.body.eventID + ",match_type=$$" + e.matchType + "$$,match_date='" + newdate + "',from_time='" + e.fromTime + "',to_time='" + e.toTime + "',competitor_team=$$" + e.competitor + "$$,opponent_team=$$" + e.opponent + "$$,status=1,order_by=" + e.orderBy + ",description=$$" + e.description + "$$,match_name=$$" + e.name + "$$,venue_asset_name=$$" + e.venueAsset + "$$ ;";
            }
        });
        await db.query(scheduleStr);

        return true;
    } catch (err) {
        return false;
    }
}

const getSchedule = async (req, res) => {
    const result = {};
    try {
        if (typeof (req.body.master != "undefined") && req.body.master) {
            let teamStr = "SELECT id AS register_id,team_name,logo,short_team_name FROM " + process.env.SCHEMA + ".event_registration WHERE event_id=" + req.body.eventID + " AND log_status=" + process.env.REG_LOG_31 + "";
            const team = await db.query(teamStr);
            result.team = team.rows;
            let matchTypeStr = "SELECT id,type FROM " + process.env.SCHEMA + ".match_type WHERE STATUS=1 ORDER BY id";
            const matchType = await db.query(matchTypeStr);
            result.matchType = matchType.rows;
            let venueand = ""; let venueval = "";
            if (typeof (req.body.venueID) != "undefined" && req.body.venueID != "") {
                venueand = " AND venue_id=" + req.body.venueID + " ";
                venueval = " AND id=" + req.body.venueID + " ";
            }
            let venueStr = "SELECT id AS venue_id,venue_name FROM " + process.env.SCHEMA + ".venue WHERE  1=1 " + venueval + "";
            const venue = await db.query(venueStr);
            result.venue = venue.rows;
            let assetStr = "SELECT id AS asset_id,venue_id,title AS asset FROM " + process.env.SCHEMA + ".venue_asset WHERE status=1 " + venueand + " ";
            const asset = await db.query(assetStr);
            result.asset = asset.rows;
        } else {
            result.team = [];
            result.matchType = [];
            result.venue = [];
            result.asset = [];
        }

        let scheduleStr =
            `SELECT d.*,
        CASE WHEN ecd.remarks IS NULL  THEN
        ''
        ELSE 
        ecd.remarks::varchar
        END as change_remarks,
        CASE WHEN ecd.actual_start_date IS NULL  THEN
        ''
        ELSE 
        to_char(ecd.actual_start_date,'DD-MM-YYYY')::varchar
        END as actual_start_date,
        ecd.actual_start_time as ast,
        CASE WHEN ecd.actual_start_time IS NULL  THEN
        ''
        ELSE 
        to_char(ecd.actual_start_time,'HH12:MI AM')::varchar
        END as actual_start_time,
        CASE WHEN ecd.actual_end_time IS NULL  THEN
        ''
        ELSE 
        to_char(ecd.actual_end_time,'HH12:MI AM')::varchar
        END as actual_end_time,
        ecd.actual_end_time as aet,
        CASE WHEN ecd.team_one IS NULL  THEN
        ''
        ELSE 
        ecd.team_one::varchar
        END as competitor_score,
        CASE WHEN ecd.team_two IS NULL  THEN
        ''
        ELSE 
        ecd.team_two::varchar
        END as oponent_score,
        ecd.playground
        FROM
        `
            + "(SELECT false AS isCustom,m_s.id AS schedule_id, m_s.event_id,m_s.match_type_id,m_t.type AS match_type,m_s.match_name,m_s.description, to_char(m_s.match_date,'DD-MM-YYYY') AS match_date,m_s.match_date as mdate,m_s.from_time, to_char(m_s.from_time,'HH12:MI AM') AS from ,m_s.to_time,to_char(m_s.to_time,'HH12:MI AM') AS to, m_s.competitor_id,e_r1.team_name AS competitor,m_s.opponent_id,e_r2.team_name  AS opponent,m_s.order_by ,v.venue_name , v_a.id AS venue_asset_id,v_a.title AS venue_asset_name FROM " + process.env.SCHEMA + ".event_match_schedule AS m_s   INNER JOIN " + process.env.SCHEMA + ".event AS e ON m_s.event_id=e.id  INNER JOIN " + process.env.SCHEMA + ".venue AS v ON e.venue_id=v.id  INNER JOIN " + process.env.SCHEMA + ".venue_asset AS v_a ON v.id = v_a.venue_id AND m_s.venue_asset_id=v_a.id INNER JOIN " + process.env.SCHEMA + ".event_registration e_r1 ON m_s.event_id=e_r1.event_id AND m_s.competitor_id=e_r1.id   INNER JOIN " + process.env.SCHEMA + ".event_registration e_r2 ON m_s.event_id=e_r2.event_id AND m_s.opponent_id=e_r2.id  INNER JOIN " + process.env.SCHEMA + ".match_type m_t ON m_s.match_type_id=m_t.id WHERE 1=1 AND m_s.event_id=" + req.body.eventID + " AND m_s.status=1   UNION SELECT true AS isCustom,m_s.id AS schedule_id,m_s.event_id,null AS match_type_id,m_s.match_type,m_s.match_name,m_s.description, to_char(m_s.match_date,'DD-MM-YYYY') AS match_date,m_s.match_date as mdate, m_s.from_time, to_char(m_s.from_time,'HH12:MI AM') AS from ,m_s.to_time, to_char(m_s.to_time,'HH12:MI AM') AS to,null AS competitor_id, m_s.competitor_team AS competitor,null AS opponent_id,  m_s.opponent_team  AS opponent,m_s.order_by,v.venue_name,null as venue_asset_id,m_s.venue_asset_name  FROM " + process.env.SCHEMA + ".event_match_custom_schedule AS m_s  INNER JOIN " + process.env.SCHEMA + ".event AS e ON m_s.event_id=e.id  INNER JOIN " + process.env.SCHEMA + ".venue AS v ON e.venue_id=v.id WHERE 1=1 AND m_s.event_id=" + req.body.eventID + " AND m_s.status=1 ORDER BY mdate, order_by )" +
            `as d 
        LEFT join event_controller_details as ecd 
        ON ecd.event_id = d.event_id
        AND ecd.match_schedule_id = d.schedule_id`;

        const schedule = await db.query(scheduleStr);
        result.schedule = schedule.rows.map((item) => {
            if (item.actual_start_date) {
                item.match_date = item.actual_start_date
            }
            if (item.actual_start_time) {
                item.from = item.actual_start_time
            }
            if (item.actual_end_time) {
                item.to = item.actual_end_time
            }
            if (item.playground) {
                item.venue_asset_name = item.playground
            }
            return item;
        });
    } catch (err) {
        result.schedule = [];
        result.team = [];
        result.matchType = [];
        result.venue = [];
        result.asset = [];
        result.query = scheduleStr
    }
    return result;
}

const scheduleDetail = async (req, res) => {
    const result = {};
    try {
        let scheduleDetailStr = "SELECT  m_s.event_id,e.event_name,e.venue_id,v.venue_name, v_a.id AS venue_asset_id,v_a.title  AS venue_asset_name,m_s.match_name,m_s.description,m_s.from_time,m_s.to_time, m_s.match_type_id,m_t.type AS match_type, to_char(m_s.match_date,'DD-MM-YYYY') AS match_date, to_char(m_s.from_time,'HH12:MI AM') AS from,to_char(m_s.to_time,'HH12:MI AM') AS to, m_s.competitor_id,m_s.opponent_id,m_s.competitor_id,e_r1.team_name AS competitor,e_r1.short_team_name as competitor_short_name,e_r1.logo as competitor_logo,r_b1.register_by AS competitor_register_by,e_r1. coach_name AS competitor_coach, r_b2.register_by AS opponent_register_by,e_r2.coach_name AS opponent_coach,m_s.opponent_id,e_r2.team_name AS opponent,e_r2.short_team_name as opponent_short_name,e_r2.logo as opponent_logo, array_to_json(array(SELECT d FROM (SELECT  e_p.id AS player_id,e_p.subscriber_id,e_p.full_name FROM  " + process.env.SCHEMA + ".event_players AS e_p WHERE  e_p.status=1 AND e_p.registration_id=m_s.competitor_id  ORDER BY e_p.id) d )) competitor_team, array_to_json(array(SELECT d FROM (SELECT  e_p.id AS player_id,e_p.subscriber_id,e_p.full_name FROM  " + process.env.SCHEMA + ".event_players AS e_p WHERE  e_p.status=1 AND e_p.registration_id=m_s.opponent_id  ORDER BY e_p.id) d )) opponent_team FROM " + process.env.SCHEMA + ".event_match_schedule AS m_s  INNER JOIN " + process.env.SCHEMA + ".event_registration e_r1 ON m_s.event_id=e_r1.event_id AND m_s.competitor_id=e_r1.id INNER JOIN " + process.env.SCHEMA + ".event_registration e_r2 ON m_s.event_id=e_r2.event_id AND m_s.opponent_id=e_r2.id INNER JOIN " + process.env.SCHEMA + ".register_by AS r_b1 ON e_r1.register_by_id=r_b1.id INNER JOIN " + process.env.SCHEMA + ".register_by AS r_b2 ON e_r2.register_by_id=r_b2.id INNER JOIN " + process.env.SCHEMA + ".match_type AS m_t ON m_s.match_type_id=m_t.id INNER JOIN " + process.env.SCHEMA + ".event AS e ON m_s.event_id=e.id INNER JOIN " + process.env.SCHEMA + ".venue AS v ON e.venue_id=v.id INNER JOIN " + process.env.SCHEMA + ".venue_asset AS v_a ON v.id = v_a.venue_id AND m_s.venue_asset_id=v_a.id where m_s.id=" + req.body.scheduleID + "";
        const scheduleDetail = await db.query(scheduleDetailStr);
        if (scheduleDetail.rowCount > 0) {
            let row = scheduleDetail.rows[0];
            let controllerDetails = `SELECT team_one AS competitor_score,team_two AS oponent_score,remarks AS change_remarks,playground FROM event_controller_details WHERE match_schedule_id=${req.body.scheduleID}`
            controllerDetails = await db.query(controllerDetails);
            if (controllerDetails.rowCount) {
                row.competitor_score = (controllerDetails.rows[0].competitor_score) ? controllerDetails.rows[0].competitor_score : ''
                row.oponent_score = (controllerDetails.rows[0].oponent_score) ? controllerDetails.rows[0].oponent_score : ''
                row.change_remarks = (controllerDetails.rows[0].change_remarks) ? controllerDetails.rows[0].change_remarks : ''
                row.venue_asset_name = (controllerDetails.rows[0].playground) ? (controllerDetails.rows[0].playground) : row.venue_asset_name;
                row.playground = (controllerDetails.rows[0].playground) ? (controllerDetails.rows[0].playground) : '';
            }
            else {
                row.competitor_score = ''
                row.oponent_score = ''
                row.change_remarks = ''
            }
            result.schedule = row;
        } else {
            result.schedule = {};
        }
    } catch (err) {
        result.schedule = {};
    }
    return result.schedule;
}

const getMatchStatistics = async (req, res) => {
    try {
        let matchId = req.body.match_id;
        let stats = `SELECT 
        msp.match_id,
        msp.opponent_id,
        msp.competitor_id,
        ms.id as ms_id,
        ms.header,
        ms.competitor_value,
        ms.opponent_value
        FROM match_statistics_parent as msp
        INNER JOIN match_statistics as ms
        ON ms.statistics_id = msp.id
        WHERE msp.match_id=${matchId};
        `;
        stats = await db.query(stats);
        let result = {};
        if (!stats.rowCount) {
            return result
        }
        let opponent = stats.rows[0].opponent_id
        let competitor = stats.rows[0].competitor_id
        let competitorQuery = await db.query(`
        SELECT 
        team_name,
        CASE WHEN logo IS NULL  THEN
        'images/sports/team1.png'
        WHEN logo = '' THEN
        'images/sports/team1.png'
        ELSE 
        logo::varchar
        END as logo,
        CASE WHEN short_team_name IS NULL  THEN
        ''
        ELSE 
        short_team_name::varchar
        END as short_team_name
        FROM event_registration WHERE id=${competitor}`)
        let opponentQuery = await db.query(`
        SELECT team_name,
        CASE WHEN logo IS NULL  THEN
        'images/sports/team2.png'
        WHEN logo = '' THEN
        'images/sports/team2.png'
        ELSE 
        logo::varchar
        END as logo,
        CASE WHEN short_team_name IS NULL  THEN
        ''
        ELSE 
        short_team_name::varchar
        END as short_team_name
         FROM event_registration WHERE id=${opponent}`)
        result.competitor = competitorQuery.rows[0];
        result.opponent = opponentQuery.rows[0];
        result.stats = stats.rows;
        return result;
    }
    catch (err) {
        console.log(err)
        return {
            serverError: true,
            error: err.message
        }
    }
}

const insertMatchStatistics = async (req, res) => {
    try {
        let matchId = req.body.match_id;
        await db.query(`DELETE FROM match_statistics_parent WHERE match_id = ${matchId}`)
        let query = await db.query(`INSERT INTO match_statistics_parent(match_id,competitor_id,opponent_id,created_at,created_by,status)
        VALUES(${matchId},${req.body.competitor_id},${req.body.opponent_id},now(),${req.myID},1) RETURNING id;`);
        let statId = query.rows[0].id;
        let statQuery = '';
        for (let stat of req.body.match_statistics) {
            statQuery += `INSERT INTO match_statistics(header,competitor_value,opponent_value,created_at,created_by,status,statistics_id)
            VALUES('${stat.header}','${stat.competitor_value}','${stat.opponent_value}',now(),${req.myID},1,${statId});`
        }
        await db.query(statQuery);
    }
    catch (err) {
        console.log(err)
        return {
            serverError: true,
            error: err.message
        }
    }
}

module.exports = { getMatchStatistics, insertMatchStatistics, schedule, getSchedule, scheduleDetail }