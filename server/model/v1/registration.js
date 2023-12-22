const db = require('../../db');
const helper = require('../../helper/helper');

const master = async (req, res) => {
    const result = {};
    try {

        const registerStr = "SELECT id,register_by FROM " + process.env.SCHEMA + ".register_by";
        const registerBy = await db.query(registerStr);
        result.registerBy = registerBy.rows;

        const playerStr = "SELECT id,type FROM " + process.env.SCHEMA + ".player_type";
        const playerType = await db.query(playerStr);
        result.playerType = playerType.rows;

        const eventStr = "SELECT id,type FROM " + process.env.SCHEMA + ".event_type";
        const eventType = await db.query(eventStr);
        result.eventType = eventType.rows;

        const ageStr = "SELECT id,group_name,min_age,max_age FROM " + process.env.SCHEMA + ".age_group";
        const ageGroup = await db.query(ageStr);
        result.ageGroup = ageGroup.rows;

        const countryStr = "SELECT id,code,name AS country,alias FROM " + process.env.SCHEMA + ".country";
        const country = await db.query(countryStr);
        result.country = country.rows;

        let stateand = '';
        if (typeof (req.body.countryID) != "undefined" && req.body.countryID != '') {
            stateand = " AND ( CAST(s.country_id AS TEXT) ='" + req.body.countryID + "' OR c.code='" + req.body.countryID + "' )";
        } else {
            stateand = " AND s.country_id=" + process.env.COUNTRY_ID;
        }
        const stateStr = "SELECT s.id,s.state_name AS state,s.country_id,c.code FROM " + process.env.SCHEMA + ".state AS s INNER JOIN " + process.env.SCHEMA + ".country AS c ON s.country_id = c.id WHERE 1=1 " + stateand + " ORDER BY s.id";
        const state = await db.query(stateStr);
        result.state = state.rows;

        let cityand = '';
        if (typeof (req.body.stateID) != "undefined" && req.body.stateID != '') {
            cityand = " AND state_id=" + req.body.stateID;
            const cityStr = "SELECT id,city_name AS city,state_id FROM " + process.env.SCHEMA + ".city WHERE 1=1 " + cityand + " ORDER BY state_id,id";
            const city = await db.query(cityStr);
            result.city = city.rows;
        } else {
            result.city = [];
        }

        let positionand = '';
        if (typeof (req.body.sportsID) != "undefined" && req.body.sportsID != '') {
            positionand = " AND sports_id=" + req.body.sportsID;
        }
        const positionStr = "SELECT id,position,sports_id FROM " + process.env.SCHEMA + ".game_position WHERE 1=1 " + positionand + " ORDER BY id";
        const position = await db.query(positionStr);
        result.position = position.rows;

        const genderStr = "SELECT id,gender FROM " + process.env.SCHEMA + ".gender ORDER BY id";
        const gender = await db.query(genderStr);
        result.gender = gender.rows;
    } catch (err) {
        result.registerBy = [];
        result.playerType = [];
        result.eventType = [];
        result.ageGroup = [];
        result.country = [];
        result.state = [];
        result.city = [];
        result.position = [];
        result.gender = [];
    }

    return result;
}

const player = async (req, res) => {
    const result = {};
    try {
        result.player = {};
        result.search = [];
        if (typeof (req.body.subscriberID) != "undefined" && req.body.subscriberID != '') {
            const playerStr = "SELECT s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id,s.full_name,to_char(s.date_of_birth,'DD-MM-YYYY') AS dob, DATE_PART('year',AGE(s.date_of_birth)) age, CASE WHEN DATE_PART('year',AGE(s.date_of_birth)) >= eve.c_min_age AND DATE_PART('year',AGE(s.date_of_birth)) <= eve.c_max_age THEN '1' ELSE '0' END AS age_allow, s.isd_code,s.mobile_number,s.email_id,s.username,s.gender,CASE WHEN s.gender = 0 THEN '1' WHEN eve.player_type_id = 4 THEN '1' WHEN eve.player_type_id = s.gender THEN '1' ELSE '0' END AS gender_allow FROM " + process.env.SCHEMA + ".subscriber AS s LEFT JOIN (SELECT  CASE WHEN a_min.min_age <= a_max.min_age THEN a_min.min_age ELSE a_max.min_age END AS c_min_age,CASE WHEN a_min.max_age >= a_max.max_age THEN a_min.max_age ELSE a_max.max_age END AS c_max_age,ev.player_type_id FROM " + process.env.SCHEMA + ".event AS ev INNER JOIN " + process.env.SCHEMA + ".age_group AS a_min ON ev.min_age_group_id = a_min.id INNER JOIN " + process.env.SCHEMA + ".age_group AS a_max ON ev.max_age_group_id = a_max.id WHERE ev.id=" + req.body.eventID + " ) AS eve ON 1=1 WHERE s.id=" + req.body.subscriberID + " AND s.status= " + process.env.ACTIVE + " ";
            const player = await db.query(playerStr);
            if (player.rowCount > 0) {
                result.player = player.rows[0];
            }
        } else {
            /* const searchStr = "SELECT id AS subscriber_id,subscriber_id AS subscriber_display_id,full_name,to_char(date_of_birth,'DD-MM-YYYY') AS dob,isd_code,mobile_number,email_id,username FROM "+process.env.SCHEMA+".subscriber WHERE ( CAST(subscriber_id AS TEXT) LIKE '%"+req.body.search+"%' OR username like '%"+req.body.search+"%' ) AND status="+process.env.ACTIVE; */
            const searchStr = "SELECT s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id,s.mobile_number,s.full_name,to_char(s.date_of_birth,'DD-MM-YYYY') AS dob, DATE_PART('year',AGE(s.date_of_birth)) age, CASE WHEN DATE_PART('year',AGE(s.date_of_birth)) >= eve.c_min_age AND DATE_PART('year',AGE(s.date_of_birth)) <= eve.c_max_age THEN '1' ELSE '0' END AS age_allow, s.isd_code,s.mobile_number,s.email_id,s.username,s.gender,CASE WHEN s.gender = 0 THEN '1' WHEN eve.player_type_id = 4 THEN '1' WHEN eve.player_type_id = s.gender THEN '1' ELSE '0' END AS gender_allow FROM " + process.env.SCHEMA + ".subscriber AS s LEFT JOIN (SELECT  CASE WHEN a_min.min_age <= a_max.min_age THEN a_min.min_age ELSE a_max.min_age END AS c_min_age,CASE WHEN a_min.max_age >= a_max.max_age THEN a_min.max_age ELSE a_max.max_age END AS c_max_age,ev.player_type_id FROM " + process.env.SCHEMA + ".event AS ev INNER JOIN " + process.env.SCHEMA + ".age_group AS a_min ON ev.min_age_group_id = a_min.id INNER JOIN " + process.env.SCHEMA + ".age_group AS a_max ON ev.max_age_group_id = a_max.id WHERE ev.id=" + req.body.eventID + " ) AS eve ON 1=1 WHERE ( CAST(s.subscriber_id AS TEXT) LIKE '%" + req.body.search + "%' OR s.username like '%" + req.body.search + "%' OR s.full_name like '%" + req.body.search + "%' OR CAST(s.mobile_number AS TEXT) LIKE '%" + req.body.search + "%' )  AND s.status= " + process.env.ACTIVE + "";
            const search = await db.query(searchStr);
            result.search = search.rows;
        }
    } catch (error) {
        result.player = {};
        result.search = [];
    }

    return result;
}

const allowRegistration = async (req, res) => {
    const result = {};
    try {
        // AND e_r.status="+process.env.REG_SUBMIT+"
        let eventStr = "SELECT  CASE WHEN e.no_of_team = 0 THEN '1' WHEN e.no_of_team > COUNT(DISTINCT e_r.id) THEN '1' ELSE '0' END AS allow FROM " + process.env.SCHEMA + ".event AS e LEFT JOIN " + process.env.SCHEMA + ".event_registration AS e_r ON e.id = e_r.event_id  WHERE e.id = " + req.body.eventID + "   GROUP BY e.no_of_team ";
        let event = await db.query(eventStr);
        if (event.rowCount > 0) {
            result.event = event.rows[0];
        } else {
            result.event = {};
        }
    } catch (err) {
        result.event = {};
    }
    return result.event;
}

const join = async (req, res) => {
    const result = {};
    try {
        let andID = ''; let andIDvalue = '';
        if (typeof (req.body.registrationID) != "undefined" && req.body.registrationID != '') {
            andID = "id,";
            andIDvalue = req.body.registrationID + ",";
        }
        let coachIsd = '';
        let coachName = '';
        let coachMobile = null;
        let coachEmail = '';
        let coach_SubscribeId = req.body.coach_SubscribeId;
        if (typeof (req.body.coachName) != "undefined" && req.body.coachName != '') {
            coachName = req.body.coachName;
        }
        if (typeof (req.body.coachName) != "undefined" && req.body.coachName != '') {
            coachName = req.body.coachName;
        }
        if (typeof (req.body.coachIsd) != "undefined" && req.body.coachIsd != '') {
            coachIsd = req.body.coachIsd;
        }
        if (typeof (req.body.coachMobile) != "undefined" && req.body.coachMobile != '') {
            coachMobile = req.body.coachMobile;
        }
        if (typeof (req.body.coachEmail) != "undefined" && req.body.coachEmail != '') {
            coachEmail = req.body.coachEmail;
        }

        if (typeof (req.body.shortName) != "undefined" && req.body.shortName != '') {
            req.body.shortName = req.body.shortName;
        }
        else {
            req.body.shortName = ''
        }

        let logoStr = ''; logoVal = ''; logoUpdate = '';
        if (req.body.logo) {
            logoStr = ',logo';
            logoVal = `'${req.body.logo}'`;
            logoUpdate = `,logo = '${req.body.logo}'`
        }
        const joinsStr = "INSERT INTO " + process.env.SCHEMA + ".event_registration (" + andID + "event_id,register_by_id,team_name,short_team_name,city_id,log_status,status,created_by,age_group_id,coach_name,coach_isd_code,coach_mobile_number,coach_email_id,coach_subscriber_id,logo) VALUES(" + andIDvalue + "" + req.body.eventID + "," + req.body.registerBy + ",$$" + req.body.teamName + "$$," + "$$" + req.body.shortName + "$$," + req.body.cityID + "," + process.env.REG_LOG_11 + "," + process.env.REG_INIT + "," + req.myID + "," + req.body.ageGroup + ",'" + coachName + "','" + coachIsd + "'," + coachMobile + ",'" + coachEmail + "','" + coach_SubscribeId + "','" + req.body.logo + "') ON CONFLICT (id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + ",register_by_id=" + req.body.registerBy + ",team_name=$$" + req.body.teamName + "$$,city_id=" + req.body.cityID + ",age_group_id=" + req.body.ageGroup + ",coach_name='" + coachName + "',coach_isd_code='" + coachIsd + "',coach_mobile_number=" + coachMobile + ",coach_email_id='" + coachEmail + "',coach_subscriber_id ='" + coach_SubscribeId + "',short_team_name='" + req.body.shortName + "'" + logoUpdate + ";"
        await db.query(joinsStr);

        if (typeof (req.body.registrationID) == "undefined" || req.body.registrationID == '') {
            let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".event_registration','id'))";
            let regID = await db.query(strID);
            result.id = regID.rows[0].currval;
        } else {
            result.id = req.body.registrationID;
        }
    } catch (err) {
        result.id = false;
    }
    return result;
}

const existsPlayer = async (req, res) => {
    const result = {};
    try {
        let playerStr = "SELECT id, subscriber_id,full_name,isd_code,mobile_number,gender_id, to_char(date_of_birth,'DD-MM-YYYY') AS dob FROM " + process.env.SCHEMA + ".event_players WHERE registration_id=" + req.body.registrationID + " AND STATUS=" + process.env.PLAYER_ACTIVE + " ";
        let players = await db.query(playerStr);
        result.players = players.rows;
    } catch (err) {
        result.players = [];
    }

    return result.players;
}

const addPlayers = async (req, res) => {
    try {
        let playerStr = "INSERT INTO " + process.env.SCHEMA + ".event_players (registration_id,subscriber_id,full_name,gender_id,date_of_birth,isd_code,mobile_number,email_id,position_id,status,created_by) VALUES ";
        let strDOB = ''; let dob = ''; let pid = '';
        let unknownSubscribers = [];
        req.body.players.forEach(e => {
            strDOB = e.dob.split('-');
            dob = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
            if (e.id != "") {
                pid = e.id
            } else {
                unknownSubscribers.push(e.isdCode + e.mobileNumber)
                pid = null;
            }
            e.position = (e.position) ? e.position : null;
            playerStr += "(" + req.body.registrationID + "," + pid + ",'" + e.name + "'," + e.gender + ",'" + dob + "','" + e.isdCode + "'," + e.mobileNumber + ",'" + e.email + "'," + e.position + "," + process.env.PLAYER_ACTIVE + "," + req.myID + "),";
        });
        playerStr = playerStr.replace(/(^,)|(,$)/g, "");
        playerStr += ";";
        await db.query(playerStr);
        if (unknownSubscribers.length) {
            for (let i of unknownSubscribers) {
                let smsData = {
                    mobile: i,
                    smsLink: 'https://play.google.com/store/apps/details?id=com.actio.user'
                }
                await helper.welcomeSMS(smsData)
            }
        }
        let logstr = "UPDATE " + process.env.SCHEMA + ".event_registration SET status=" + process.env.REG_PLAYER + ",log_status=" + req.body.logStatus + ",updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.registrationID + "";
        await db.query(logstr);
        return true;
    } catch (err) {
        return false;
    }
};

const event = async (req, res) => {
    const result = {};
    try {
        let eventStr = "SELECT CASE WHEN a_min.min_age <= a_max.min_age THEN a_min.min_age ELSE a_max.min_age END AS min_age, CASE WHEN a_min.max_age >= a_max.max_age THEN a_min.max_age ELSE a_max.max_age END AS max_age,ev.player_type_id,ev.min_member_per_team,ev.max_member_per_team FROM " + process.env.SCHEMA + ".event AS ev INNER JOIN " + process.env.SCHEMA + ".event_registration as e_r on ev.id = e_r.event_id INNER JOIN " + process.env.SCHEMA + ".age_group AS a_min ON ev.min_age_group_id = a_min.id INNER JOIN " + process.env.SCHEMA + ".age_group AS a_max ON ev.max_age_group_id = a_max.id WHERE e_r.id=" + req.body.registrationID + "";
        let event = await db.query(eventStr);
        if (event.rowCount > 0) {
            result.event = event.rows[0];
        } else {
            result.event = {};
        }
    } catch (err) {
        result.event = {};
    }
    return result.event;
}

const listmaster = async (req, res) => {
    const result = {};
    try {
        let and = "";
        if (typeof (req.body.role) == "undefined" || req.body.role == null || req.body.role != '1') {
            and += " AND (e.created_by=" + req.myID + " OR e_m.subscriber_id = " + req.myID + ")";
        }

        const tournamentStr = "SELECT DISTINCT id,tournament_name FROM " + process.env.SCHEMA + ".tournament  WHERE id IN (SELECT DISTINCT tournament_id FROM " + process.env.SCHEMA + ".event e LEFT JOIN  " + process.env.SCHEMA + ".event_managers AS e_m ON e.id= e_m.event_id WHERE 1=1 " + and + " ) AND status=1";
        const tournament = await db.query(tournamentStr);
        result.tournament = tournament.rows;

        const sportsStr = "SELECT DISTINCT id,sports_name FROM " + process.env.SCHEMA + ".sports  WHERE id IN (SELECT DISTINCT sports_id FROM " + process.env.SCHEMA + ".event e LEFT JOIN  " + process.env.SCHEMA + ".event_managers AS e_m ON e.id= e_m.event_id WHERE 1=1 " + and + " )";
        const sports = await db.query(sportsStr);
        result.sports = sports.rows;

        const eventStr = "SELECT DISTINCT e.id,e.event_name FROM " + process.env.SCHEMA + ".event e LEFT JOIN  " + process.env.SCHEMA + ".event_managers AS e_m ON e.id= e_m.event_id WHERE 1=1 AND e.status=1 " + and + " ";
        const event = await db.query(eventStr);
        result.event = event.rows;

        const eventStatusStr = "SELECT id,status FROM " + process.env.SCHEMA + ".registration_status";
        const eventStatus = await db.query(eventStatusStr);
        result.eventStatus = eventStatus.rows;
    } catch (err) {
        result.tournament = [];
        result.sports = [];
        result.event = [];
        result.eventStatus = [];
    }
    return result;
}

const list = async (req, res) => {
    const result = {};
    try {
        let and = '';
        if (typeof (req.body.tournamentID) != "undefined" && req.body.tournamentID !== null && req.body.tournamentID != '') {
            and += " AND tour.id=" + req.body.tournamentID + " ";
        }

        if (typeof (req.body.eventID) != "undefined" && req.body.eventID !== null && req.body.eventID != '') {
            and += " AND e.id=" + req.body.eventID + " ";
        }

        if (typeof (req.body.statusID) != "undefined" && req.body.statusID !== null && req.body.statusID != '') {
            and += " AND e_r.log_status=" + req.body.statusID + " ";
        }

        if (typeof (req.body.sportsID) != "undefined" && req.body.sportsID !== null && req.body.sportsID != '') {
            and += " AND s.id=" + req.body.sportsID + " ";
        }

        if (typeof (req.body.role) == "undefined" || req.body.role == null || req.body.role != '1') {
            and += " AND (e.created_by=" + req.myID + " OR e_m.subscriber_id = " + req.myID + ")";
        }

        let listStr = "SELECT distinct e_r.id AS registration_id, e.id AS event_id,e.event_name,e.tournament_id,tour.tournament_name,e.sports_id,s.sports_name,e_r.id AS registration_id,e_r.team_name,e_r.coach_name,e_r.coach_isd_code,e_r.coach_mobile_number,e_r.log_status,COUNT( DISTINCT e_p.id)  as total_players,COUNT(DISTINCT e_p.id) FILTER (WHERE e_p.subscriber_id IS NOT NULL) AS subscriber_players,COUNT(DISTINCT e_p.id) FILTER (WHERE e_p.subscriber_id IS NULL) AS non_subscriber_players,CASE WHEN CURRENT_DATE < e.register_start_date THEN '3' WHEN CURRENT_DATE >= e.register_start_date AND  CURRENT_DATE <= e.register_end_date THEN '1' WHEN CURRENT_DATE >= e.register_end_date THEN '2' END AS event_status FROM  " + process.env.SCHEMA + ".event AS e LEFT JOIN " + process.env.SCHEMA + ".event_managers AS e_m ON e.id = e_m.event_id INNER JOIN " + process.env.SCHEMA + ".event_registration AS e_r ON e.id = e_r.event_id LEFT JOIN " + process.env.SCHEMA + ".event_players AS e_p ON e_r.id = e_p.registration_id AND e_p.status=" + process.env.PLAYER_ACTIVE + " INNER JOIN " + process.env.SCHEMA + ".tournament AS tour ON e.tournament_id = tour.id INNER JOIN " + process.env.SCHEMA + ".sports AS s	ON e.sports_id = s.id WHERE 1=1   " + and + " GROUP BY e_r.id,e.id,tour.id,s.id ORDER BY e_r.id DESC";
        let list = await db.query(listStr);
        result.list = list.rows;
    } catch (err) {
        result.list = [];
    }
    return result.list;
}

const view = async (req, res) => {
    const result = {};
    try {
        let viewStr = "";
        let and = "";
        if (typeof (req.body.eventID) != "undefined" && req.body.eventID !== null && req.body.eventID != '') {
            and = " AND e_r.created_by=" + req.myID + " and e_r.event_id=" + req.body.eventID + " ORDER BY e_r.id DESC LIMIT 1";
        }
        if (typeof (req.body.registrationID) != "undefined" && req.body.registrationID !== null && req.body.registrationID != '') {
            and = " AND e_r.id = " + req.body.registrationID + "";
        }

        if (and != '') {
            viewStr = "SELECT e_r.id AS registration_id,e_r.logo,e_r.short_team_name,e_r.log_status,e_r.status,e_r.event_id,e.event_name,e.tournament_id,tour.tournament_name,e.sports_id,s.sports_name,e.min_age_group_id,e.max_age_group_id,e.min_member_per_team,e.max_member_per_team,e.amount,e.bird_discount,CASE WHEN e.early_bird_end_date IS NULL  THEN ''::varchar ELSE to_char(e.early_bird_end_date,'DD-MM-YYYY')::varchar END as early_bird_end_date, to_char(e.register_start_date,'MON DD YYYY') AS f_r_start_date,to_char(e.register_end_date,'MON DD YYYY') AS  f_r_end_date, to_char(e.register_start_date,'DD-MM-YYYY') AS r_start_date,to_char(e.register_end_date,'DD-MM-YYYY') AS r_end_date,to_char(e.event_start_date,'DD-MM-YYYY') AS event_start_date,to_char(e.event_end_date,'DD-MM-YYYY') AS event_end_date,to_char(e.from_time_slot,'HH24:MI:SS') AS from_time,to_char(e.to_time_slot,'HH24:MI:SS') AS to_time,to_char(e.from_time_slot,'HH12:MI AM') AS fromtime,to_char(e.to_time_slot,'HH12:MI AM') AS totime,e_r.register_by_id,r_b.register_by,e.event_type_id,e_t.type AS register_as , e.player_type_id,p_t.type AS player_type, e_r.age_group_id,age.group_name AS age_group ,   e_r.team_name,e_r.coach_name,e_r.coach_subscriber_id,e_r.coach_isd_code,e_r.coach_mobile_number,e_r.coach_email_id , e_r.city_id,city.city_name,city.state_id,st.state_name,st.country_id,co.name AS country_name,e_r.remarks,CASE WHEN e_r.created_by=" + req.myID + " THEN 1 ELSE 0 END subscriber_allow_edit ,array_to_json (array((SELECT d FROM (SELECT e_p.id AS player_id,CASE WHEN e_p.subscriber_id > 0 THEN e_p.subscriber_id ELSE 0 END AS subscriber_id,CASE WHEN s_.subscriber_id > 0 THEN s_.subscriber_id ELSE 0 END AS subscriber_display_id,e_p.full_name,e_p.gender_id,gen. gender, to_char(e_p.date_of_birth,'DD-MM-YYYY') dob,e_p.isd_code,e_p.mobile_number,e_p.email_id, CASE WHEN e_p.position_id IS NULL THEN 0 ELSE e_p.position_id END AS position_id, CASE WHEN g_p.position IS NULL THEN '' ELSE g_p.position::varchar END AS position  FROM " + process.env.SCHEMA + ".event_players AS e_p LEFT JOIN " + process.env.SCHEMA + ".subscriber AS s_ ON e_p.subscriber_id=s_.id LEFT JOIN " + process.env.SCHEMA + ".game_position AS g_p ON  e_p.position_id = g_p.id LEFT JOIN " + process.env.SCHEMA + ".gender AS gen ON e_p.gender_id = gen.id WHERE e_p.registration_id=e_r.id AND e_p.status=" + process.env.PLAYER_ACTIVE + " ORDER BY e_p.id ) d)))AS  players,( SELECT CASE WHEN allow=0 THEN 1 ELSE 0 END  FROM  (SELECT COUNT(id) allow FROM " + process.env.SCHEMA + ".event_match_schedule WHERE status=1 AND (competitor_id=e_r.id OR opponent_id=e_r.id))d ) allow_reject FROM " + process.env.SCHEMA + ".event_registration AS e_r LEFT JOIN " + process.env.SCHEMA + ".event AS e ON e_r.event_id = e.id LEFT JOIN " + process.env.SCHEMA + ".tournament AS tour ON e.tournament_id=tour.id LEFT JOIN " + process.env.SCHEMA + ".sports AS s ON e.sports_id=s.id LEFT JOIN " + process.env.SCHEMA + ".register_by AS r_b ON e_r.register_by_id = r_b.id  LEFT JOIN " + process.env.SCHEMA + ".event_type AS e_t ON e.event_type_id=e_t.id LEFT JOIN " + process.env.SCHEMA + ".player_type AS p_t ON e.player_type_id = p_t.id LEFT JOIN " + process.env.SCHEMA + ".age_group AS age ON e_r.age_group_id=age.id  LEFT JOIN " + process.env.SCHEMA + ".city ON e_r.city_id = city.id LEFT JOIN " + process.env.SCHEMA + ".state AS st ON city.state_id = st.id LEFT JOIN " + process.env.SCHEMA + ".country AS co ON st.country_id = co.id WHERE  1=1 " + and;
        }
        let view = await db.query(viewStr);
        if (view.rowCount > 0) {
            result.view = helper.cleanNull(view.rows[0]);
            if (!result.view.logo) {
                result.view.logo = 'images/registration/default/p1.png'
            }
        } else {
            result.view = {};
        }
    } catch (err) {
        result.view = {};
    }
    return result.view;
}

const editPlayer = async (req, res) => {
    try {
        let sID = ""; let and = "";
        if (typeof (req.body.subscriberID) != "undefined") {
            if (req.body.subscriberID != '') { sID = req.body.subscriberID; } else { sID = null; }
            and += ",subscriber_id=" + sID + "";
        }

        if (typeof (req.body.name) != "undefined" && req.body.name != '') {
            and += ",full_name='" + req.body.name + "'";
        }

        if (typeof (req.body.gender) != "undefined" && req.body.gender != '') {
            and += ",gender_id=" + req.body.gender + "";
        }

        if (typeof (req.body.mobileNumber) != "undefined" && req.body.mobileNumber != '') {
            and += ",mobile_number=" + req.body.mobileNumber + "";
        }

        if (typeof (req.body.isdCode) != "undefined" && req.body.isdCode != '') {
            and += ",isd_code='" + req.body.isdCode + "'";
        }

        if (typeof (req.body.email) != "undefined" && req.body.email != '') {
            and += ",email_id='" + req.body.email + "'";
        }

        if (typeof (req.body.position) != "undefined" && req.body.position != '') {
            and += ",position_id='" + req.body.position + "'";
        }

        if (typeof (req.body.dob) != "undefined" && req.body.dob !== null && req.body.dob != '') {
            let strDOB = req.body.dob.split('-');
            let dob = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
            and += ",date_of_birth='" + dob + "'";
        }

        let updateStr = "UPDATE " + process.env.SCHEMA + ".event_players SET updated_at=now(),updated_by=" + req.myID + ", status = " + process.env.PLAYER_ACTIVE + " " + and + " WHERE id =" + req.body.playerID + " AND registration_id=" + req.body.registrationID + " ";
        await db.query(updateStr);

        if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove) {
            let removePlayerstr = "UPDATE " + process.env.SCHEMA + ".event_players SET updated_at=now(),updated_by=" + req.myID + " , status = " + process.env.PLAYER_INACTIVE + " WHERE id = " + req.body.playerID + " AND registration_id=" + req.body.registrationID + " ";
            await db.query(removePlayerstr);
        }

        return true;
    } catch (err) {
        return false;
    }
}

const submit = async (req, res) => {
    try {
        /* add player */
        if (typeof (req.body.addPlay) != "undefined" && req.body.addPlay) {
            let addPlayerstr = "INSERT INTO " + process.env.SCHEMA + ".event_players (registration_id,subscriber_id,full_name,gender_id,date_of_birth,isd_code,mobile_number,email_id,position_id,status,created_by) VALUES ";
            let strDOB = ''; let dob = ''; let pid = '';
            req.body.players.forEach(e => {
                strDOB = e.dob.split('-');
                dob = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
                if (e.id != "") { pid = e.id } else { pid = null; }
                addPlayerstr += "(" + req.body.registrationID + "," + pid + ",'" + e.name + "'," + e.gender + ",'" + dob + "','" + e.isdCode + "'," + e.mobileNumber + ",'" + e.email + "'," + e.position + "," + process.env.PLAYER_ACTIVE + "," + req.myID + "),";
            });
            addPlayerstr = addPlayerstr.replace(/(^,)|(,$)/g, "");
            addPlayerstr += ";";
            await db.query(addPlayerstr);
        }
        /* add player */

        /* edit player */
        if (typeof (req.body.editPlay) != "undefined" && req.body.editPlay) {
            let editPlayerstr = "";
            let strDOB = ''; let dob = '';
            req.body.editPlayers.forEach(e => {
                let and = "";
                if (typeof (e.id) != "undefined" && e.id != "") { and += " , subscriber_id=" + e.id + " "; } else { and += " , subscriber_id=NULL"; }
                if (typeof (e.name) != "undefined" && e.name != "") { and += " , full_name='" + e.name + "' "; }
                if (typeof (e.gender) != "undefined" && e.gender != "") { and += " , gender_id=" + e.gender + " "; }
                if (typeof (e.dob) != "undefined" && e.dob != "") {
                    strDOB = e.dob.split('-');
                    dob = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
                    and += " , date_of_birth='" + dob + "' ";
                }
                if (typeof (e.isdCode) != "undefined" && e.isdCode != "") { and += " , isd_code='" + e.isdCode + "' "; }
                if (typeof (e.mobileNumber) != "undefined" && e.mobileNumber != "") { and += " , mobile_number=" + e.mobileNumber + " "; }
                if (typeof (e.email) != "undefined" && e.email != "") { and += " , email_id='" + e.email + "' "; }
                if (typeof (e.position) != "undefined" && e.position != "") { and += " , position_id=" + e.position + " "; }
                editPlayerstr += "UPDATE " + process.env.SCHEMA + ".event_players SET updated_at=now(),updated_by=" + req.myID + " , status = " + process.env.PLAYER_ACTIVE + " " + and + " WHERE id = " + e.pid + " AND registration_id=" + req.body.registrationID + ";";
            });
            await db.query(editPlayerstr);
        }
        /* edit player */

        /* remove player */
        if (typeof (req.body.removePlay) != "undefined" && req.body.removePlay) {
            let removePlayerstr = "UPDATE " + process.env.SCHEMA + ".event_players SET updated_at=now(),updated_by=" + req.myID + " , status = " + process.env.PLAYER_INACTIVE + " WHERE id IN (" + req.body.removePlayers.toString() + ") AND registration_id=" + req.body.registrationID + " ";
            await db.query(removePlayerstr);
        }
        /* remove player */

        /* edit */
        let editand = "";
        if (typeof (req.body.registerBy) != "undefined" && req.body.registerBy != "") { editand += " , register_by_id = " + req.body.registerBy + ""; }
        if (typeof (req.body.teamName) != "undefined" && req.body.teamName != "") { editand += " , team_name=$$" + req.body.teamName + "$$"; }
        if (typeof (req.body.ageGroup) != "undefined" && req.body.ageGroup != "") { editand += " , age_group_id=" + req.body.ageGroup + ""; }
        if (typeof (req.body.isCoach) != "undefined" && req.body.isCoach) {
            if (typeof (req.body.coachName) != "undefined") { editand += " , coach_name='" + req.body.coachName + "'"; } else { editand += " , coach_name=''"; }
            if (typeof (req.body.coachIsd) != "undefined") { editand += " , coach_isd_code='" + req.body.coachIsd + "'"; } else { editand += " , coach_isd_code=''"; }
            if (typeof (req.body.coachMobile) != "undefined" && req.body.coachMobile != "") { editand += " , coach_mobile_number=" + req.body.coachMobile + ""; } else { editand += " , coach_mobile_number=null"; }
            if (typeof (req.body.coachEmail) != "undefined") { editand += " ,coach_email_id='" + req.body.coachEmail + "'"; } else { editand += " ,coach_email_id=''"; }
        }
        if (typeof (req.body.cityID) != "undefined" && req.body.cityID != "") { editand += " , city_id=" + req.body.cityID + ""; }
        if (typeof (req.body.logStatus) != "undefined" && req.body.logStatus != "") { editand += " ,log_status=" + req.body.logStatus + ""; }
        if (typeof (req.body.remarks) != "undefined" && req.body.remarks != "") { editand += " ,remarks=$$" + req.body.remarks + "$$"; }
        let updateRegStr = "UPDATE " + process.env.SCHEMA + ".event_registration SET status=" + process.env.REG_SUBMIT + ",updated_at=now(),updated_by=" + req.myID + " " + editand + " WHERE id=" + req.body.registrationID + " ";
        await db.query(updateRegStr);
        /* edit */

        return true;
    } catch (err) {
        return false;
    }
}

const nonSubscriber = async (req, res) => {
    const result = {};
    try {
        let and = '';
        if (typeof (req.body.dob) != "undefined" && req.body.dob !== null && req.body.dob != '') {
            let strDOB = req.body.dob.split('-');
            let dob = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
            and += " AND date_of_birth='" + dob + "'";
        }

        if (typeof (req.body.name) != "undefined" && req.body.name !== null && req.body.name != '') {
            and += " AND full_name='" + req.body.name + "'";
        }

        if (typeof (req.body.isdCode) != "undefined" && req.body.isdCode !== null && req.body.isdCode != '') {
            and += " AND isd_code='" + req.body.isdCode + "'";
        }

        if (typeof (req.body.mobileNumber) != "undefined" && req.body.mobileNumber !== null && req.body.mobileNumber != '') {
            and += " AND mobile_number='" + req.body.mobileNumber + "'";
        }
        let subscriberStr = "SELECT id AS subscriber_id,subscriber_id AS subscriber_display_id,full_name,username,isd_code,mobile_number,email_id FROM " + process.env.SCHEMA + ".subscriber  WHERE 1=1 " + and + " ORDER BY subscriber_id DESC ";
        let subscriber = await db.query(subscriberStr);
        result.subscriber = subscriber.rows;
    } catch (err) {
        result.subscriber = [];
    }
    return result.subscriber;
}

module.exports = { master, player, allowRegistration, join, existsPlayer, addPlayers, event, listmaster, list, view, editPlayer, submit, nonSubscriber };