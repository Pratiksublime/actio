const db = require('../../db');
const helper = require('../../helper/helper');
const Notifylog = require('../../helper/config.json').log.notification;
const notificationmodel = require('../../model/v1/notification');

const actioKPI = async (req) => {
    try {
        let query = `SELECT
        e.id as event_id,
        e.event_name,
        e.sports_id,
        concat(to_char(e.event_start_date,'DY MON DD YYYY'),' - ',to_char(e.event_end_date,'DY MON DD YYYY')) as event_date_range,
        e.event_start_date,
        e.event_end_date,
        sp.sports_name,
        t.id as tournament_id,
        t.tournament_name,
        e.venue_id,
        v.venue_name
        
        FROM event as e
        INNER JOIN ${process.env.SCHEMA}.sports as sp
        ON e.sports_id = sp.id
        INNER JOIN ${process.env.SCHEMA}.tournament as t
        ON e.tournament_id = t.id
        INNER JOIN ${process.env.SCHEMA}.venue as v
        ON e.venue_id = v.id
        WHERE e.id=${req.body.eventID} LIMIT 1;`;
        query = await db.query(query);
        let result = {};
        result.event = {};
        if (query.rowCount) {
            let doc = query.rows[0];
            let sports_id = doc.sports_id;
            result['event'] = doc;
            let kpiQuery = `SELECT
           kc.id AS kpi_id,
           kc.category_name AS kpi_name,
           kc.type_status AS kpi_type 
           
           FROM kpi_category as kc
           INNER JOIN kpi_sport_mapping as ksm
           ON ksm.kpi_category_id = kc.id
           WHERE ksm.sports_id = ${sports_id};`;
            kpiQuery = await db.query(kpiQuery);

            if (kpiQuery.rowCount) {
                result.event.kpi = kpiQuery.rows
                result.event.coach_list = []
            }
            let coachQuery = await db.query(`SELECT DISTINCT ON(coach_subscriber_id) coach_subscriber_id as id,coach_name as "coachName" FROM event_registration WHERE event_id =${req.body.eventID} `);
            // AND created_by=${req.myID}
            if (coachQuery.rowCount) {
                result.event.coach_list = coachQuery.rows;
            }
        }

        return result.event;
    } catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const insertActioKPI = async (req) => {
    try {
        let query = `INSERT INTO ${process.env.SCHEMA}.actio_kpi(
            tournament_id, event_id, player_subscriber_id, coach_subscriber_id, status,
            created_by,created_at)
            VALUES (${req.body.tournamentID},
            ${req.body.eventID},
            ${req.myID},
            ${req.body.coachID},
            1,
            ${req.myID},
            now())
            RETURNING id;`;
        query = await db.query(query);
        if (query.rowCount) {
            let actiokpiID = query.rows[0].id;
            let insertKPIArray = []
            for (let item of req.body.kpi) {
                insertKPIArray.push(`(${actiokpiID},${item.id},'${item.value}',now(),${req.myID})`)
            }
            insertKPIArray = insertKPIArray.join();
            let kpiQuery = `INSERT INTO ${process.env.SCHEMA}.actio_kpi_details(
            actio_kpi_id,
            kpi_category_id,
            kpi_category_value,
            created_at,
            created_by) 
            VALUES ${insertKPIArray}`;
            kpiQuery = await db.query(kpiQuery);
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const nonActioKPI1 = async () => {
    try {
        let query = `
        SELECT 
        c.id as country_id,
        c.name as country_name,
        s.id as state_id,
        s.state_name as state_name

        FROM country as c
        INNER JOIN state as s
        ON s.country_id = c.id;`;
        query = await db.query(query);
        const currentYear = (new Date()).getFullYear();
        const sports = await db.query(`SELECT id,sports_name FROM ${process.env.SCHEMA}.sports`);
        let result = {
            countryState: [],
            sports: sports.rows,
            years: helper.generateRangeOfYears(currentYear, currentYear - 50, -1)
        };

        if (query.rowCount) {
            let finalArray = [];
            let countryIds = [];
            (query.rows).forEach((item) => {
                if (!countryIds.includes(item.country_id)) {
                    countryIds.push(item.country_id);
                    let country = {
                        country_id: item.country_id,
                        country_name: item.country_name,
                        states: []
                    }
                    country.states.push({
                        state_id: item.state_id,
                        state_name: item.state_name,
                        country_id: item.country_id
                    })
                    finalArray.push(country);
                }
                else {
                    let existItem = finalArray.findIndex(subItem => subItem.country_id == item.country_id);
                    finalArray[existItem].states.push({
                        state_id: item.state_id,
                        state_name: item.state_name,
                        country_id: item.country_id
                    })
                }
            })
            result.countryState = finalArray;
        }
        return result;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const registerNonActioEvents = async (req) => {
    try {
        let tournamentStartDate;
        if (req.body.from_date) {
            tournamentStartDate = req.body.from_date.split('-');
            tournamentStartDate = tournamentStartDate[2] + '-' + tournamentStartDate[1] + '-' + tournamentStartDate[0];
        }
        let tournamentEndDate;
        if (req.body.to_date) {
            tournamentEndDate = req.body.to_date.split('-');
            tournamentEndDate = tournamentEndDate[2] + '-' + tournamentEndDate[1] + '-' + tournamentEndDate[0];
        }
        let tourQuery = `INSERT INTO ${process.env.SCHEMA}.non_actio_tournaments(
            created_date, created_by, tournament_state, tournament_country, tournament_venue, tournament_name,
            tournament_start_date, tournament_end_date)
            VALUES (
            now(), ${req.myID}, ${req.body.state}, ${req.body.country}, '${req.body.venue}',
            '${req.body.tournament_name}', '${tournamentStartDate}', '${tournamentEndDate}' ) RETURNING id;`;
        tourQuery = await db.query(tourQuery);
        const tournamentID = tourQuery.rows[0].id;
        let insertEvents = [];
        let eventQuery;
        if (req.body.event.length) {
            for (let item of req.body.event) {
                insertEvents.push(`('${item.name}',${item.sports},${tournamentID})`)
            }
            insertEvents = insertEvents.join();
            eventQuery = `INSERT INTO ${process.env.SCHEMA}.non_actio_events(event_name, sports_id, tournament_id)
            VALUES ${insertEvents}`;
            eventQuery = await db.query(eventQuery);
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const nonActioFilterKPI = async (req) => {
    try {
        let countryID = req.body.country;
        let stateID = req.body.state;
        let baseQuery, eventQuery, availableYears;
        let result = {
            years: [],  // (availableYears.rowCount) ? availableYears.rows.map((item) => item.year) : 
            tournaments: [],
            events: [],
            kpi: [],
        }

        availableYears = await db.query(`
        SELECT DISTINCT extract(year from tournament_start_date) AS year
        FROM ${process.env.SCHEMA}.non_actio_tournaments WHERE tournament_country = ${countryID} AND 
        tournament_state = ${stateID};`)
        if (availableYears.rowCount) {
            availableYears = availableYears.rows.map((item) => item.year);
            result.years = availableYears;
        }
        if (!req.body.year) {
            return result;
        }
        baseQuery = `SELECT 
        id as tournament_id,
        tournament_name
        FROM public.non_actio_tournaments
        WHERE tournament_country = ${countryID}
        AND tournament_state = ${stateID}
        AND extract(year from tournament_start_date) = ${req.body.year};`;
        baseQuery = await db.query(baseQuery);
        if (baseQuery.rowCount) {
            result.tournaments = baseQuery.rows;
        }

        if (req.body.tournamentID) {
            eventQuery = `SELECT e.id as event_id,e.event_name 
            FROM non_actio_events as e
            WHERE e.tournament_id = ${req.body.tournamentID};`
            eventQuery = await db.query(eventQuery);
            if (eventQuery.rowCount) {
                result.events = eventQuery.rows;
            }
        }

        if (req.body.tournamentID && req.body.eventID) {
            eventQuery = `SELECT e.sports_id 
            FROM non_actio_events as e
            WHERE e.id = ${req.body.eventID};`
            eventQuery = await db.query(eventQuery);
            if (eventQuery.rowCount) {
                let sortsID = eventQuery.rows[0].sports_id;
                let sportsQuery = `SELECT 
                kc.id as kpi_id,
                kc.category_name as kpi_name,
                kc.type_status as kpi_type
                FROM kpi_category as kc
                INNER JOIN kpi_sport_mapping as ksm
                ON kc.id = ksm.kpi_category_id
                WHERE sports_id = ${sortsID};`

                sportsQuery = await db.query(sportsQuery);
                if (sportsQuery.rowCount) {
                    result.kpi = sportsQuery.rows;
                }
            }
        }

        return result;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const registerNonActioEventsKPI = async (req) => {
    try {
        let query = `INSERT INTO ${process.env.SCHEMA}.non_actio_kpi(
            tournament_id, event_id, player_subscriber_id, coach_subscriber_id, status,
            created_by,created_at)
            VALUES (${req.body.tournamentID},
            ${req.body.eventID},
            ${req.myID},
            ${req.body.coachID},
            1,
            ${req.myID},
            now())
            RETURNING id;`;
        query = await db.query(query);
        if (query.rowCount) {
            let actiokpiID = query.rows[0].id;
            let insertKPIArray = []
            for (let item of req.body.kpi) {
                insertKPIArray.push(`(${actiokpiID},${item.id},'${item.value}',now(),${req.myID})`)
            }
            insertKPIArray = insertKPIArray.join();
            let kpiQuery = `INSERT INTO ${process.env.SCHEMA}.non_actio_kpi_details(
            non_actio_kpi_id,
            kpi_category_id,
            kpi_category_value,
            created_at,
            created_by
           ) 
           VALUES ${insertKPIArray}`;

            kpiQuery = await db.query(kpiQuery);
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const performanceReview = async (req) => {
    try {
        const reviewer = req.body.reviewer;
        return CoachOrUserReview(req, reviewer);
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const performanceReviewerList = async (req) => {
    try {
        const performanceReviewer = await db.query(`SELECT * FROM ${process.env.SCHEMA}.kpi_reviewers;`);
        if (performanceReviewer.rowCount) {
            return performanceReviewer.rows;
        }
        return []
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const CoachOrUserReview = async (req, reviewer) => {
    let result = {
        actio_events: [],
        non_actio_events: []
    };
    let reviewerName;
    let eventIdField = '';
    let coachField = '';
    let coachValue = '';
    if (reviewer == '1') {
        reviewerName = 'player_subscriber_id';
        eventIdField = `e.id as event_id`;
        coachField = `sub.full_name as event_coach_name,`;
        coachValue = `INNER JOIN subscriber as sub
        ON sub.id = ak.coach_subscriber_id`
    }
    else {
        reviewerName = 'coach_subscriber_id';
        eventIdField = `DISTINCT ON (e.id) event_id`
    }
    let userQuery = `SELECT
        ${eventIdField},
        ak.id as kpi_id,
        e.event_name,
        et.type,
        CONCAT(v.venue_name,',',c.city_name) AS event_address,
        v.venue_name as event_venue,
        to_char(e.event_start_date,'DY MON DD YYYY') as event_start_date,
        to_char(e.event_end_date,'DY MON DD YYYY') as event_end_date,
        t.tournament_name,
        ak.status,
        ${coachField}
        1 as event_kpi_type 
        FROM actio_kpi as ak
        INNER JOIN event as e
        ON e.id = event_id
        INNER JOIN event_type as et
        ON et.id = e.event_type_id
        INNER JOIN venue as v
        ON v.id = e.venue_id
        INNER JOIN city as c
        ON c.id = v.city_id
        INNER JOIN tournament as t
        ON t.id = e.tournament_id
        ${coachValue}
        WHERE ak.${reviewerName} = ${req.myID};`;
    userQuery = await db.query(userQuery)
    if (userQuery.rowCount) {
        let actio_events = userQuery.rows;
        const eventIds = actio_events.map(item => item.event_id)
        const attachment = await db.query(`SELECT event_id,attachment FROM event_attachment WHERE event_id IN (${eventIds}) AND type='banner';`)
        for (let item of actio_events) {
            if (attachment.rowCount) {
                item['event_logo'] = attachment.rows.find((att) => att.event_id == item.event_id).attachment
            }
            if (reviewer == '1') {
                let kpiQuery = `
                    SELECT 
                    akd.kpi_category_id,
                    kc.category_name as kpi_category_name,
                    akd.kpi_category_value,
                    kc.type_status
                    FROM actio_kpi_details as akd
                    INNER JOIN kpi_category as kc
                    ON kc.id = akd.kpi_category_id
                    WHERE akd.actio_kpi_id = ${item.kpi_id}`;
                kpiQuery = await db.query(kpiQuery);
                if (kpiQuery.rowCount) {
                    item['event_kpi'] = kpiQuery.rows;
                }
            }
        }
        result.actio_events = actio_events;
    }
    userQuery = `SELECT 
        ${eventIdField},
        ak.id as kpi_id,
        e.event_name,
        nt.tournament_name,
        nt.tournament_venue as event_venue, 
        s.state_name as event_state,
        c.name as  event_country, 
        ${coachField}
        to_char(nt.tournament_start_date,'DY MON DD YYYY') as event_start_date,
        to_char(nt.tournament_end_date,'DY MON DD YYYY') as event_end_date,
        to_char(nt.tournament_start_date,'YYYY') AS event_year,
        ak.status,
        2 as event_kpi_type 
        
        FROM non_actio_kpi as ak
        INNER JOIN non_actio_events as e
        ON e.id = ak.event_id
        INNER JOIN non_actio_tournaments as nt
        ON nt.id = ak.tournament_id
        INNER JOIN state as s
        ON s.id = nt.tournament_state
        INNER JOIN country as c
        ON c.id = nt.tournament_country
        ${coachValue}
        WHERE ak.${reviewerName} = ${req.myID};`;
    userQuery = await db.query(userQuery)
    if (userQuery.rowCount) {
        let non_actio_events = userQuery.rows;
        for (let item of non_actio_events) {
            if (reviewer == '1') {
                let kpiQuery = `
                    SELECT 
                    akd.kpi_category_id,
                    kc.category_name as kpi_category_name,
                    akd.kpi_category_value,
                    kc.type_status
                    FROM non_actio_kpi_details as akd
                    INNER JOIN kpi_category as kc
                    ON kc.id = akd.kpi_category_id
                    WHERE akd.non_actio_kpi_id = ${item.kpi_id}`;
                kpiQuery = await db.query(kpiQuery);
                if (kpiQuery.rowCount) {
                    item['event_kpi'] = kpiQuery.rows;
                }
            }
        }
        result['non_actio_events'] = non_actio_events;
    }
    return result;
}

const performanceCoachReviewList = async (req) => {
    try {
        let query;
        if (req.body.event_kpi_type == '1') {
            query = `SELECT 
            ak.id as kpi_id,
            e.event_name,
            ak.player_subscriber_id,
            s.full_name as player_name,
            ak.status as status_string,
            CASE WHEN sp.profile_image IS NULL  THEN
            ''
            ELSE 
            sp.profile_image
            END as profile_image
            
            FROM actio_kpi as ak
            LEFT JOIN event as e
            ON ak.event_id = e.id
            LEFT JOIN subscriber as s
            ON s.id = ak.player_subscriber_id
            LEFT JOIN subscriber_profile  AS sp
            ON sp.subscriber_id = ak.player_subscriber_id
            WHERE e.id=${req.body.eventID};`;
        }
        else {
            query = `SELECT
            ak.id as kpi_id, 
            e.event_name,
            ak.player_subscriber_id,
            s.full_name as player_name,
            sp.profile_image,
            ak.status as status_string
            FROM non_actio_kpi as ak
            LEFT JOIN non_actio_events as e
            ON ak.event_id = e.id
            LEFT JOIN subscriber as s
            ON s.id = ak.player_subscriber_id
            LEFT JOIN subscriber_profile  AS sp
            ON sp.subscriber_id = ak.player_subscriber_id
            WHERE e.id=${req.body.eventID};`;
        }
        let result = await db.query(query);
        if (result.rowCount) {
            result = result.rows;
            let final = {
                event_name: result[0].event_name,
                list: result
            };
            return final;
        }
        return {};
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const updateKPI = async (req) => {
    try {
        let eventTable = '';
        let eventTable2 = '';
        let returnValue = '';
        if (req.body.event_kpi_type == '1') {
            eventTable = 'actio_kpi_details'
            returnValue = 'actio_kpi_id'
            eventTable2 = 'actio_kpi'
        }
        else {
            eventTable = 'non_actio_kpi_details'
            returnValue = 'non_actio_kpi_id'
            eventTable2 = 'non_actio_kpi'
        }
        for (let item of req.body.kpi) {
            let query = `UPDATE ${eventTable} SET 
            kpi_category_value = '${item.category_value}'
            WHERE kpi_category_id = ${item.id} AND ${returnValue}=${req.body.kpiID} RETURNING ${returnValue}`;
            const result = await db.query(query)
            if (result.rowCount) {
                let id = result.rows[0][returnValue];
                await db.query(`UPDATE ${eventTable2} SET status=1 WHERE id = ${id}`)
            }
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getEventKPIForCoach = async (req) => {
    try {
        let query;
        if (req.body.event_kpi_type == '1') {
            query = `SELECT
           ak.id as kpi_id,
           e.event_name,
           v.venue_name as event_venue,
           sub.full_name as event_player_name,
           to_char(e.event_start_date,'DY MON DD YYYY') as event_start_date,
           to_char(e.event_end_date,'DY MON DD YYYY') as event_end_date,
           t.tournament_name
           FROM actio_kpi as ak
           INNER JOIN event as e
           ON e.id = event_id
           INNER JOIN event_type as et
           ON et.id = e.event_type_id
           INNER JOIN venue as v
           ON v.id = e.venue_id
           INNER JOIN city as c
           ON c.id = v.city_id
           INNER JOIN tournament as t
           ON t.id = e.tournament_id
           INNER JOIN subscriber as sub
           ON sub.id = ak.player_subscriber_id
           WHERE e.id=${req.body.eventID} and ak.id =${req.body.kpiID};`
        }
        else {
            query = `SELECT 
            ak.id as kpi_id,
            e.event_name,
            nt.tournament_name,
            nt.tournament_venue as event_venue, 
            sub.full_name as event_player_name,
            to_char(nt.tournament_start_date,'DY MON DD YYYY') as event_start_date,
            to_char(nt.tournament_end_date,'DY MON DD YYYY') as event_end_date
            FROM non_actio_kpi as ak
            INNER JOIN non_actio_events as e
            ON e.id = ak.event_id
            INNER JOIN non_actio_tournaments as nt
            ON nt.id = ak.tournament_id
            INNER JOIN state as s
            ON s.id = nt.tournament_state
            INNER JOIN country as c
            ON c.id = nt.tournament_country
            INNER JOIN subscriber as sub
            ON sub.id = ak.player_subscriber_id
            WHERE e.id=${req.body.eventID} and ak.id =${req.body.kpiID};`
        }
        query = await db.query(query)
        if (query.rowCount) {
            let result = query.rows[0];
            if (req.body.event_kpi_type == '1') {
                let kpi = `SELECT 
                akd.kpi_category_id,
                kc.category_name as kpi_category_name,
                akd.kpi_category_value,
                kc.type_status
                FROM actio_kpi_details as akd
                INNER JOIN kpi_category as kc
                ON kc.id = akd.kpi_category_id
                WHERE akd.actio_kpi_id = ${req.body.kpiID}`
                kpi = await db.query(kpi);
                if (kpi.rowCount) {
                    result['event_kpi'] = kpi.rows;
                }
            }
            else {
                let kpiQuery = `
                SELECT 
                akd.kpi_category_id,
                kc.category_name as kpi_category_name,
                akd.kpi_category_value,
                kc.type_status
                FROM non_actio_kpi_details as akd
                INNER JOIN kpi_category as kc
                ON kc.id = akd.kpi_category_id
                WHERE akd.non_actio_kpi_id = ${req.body.kpiID}`;
                kpiQuery = await db.query(kpiQuery);
                if (kpiQuery.rowCount) {
                    result['event_kpi'] = kpiQuery.rows;
                }
            }
            return result
        }
        return {};
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const coachReviewKPI = async (req) => {
    try {
        let table = '', query = '';
        let notification = {};
        notification.message = {};
        notification.message.type = 'coach_validate';
        notification.message.screen = 'coach_validate';
        if (req.body.event_kpi_type == '1') {
            table = 'actio_kpi'
        }
        else {
            table = 'non_actio_kpi'
        }
        switch (req.body.status) {
            case "2":
            case 2:
                notification.message.msg = Notifylog.msg.kpi_reject;
                notification.message.icon = Notifylog.icon.parent_reject;
                query = `deny_date = now()`
                break;
            case "3":
            case 3:
                notification.message.msg = Notifylog.msg.kpi_revalidate;
                notification.message.icon = Notifylog.icon.parent_reject;
                query = `revalidate_date = now()`
                break;
            case "4":
            case 4:
                notification.message.msg = Notifylog.msg.kpi_approve;
                notification.message.icon = Notifylog.icon.parent_reject;
                query = `approve_date = now()`
                break;
            default:
                query = `1=1`
        }

        let finalQuery = `UPDATE ${table} SET 
        status = ${req.body.status},
        remarks = '${req.body.remarks}',
        ${query},
        updated_by = ${req.myID},
        updated_at = now() 
        WHERE id = ${req.body.kpiID}`;
        let result = await db.query(finalQuery);

        if (result.rowCount) {
            let toChildID = `SELECT coach_subscriber_id,player_subscriber_id FROM ${table} WHERE id = ${req.body.kpiID}`;
            toChildID = await db.query(toChildID);
            notification.from = toChildID.rows[0].coach_subscriber_id;
            notification.to = toChildID.rows[0].player_subscriber_id;
            await notificationmodel.create(notification, req);
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

module.exports = {
    coachReviewKPI, getEventKPIForCoach, updateKPI, performanceCoachReviewList, performanceReviewerList, performanceReview,
    registerNonActioEventsKPI, actioKPI, insertActioKPI, nonActioKPI1, registerNonActioEvents, nonActioFilterKPI
};