const db = require('../db');
const helper = require('../helper/helper');
const fs = require('fs');

const list = async (req) => {
    try {
        let finalQuery = {};
        const filterKeys = [
            'radius',
            'price_range_start',
            'price_range_end',
            'sport',
            'category',
            'type',
            'city'
        ]
        const isFilterQuery = filterKeys.some(item => (item in req.body && req.body[item]));
        let search = '';
        if (req.body.search) {
            req.body.search = req.body.search.replace(/'/g, '\'\'');
            search = ` AND (tournament_name) ~* '^.*${req.body.search}.*$'`;
        }
        let radius = '';
        if (req.body.radius) {
            radius = ` AND distance < ${req.body.radius}`;
        }
        let type = '';
        if (req.body.type) {
            type = ` AND tournament_type = ${req.body.type}`;
        }
        let city = '';
        if (req.body.city) {
            city = `AND city_id = ${req.body.city}`;
        }
        let sports = '';
        if (req.body.sport) {
            sports = `AND sports_id = ${req.body.sport}`;
        }
        let category = '';
        // if(req.body.category) {
        //     category = `AND category_id = ${req.body.category}`
        // }
        let price = '';
        if (req.body.price_range_start && req.body.price_range_end) {
            price = `AND (entry_fee BETWEEN ${req.body.price_range_start} AND ${req.body.price_range_end} OR entry_fee IS NULL)`
        }
        // GET tournaments by location
        let queryLocation = `SELECT * FROM(SELECT DISTINCT ON (id)
        id,tournament_name,
        CONCAT(address,', ',city_name) as tournament_venue,
        tournament_start_date,
        tournament_start_month,
        tournament_start_year,
        tournament_start_range,
        tournament_end_range,
        tournament_logo,
        distance,
        entry_fee,
        sports,
        is_Registration_Open,
        status
        FROM(SELECT t.id,
            t.tournament_name,
            t.tournament_type,
            v.address_1 as address,
             e.sports_id,
             c.city_name,
             c.id as city_id,
             calculate_distance(v.latitude,v.longitude,${req.body.latitude},${req.body.longitude},'K') AS distance,
             to_char(t.tournament_start_date,'DD') as tournament_start_date,
             to_char(t.tournament_end_date,'DD') as tournament_end_date,
             to_char(t.tournament_start_date,'Month') as tournament_start_month,
             to_char(t.tournament_end_date,'Month') as tournament_end_month,
             to_char(t.tournament_start_date,'YYYY') as tournament_start_year,
             to_char(t.tournament_end_date,'YYYY') as tournament_end_year,
            to_char(t.tournament_start_date,'DY MON DD YYYY') as tournament_start_range,
             to_char(t.tournament_end_date,'DY MON DD YYYY') as tournament_end_range,
             ta.attachment as tournament_logo,

             CASE 
             WHEN now() BETWEEN t.tournament_registration_open_date AND t.tournament_registration_end_date THEN 1
             WHEN now() > t.tournament_registration_end_date THEN 2
             WHEN now() < t.tournament_registration_open_date THEN 3
             END AS is_Registration_Open,
             t.status,
             tf.entry_fee
             FROM tournament as t
             INNER JOIN venue as v
             ON t.tournament_venue = v.id
             INNER JOIN city as c
             ON v.city_id = c.id
             LEFT JOIN event as e
             ON e.tournament_id = t.id
             LEFT JOIN tournament_attachment as ta
             ON ta.tournament_id = t.id AND ta.type= 'logo'
             LEFT JOIN tournament_fee as tf
             ON tf.tournament_id = t.id
             ) AS it
             WHERE t.status = 1
            ${radius} 
            ${type}
            ${city}
            ${sports}
            ${category}
            ${price}
            ${search}
            AND status =1
            ) AS ot
            ORDER BY t.id DESC;`
        queryLocation = await db.query(queryLocation);
        finalQuery['nearMe'] = queryLocation.rows;
        if (isFilterQuery) {
            return finalQuery;
        }
        const getAllTournamentsQuery = `SELECT t.id,
        t.tournament_name,
        CONCAT(v.venue_name,', ',c.city_name) as venue,
        to_char(t.tournament_start_date,'DD') as tournament_start_date,
        TRIM(to_char(t.tournament_start_date,'Month')) as tournament_start_month,
        to_char(t.tournament_start_date,'YYYY') as tournament_start_year,
        to_char(t.tournament_start_date,'DY MON DD YYYY') as tournament_start_range,
        to_char(t.tournament_end_date,'DY MON DD YYYY') as tournament_end_range,
        ta.attachment as tournament_logo,
        
        CASE 
        WHEN now() BETWEEN t.tournament_registration_open_date AND t.tournament_registration_end_date THEN 1
        WHEN now() > t.tournament_registration_end_date THEN 2
        WHEN now() < t.tournament_registration_open_date THEN 3
        END AS is_Registration_Open

        FROM ${process.env.SCHEMA}.tournament as t
        INNER JOIN ${process.env.SCHEMA}.venue as v
        ON t.tournament_venue = v.id
        INNER JOIN ${process.env.SCHEMA}.city as c
        ON v.city_id = c.id
        LEFT JOIN tournament_attachment as ta
        ON ta.tournament_id = t.id AND ta.type= 'logo'
        WHERE t.status = 1 
        ${search}
        AND t.status =1
        ORDER BY t.id`;
        const getFavoriteSports = await db.query(`SELECT s.id FROM ${process.env.SCHEMA}.sports AS s INNER JOIN ${process.env.SCHEMA}.subscriber_play AS sp
        ON s.id = sp.sports_id AND sp.subscriber_id = ${req.myID};`);
        if (!getFavoriteSports.rowCount) {
            // GET ALL tournaments query
            const allTournaments = await db.query(getAllTournamentsQuery);
            finalQuery['favorites'] = allTournaments.rows;
            return finalQuery;
        };
        const favoritesArray = getFavoriteSports.rows.map(item => item.id);
        let getTournamentFavorites = await db.query(`SELECT tournament_id FROM ${process.env.SCHEMA}.event WHERE sports_id IN (${favoritesArray}) GROUP BY tournament_id;`);
        if (!getTournamentFavorites.rowCount) {
            // GET ALL tournaments query
            const allTournaments = await db.query(getAllTournamentsQuery);
            finalQuery['favorites'] = allTournaments.rows;
            return finalQuery;
        };
        const tournamentRows = getTournamentFavorites.rows.map(item => item.tournament_id);
        // GET MATCHING tournaments by ids 
        let getTournamentFavoritesDetails = await db.query(`SELECT t.id,
        t.tournament_name,
        CONCAT(v.venue_name,', ',c.city_name) as venue,
        to_char(t.tournament_start_date,'DD') as tournament_start_date,
        TRIM(to_char(t.tournament_start_date,'Month')) as tournament_start_month,
        to_char(t.tournament_start_date,'YYYY') as tournament_start_year,
        to_char(t.tournament_start_date,'DY MON DD YYYY') as tournament_start_range,
        to_char(t.tournament_end_date,'DY MON DD YYYY') as tournament_end_range,
        ta.attachment as tournament_logo,

        CASE 
        WHEN now() BETWEEN t.tournament_registration_open_date AND t.tournament_registration_end_date THEN 1
        WHEN now() > t.tournament_registration_end_date THEN 2
        WHEN now() < t.tournament_registration_open_date THEN 3
        END AS is_Registration_Open

        FROM ${process.env.SCHEMA}.tournament as t
        INNER JOIN ${process.env.SCHEMA}.venue as v
        ON t.tournament_venue = v.id 
        INNER JOIN ${process.env.SCHEMA}.city as c
        ON v.city_id = c.id 
        LEFT JOIN tournament_attachment as ta
        ON ta.tournament_id = t.id AND ta.type= 'logo'
        WHERE t.id IN (${tournamentRows})
        ${search}
        AND t.status =1
        ORDER BY t.id`);
        if (!getTournamentFavoritesDetails.rowCount) {
            // GET ALL tournaments query
            const allTournaments = await db.query(getAllTournamentsQuery);
            finalQuery['favorites'] = allTournaments.rows;
            return finalQuery;
        }
        finalQuery['favorites'] = getTournamentFavoritesDetails.rows;
        return finalQuery;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const searchFilter = async (req) => {
    try {
        let list = {}
        let search = '';
        if (req.body.search) {
            search = ` AND (tournament_name) ~* '^.*${req.body.search}.*$'`;
        }
        let radius = '';
        if (req.body.radius) {
            radius = ` AND distance < ${req.body.radius}`;
        }
        let type = '';
        if (req.body.type) {
            type = ` AND tournament_type = ${req.body.type}`;
        }
        let city = '';
        if (req.body.city) {
            city = `AND city_id = ${req.body.city}`;
        }
        let sports = '';
        if (req.body.sport) {
            sports = `AND sports_id = ${req.body.sport}`;
        }
        let category = '';
        // if(req.body.category) {
        //     category = `AND category_id = ${req.body.category}`
        // }
        let price = '';
        if (req.body.price_range_start && req.body.price_range_end) {
            price = `AND entry_fee BETWEEN ${req.body.price_range_start} AND ${req.body.price_range_end}`
        }
        const query = `SELECT DISTINCT ON (id)
        id,tournament_name,
        CONCAT(address,', ',city_name) as tournament_venue,
        tournament_start_date,
        tournament_start_month,
        tournament_start_year,
        tournament_start_range,
        tournament_end_range,
        tournament_logo,
        is_Registration_Open
        FROM(SELECT t.id,
            t.tournament_name,
            t.tournament_type,
            v.address_1 as address,
             e.sports_id,
             c.city_name,
             c.id as city_id,
             calculate_distance(v.latitude,v.longitude,${req.body.latitude},${req.body.longitude},'K') AS distance,
             to_char(t.tournament_start_date,'DD') as tournament_start_date,
             to_char(t.tournament_end_date,'DD') as tournament_end_date,
             TRIM(to_char(t.tournament_start_date,'Month')) as tournament_start_month,
             TRIM(to_char(t.tournament_end_date,'Month')) as tournament_end_month,
             to_char(t.tournament_start_date,'YYYY') as tournament_start_year,
             to_char(t.tournament_end_date,'YYYY') as tournament_end_year,
             to_char(t.tournament_start_date,'DY MON DD YYYY') as tournament_start_range,
             to_char(t.tournament_end_date,'DY MON DD YYYY') as tournament_end_range,
             t.tournament_logo,
             t.status AS is_Registration_Open,
             ((t.tournament_fee->>'entry_fees')::int) as entry_fee
             FROM tournament as t
             INNER JOIN venue as v
             ON t.tournament_venue = v.id
             INNER JOIN city as c
             ON v.city_id = c.id
             LEFT JOIN event as e
             ON e.tournament_id = t.id) AS it
             WHERE 1=1
             ${radius} 
             ${type}
             ${city}
             ${sports}
             ${category}
             ${price}
             ${search}`
        const searchFilter = await db.query(query)
        if (!searchFilter.rowCount) {
            return {}
        }
        list['nearMe'] = searchFilter.rows;
        //console.log(list)
        // if(req.body.price_range_start || req.body.price_range_end) {
        //     list = list.filter(item => {
        //         let fee = +item.tournament_fee.entry_fees
        //         if(req.body.price_range_start && req.body.price_range_end && fee >= req.body.price_range_start && fee <= req.body.price_range_end) {
        //             return true;
        //         }
        //         else if(req.body.price_range_start && fee >= req.body.price_range_start) {
        //             return true;
        //         }
        //         else if(req.body.price_range_end && fee <= req.body.price_range_end) {
        //             return true;
        //         }
        //         else {
        //             return false;
        //         }
        //     })
        // }
        return list;
    }
    catch (err) {
        return {}
    }
}

const search = async (req, res) => {
    try {

        console.log('req.body.tournamentID');
        console.log(req.body.tournamentID);

        let queryString = await db.query(`
        SELECT t.*, t.id,t.tournament_name,t.tournament_description,tt.name as tournament_type,
        v.id as venue_id,
        v.venue_name as tournament_venue,CONCAT(v.address_1,', ',c.city_name,', ',v.zip_code) as tournament_address,
        
        CASE WHEN cast(v.latitude as varchar) IS NULL  THEN 
        CAST('0.000' AS VARCHAR)
        ELSE 
        CAST(v.latitude AS VARCHAR)
        END as tournament_lat,

        CASE WHEN cast(v.longitude as varchar) IS NULL  THEN 
        CAST('0.000' AS VARCHAR)
        ELSE 
        CAST(v.longitude AS VARCHAR)
        END as tournament_long,

        c.city_name as tournament_city_name,
        st.state_name as tournament_state_name,
        cou.name as tournament_country_name,
        to_char(t.tournament_start_date, 'DD-MM-YYYY') as tournament_start_date,
        to_char(t.tournament_end_date, 'DD-MM-YYYY') as tournament_end_date,
        
        to_char(t.tournament_registration_open_date,'DD-MM-YYYY':: varchar) as tournament_registration_open_date,
        to_char(t.tournament_registration_end_date,'DD-MM-YYYY':: varchar) as tournament_registration_end_date,
        to_char(t.tournament_early_bird_end_date,'DD-MM-YYYY':: varchar) as tournament_early_bird_end_date,
        t.tournament_start_time as tournament_start_time,
        t.tournament_end_time as tournament_end_time,
        t.tournament_start_time as tournament_start_time_2,
        t.tournament_end_time as tournament_end_time_2,
        to_char(t.tournament_registration_end_date,'DD MON YYYY':: VARCHAR) as tournament_registration_end_date_range,
        to_char(t.tournament_early_bird_end_date,'DD MON YYYY' :: VARCHAR) as tournament_early_bird_end_date_range,
        CONCAT((t.tournament_start_date,'DD MON YYYY'),' - ',(t.tournament_end_date,'DD MON YYYY')) AS tournament_date,
        
        CASE WHEN ft.name IS NULL  THEN
        'Free'
        ELSE 
        ft.name::varchar
        END as tournament_fee_type,
        tf.entry_fee as tournament_entry_fees,
        tf.early_bird_entry_fee as early_bird_entry_fees,
        tf.entry_fee - tf.early_bird_entry_fee as early_bird_discount
        FROM tournament as t 
        LEFT JOIN tournament_type as tt
        ON tt.id = t.tournament_type
        LEFT JOIN venue as v
        ON t.tournament_venue = v.id
        LEFT JOIN city as c
        ON c.id = v.city_id
        LEFT JOIN tournament_fee as tf
        ON tf.tournament_id = t.id
        LEFT JOIN fee_type as ft
        ON ft.id = tf.type
        INNER JOIN state as st
        ON st.id = c.state_id
        INNER JOIN country as cou
        ON cou.id = v.country_id
        WHERE t.id = ${req.body.tournamentID} LIMIT 1;`)


        if (queryString.rowCount) {
            const finalData = queryString.rows[0];
            // REVIEWS
            finalData['tournament_reviews'] = [];

            // ORGANIZERS
            let organizerQuery = await db.query(`SELECT 
            s.subscriber_id,s.username,s.full_name,s.email_id,s.mobile_number,
            torg.additional_email,torg.subscriber_id,
            
            CASE WHEN torg.additional_email =''  THEN
            s.email_id
            ELSE 
            CONCAT(s.email_id,',',torg.additional_email)
            END as append_email,

            CASE WHEN torg.additional_contact IS NULL  THEN
            s.mobile_number::varchar
            ELSE 
            CONCAT(s.mobile_number,',',torg.additional_contact)
            END as append_contact,

            CASE WHEN torg.additional_contact IS NULL  THEN 
            CAST('' AS VARCHAR)
            ELSE 
            CAST(torg.additional_contact AS VARCHAR)
            END as additional_contact

            FROM 
            ${process.env.SCHEMA}.tournament_organizers as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE tournament_id = ${req.body.tournamentID}`);
            finalData['tournament_directors_organizers'] = [];
            finalData['tournament_directors_organizers'][0] = {
                "name": "Organizer",
                "items": (organizerQuery.rowCount) ? organizerQuery.rows : []
            }

            // DIRECTORS
            let directorQuery = await db.query(`SELECT 
            s.subscriber_id,s.username,s.email_id,s.mobile_number,
            torg.additional_email,torg.subscriber_id,
            CASE WHEN torg.additional_email =''  THEN
            s.email_id
            ELSE 
            CONCAT(s.email_id,',',torg.additional_email)
            END as append_email,

            CASE WHEN torg.additional_contact IS NULL  THEN
            s.mobile_number::varchar
            ELSE 
            CONCAT(s.mobile_number,',',torg.additional_contact)
            END as append_contact,
            
            CASE WHEN torg.additional_contact IS NULL  THEN 
            CAST('' AS VARCHAR)
            ELSE 
            CAST(torg.additional_contact AS VARCHAR)
            END as additional_contact

            FROM 
            ${process.env.SCHEMA}.tournament_directors as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE tournament_id = ${req.body.tournamentID}`);
            // finalData['tournament_directors_organizers'][1] = {
            //     "name": "Director",
            //     "items": (directorQuery.rowCount) ? directorQuery.rows : []
            // }

            // SPONSERS
            let sponsersQuery = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.tournament_sponsers WHERE tournament_id = ${req.body.tournamentID}`)
            finalData['tournament_sponsers'] = sponsersQuery.rows;

            // AFFLIATIONS
            let affliations = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.tournament_affliations WHERE tournament_id = ${req.body.tournamentID}`)
            finalData['tournament_affliations'] = affliations.rows;

            // BANNERS AND LOGO
            let tournamentImages = await db.query(`SELECT type,attachment FROM ${process.env.SCHEMA}.tournament_attachment
             WHERE tournament_id = ${req.body.tournamentID}`)

            if (tournamentImages.rowCount) {
                const logo = tournamentImages.rows.filter(item => item.type == 'logo').map(item => item.attachment);
                const banner = tournamentImages.rows.filter(item => item.type == 'banner').map(item => item.attachment);
                finalData['tournament_logo'] = (logo.length) ? logo[0] : '';
                finalData['tournament_banner'] = banner
            }
            else {
                finalData['tournament_logo'] = '';
                finalData['tournament_banner'] = []
            }

            // FEE
            if (finalData['tournament_entry_fees']) {
                finalData['tournament_entry_fees_value'] = finalData['tournament_entry_fees'];
                finalData['tournament_entry_fees'] = 'Rs.' + finalData['tournament_entry_fees'] + '/- per team';
            }
            else {
                finalData['tournament_entry_fees'] = ''
            }
            if (finalData['early_bird_entry_fees'] == 0 || finalData['early_bird_entry_fees']) {
                finalData['early_bird_entry_fees_value'] = finalData['early_bird_entry_fees'];
                finalData['early_bird_entry_fees'] = 'Rs.' + finalData['early_bird_entry_fees'] + '/- per team';
            }
            else {
                finalData['early_bird_entry_fees'] = '';
                finalData['early_bird_entry_fees_value'] = '';
            }
            console.log('finalData.........');
            console.log(finalData);

            return finalData;
        }
        return {};
    }
    catch (err) {

        console.log("cacth error:");
        console.log(err);
        
        return {
            serverError: true,
            error: err.message
        }
    }
}

const organizer = async (req, res) => {
    try {
        let finalData = {};
        let directors = [], organizers = [];
        let ids = await db.query(`SELECT tournament_organizer,tournament_director
        FROM ${process.env.SCHEMA}.tournament WHERE id = ${req.body.tournamentID}`);
        if (ids.rowCount) {
            directors.push(ids.rows[0].tournament_director)
            organizers.push(ids.rows[0].tournament_organizer)
        }
        else {
            throw Error
        }
        let queryString = await db.query(`SELECT username,email_id,mobile_number FROM 
        ${process.env.SCHEMA}.subscriber as s
        INNER JOIN ${process.env.SCHEMA}.tournament as t
        ON s.subscriber_id IN (${organizers})
        WHERE t.id = ${req.body.tournamentID}`);
        if (queryString.rowCount) {
            finalData['organizer'] = queryString.rows;
        }
        queryString = await db.query(`SELECT username,email_id,mobile_number FROM 
        ${process.env.SCHEMA}.subscriber as s
        INNER JOIN ${process.env.SCHEMA}.tournament as t
        ON s.subscriber_id IN (${directors})
        WHERE t.id = ${req.body.tournamentID}`);
        if (queryString.rowCount) {
            finalData['director'] = queryString.rows;
        }

        return finalData;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const eventCategory = async (req, res) => {
    try {
        let search = '';
        if (req.body.search) {
            req.body.search = req.body.search.replace(/'/g, '\'\'');
            search = `AND (e.event_name) ~* '^.*${req.body.search}.*$' `;
        }
        const query = await db.query(`SELECT e.id as event_id,e.event_name,
        et.type,s.id as sports_id,s.sports_name,
        v.venue_name,c.city_name,
        to_char(e.event_start_date,'DY MON DD YYYY') as event_start_date,
        to_char(e.event_end_date,'DY MON DD YYYY') as event_end_date,
        CASE 
        WHEN now() BETWEEN e.register_start_date AND e.register_end_date THEN 1
        WHEN now() > e.register_end_date THEN 2
        WHEN now() < e.register_start_date THEN 3
        END AS status
        FROM ${process.env.SCHEMA}.event AS e
        INNER JOIN ${process.env.SCHEMA}.sports as s
        ON s.id = e.sports_id 
        INNER JOIN ${process.env.SCHEMA}.venue as v 
        ON v.id = e.venue_id
        INNER JOIN ${process.env.SCHEMA}.event_type as et
        ON et.id = e.event_type_id
        INNER JOIN ${process.env.SCHEMA}.city as c
        ON c.id = v.city_id
        WHERE e.tournament_id =${req.body.tournamentID}
        ${search};`);
        if (!query.rowCount) {
            return [];
        }
        let sportsIds = [];
        let result = [];
        const eventIds = query.rows.map(item => item.event_id)
        const attachment = await db.query(`SELECT event_id,attachment FROM event_attachment WHERE event_id IN (${eventIds}) AND type='banner';`);
        query.rows.forEach((item) => {
            if (!sportsIds.includes(item.sports_id)) {
                sportsIds.push(item.sports_id);
                let logo = '';
                if (attachment.rowCount) {
                    logo = attachment.rows.find((att) => att.event_id == item.event_id);
                    logo = (logo) ? logo.attachment : '';
                }
                let sportsObject = {
                    sports_id: item.sports_id,
                    sports_name: item.sports_name,
                    events: [
                        {
                            event_id: item.event_id,
                            event_name: item.event_name,
                            event_type: item.type,
                            event_address: item.venue_name + ', ' + item.city_name,
                            event_start_date: item.event_start_date,
                            event_end_date: item.event_end_date,
                            event_logo: logo,
                            is_registration_open: item.status
                        }
                    ]
                };
                result.push(sportsObject);
            }
            else {
                let logo = '';
                if (attachment.rowCount) {
                    logo = attachment.rows.find((att) => att.event_id == item.event_id);
                    logo = (logo) ? logo.attachment : '';
                }
                const index = result.findIndex((subItem) => subItem.sports_id == item.sports_id)
                if (index != -1) {
                    result[index].events.push({
                        event_id: item.event_id,
                        event_name: item.event_name,
                        event_type: item.type,
                        event_address: item.venue_name + ', ' + item.city_name,
                        event_start_date: item.event_start_date,
                        event_end_date: item.event_end_date,
                        event_logo: logo,
                        is_registration_open: item.status
                    })
                }
            }
        });
        return result;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const prize = async (req, res) => {
}

const location = async (req, res) => {
    try {
        let finalData = {};
        let query = await db.query(`SELECT venue_name,latitude,longitude,city_name,state_name FROM tournament as t 
        LEFT JOIN ${process.env.SCHEMA}.venue as v
        ON t.tournament_venue = v.id
        LEFT JOIN ${process.env.SCHEMA}.city as c
        ON t.tournament_city = c.id
        LEFT JOIN ${process.env.SCHEMA}.state as s
        ON t.tournament_state = s.id
        WHERE t.id= ${req.body.tournamentID};`);
        if (query.rowCount) {
            finalData = query.rows[0];
        }
        return finalData;
    }
    catch (err) {
        return {}
    }
}

const affliation = async (req, res) => {
    try {
        let finalData = {};
        let query = await db.query(`SELECT tournament_affliations FROM ${process.env.SCHEMA}.tournament
        WHERE id = ${req.body.tournamentID};`);
        if (query.rowCount) {
            let affliations = query.rows[0].tournament_affliations;
            if (Array.isArray(affliations)) {
                let tournament_affliations = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.affliations WHERE id IN (${affliations})`)
                finalData['tournament_sponsers'] = tournament_affliations.rows;
                return finalData;
            }
            return finalData;
        }
        return finalData;
    }
    catch (err) {
        console.log(err)
        return {}
    }
}

const event = async (req, res) => {
    try {
        const query = `
        SELECT 
        e.id,e.event_name,e.description,e.amount as event_fee,e.bird_discount as event_bird_fee,
        CASE 
        WHEN e.no_of_team IS NULL THEN ''::varchar
        ELSE e.no_of_team::varchar
        END AS no_of_team,
        e.min_member_per_team,e.max_member_per_team,ag.min_age,ag2.max_age,
        e.min_age_group_id,e.max_age_group_id,
        to_char(e.register_end_date,'DD MON YYYY') as event_registration_end_date,
        e.sports_id,e.player_type_id,pt.type as player_type,
        to_char(e.event_start_date,'DD-MM-YYYY') as dob_validate_date,
        CASE 
        WHEN now() BETWEEN e.register_start_date AND e.register_end_date THEN 1
        WHEN now() > e.register_end_date THEN 2
        WHEN now() < e.register_start_date THEN 3
        END AS is_event_open,
        
        CASE WHEN early_bird_end_date IS NULL  THEN
        ''
        ELSE 
        to_char(e.early_bird_end_date,'DD MON YYYY')
        END as event_early_bird_end_date,
        CONCAT(to_char(e.event_start_date,'DD MON YYYY'),' - ',to_char(e.event_end_date,'DD MON YYYY')) AS event_date,
        et.type
        FROM ${process.env.SCHEMA}.event as e
        INNER JOIN ${process.env.SCHEMA}.event_type as et
        ON et.id = e.event_type_id
        INNER JOIN ${process.env.SCHEMA}.age_group as ag
        ON e.min_age_group_id = ag.id
        INNER JOIN ${process.env.SCHEMA}.age_group as ag2
        ON e.max_age_group_id = ag2.id
        INNER JOIN ${process.env.SCHEMA}.player_type as pt
        ON e.player_type_id = pt.id
        WHERE e.id= ${req.body.eventID};`;
        const eventDetails = await db.query(query);
        if (!eventDetails.rowCount) {
            return {}
        }
        const event = eventDetails.rows[0];
        const eventAttachment = await db.query(`
        SELECT type,attachment FROM ${process.env.SCHEMA}.event_attachment
        WHERE event_id= ${req.body.eventID}`)
        if (eventAttachment.rowCount) {
            let logo = '', eventImages = [];
            eventAttachment.rows.forEach((item) => {
                if (item.type == 'banner') {
                    logo = item.attachment
                }
                else if (item.type == 'other') {
                    eventImages.push(item.attachment)
                }
            })
            event['event_logo'] = logo;
            event['event_banner'] = eventImages
        }
        else {
            event['event_logo'] = '';
            event['event_banner'] = []
        }
        // fee
        if (event['event_fee']) {
            event['event_fee'] = 'Rs.' + event['event_fee'] + '/- per team';
        }
        else {
            event['event_fee'] = '';
        }
        if (event['event_bird_fee']) {
            event['event_bird_fee'] = 'Rs.' + event['event_bird_fee'] + '/- per team';
        }
        else {
            event['event_bird_fee'] = '';
        }
        return event;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const eventMatches = async (req, res) => {
}

const eventReviews = async (req, res) => {
}

const updateTournament = async (req, res) => {
    try {
        let affliationPath = 'images/affliations/';
        let sponserPath = 'images/sponsers/';
        let tournamentPath = 'images/tournaments/';
        let tournamentName = "";
        if (req.body.tournament_name) {
            tournamentName = `tournament_name = '${req.body.tournament_name}',`
        }

        if(req.body.olympics_sports && typeof req.body.olympics_sports !== undefined){
            olympics_sports = `olympics_sports = ${req.body.olympics_sports},`
        }
        else{
           olympics_sports =  `olympics_sports = null,`
        }

        let url = "";
        if (typeof req.body.url!== 'undefined' && req.body.url !=="") {
            url = `url = '${req.body.url}',`
        }
        else {
        	url = `url = null,`
        }

        if(!req.body.olympics_sports || req.body.olympics_sports ==="undefined" || req.body.olympics_sports ==="" || req.body.olympics_sports === 'null'){
            
            var is_champ = `is_champ = false,`;
            
            var olympics_sports = `olympics_sports= null,`;
           
            console.log("if")
        }
        else{
            console.log("else")
           
            is_champ = `is_champ = true,`;
            
            olympics_sports = `olympics_sports = ${req.body.olympics_sports},`;
        }
        console.log("req.body.isTournamentfree.....................");
        console.log(req.body.isTournamentfree);
        
        let tournamentRegistration_fee = "";
        if (req.body.isTournamentfree) {
            tournamentRegistration_fee = `registration_fee = '${req.body.isTournamentfree}',`
            console.log('tournamentRegistration_fee');
            console.log(tournamentRegistration_fee);
        }
        let status = "";
        if (req.body.status) {
            status = `status = ${req.body.status},`
        }

      
        let tournamentDescription = "";
        if (req.body.tournament_description) {

            tournamentDescription = `tournament_description = '${req.body.tournament_description}',`
           

           
        }
        let tournamentVenue = "";
        if (req.body.tournament_venue ) {
            tournamentVenue = `tournament_venue = ${req.body.tournament_venue},`
        }


        let tournamentType = "";
        if (req.body.tournament_type) {
            tournamentType = `tournament_type = ${req.body.tournament_type},`
        }

        
         let venue_other = "";
        if(req.body.tournament_venue == 0){
            
           venue_other = `venue_other = '${req.body.venue_other}',`
        }
        else{

            venue_other = `venue_other = null,`
        }
        let sub_sports = "";
        if(req.body.sub_sports){

            sub_sports = `sub_sports = ${req.body.sub_sports},`
        }



        let tournamentCountry = "";
        if (req.body.tournament_country) {
            tournamentCountry = `tournament_country = ${req.body.tournament_country},`
        }
        let tournamentCity = "";
        if (req.body.tournament_city) {
            tournamentCity = `tournament_city = ${req.body.tournament_city},`
        }
        let tournamentState = "";
        if (req.body.tournament_state) {
            tournamentState = `tournament_state = ${req.body.tournament_state},`
        }
        let tournamentFeeType = "";
        if (req.body.tournament_fee_type) {
            tournamentFeeType = `type = ${req.body.tournament_fee_type},`
        }
        if (req.body.tournament_fee && req.body.alreadyExistsFee) {
            await db.query(`UPDATE ${process.env.SCHEMA}.tournament_fee
            SET ${tournamentFeeType}
            entry_fee = ${req.body.tournament_fee.entry_fees},
            currency = ${req.body.tournament_fee.currency},
            early_bird_entry_fee = ${(req.body.tournament_fee.early_bird_entry_fees) ? req.body.tournament_fee.early_bird_entry_fees : null},
            updated_by = ${req.myID},
            updated_at = now()
            WHERE tournament_id = ${req.body.tournamentID}`)
        }
        if (req.body.tournament_fee && !req.body.alreadyExistsFee && !req.body.isTournamentfree) {
            const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_fee
            (type,entry_fee,early_bird_entry_fee,currency,created_by,created_at,tournament_id) 
            VALUES (${req.body.tournament_fee_type},${req.body.tournament_fee.entry_fees},${req.body.tournament_fee.early_bird_entry_fees},${req.body.tournament_fee.currency},
                ${req.myID},now(),${req.body.tournamentID});`;
				console.log("insert ....................................");
                console.log(insert);

            await db.query(insert);
        }
        if (req.body.isTournamentfree) {
            //await db.query(`DELETE FROM tournament_fee WHERE tournament_id = ${req.body.tournamentID}`);
            await db.query(`UPDATE tournament SET tournament_early_bird_end_date = null WHERE id = ${req.body.tournamentID}`)
        }

        if (req.body.tournament_awards) {
            let award = req.body.tournament_awards;

            console.log('award--------------------------------------------'); 
           console.log(req.body.awards_type_id);
            for (let i of award) {
                if (!i.id) {
                    
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_awards(
                    awards_type,tournament_id)
                    VALUES (${i.awards_type_id}, ${req.body.tournamentID})`)
                }
                else {
                    
                     
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.tournament_awards SET 
                    awards_type = ${i.awards_type_id}  WHERE id = ${i.id};`;

                    console.log(uploadQuery);

                    await db.query(uploadQuery)
                }
            }
        }


        if (req.body.tournament_affliations) {
            let affliations = req.body.tournament_affliations;
            for (let i of affliations) {
                if (!i.id) {
                    let uploadPath = helper.uploadBase64(i.AffLogo.toString(), affliationPath);
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_affliations(
                    name, logo, created_at, tournament_id)
                    VALUES ('${i.personName}', '${uploadPath.path}', now(), ${req.body.tournamentID})`)
                }
                else {
                    let uploadPath
                    if (i.AffLogo && i.AffLogo.length) {
                        uploadPath = helper.uploadBase64(i.AffLogo.toString(), affliationPath);
                        uploadPath = `,logo = '${uploadPath.path}'`;
                    }
                    else {
                        uploadPath = '';
                    }
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.tournament_affliations SET 
                    name = '${i.personName}' ${uploadPath} WHERE id = ${i.id};`;
                    await db.query(uploadQuery)
                }
            }
        }
        if (req.body.tournament_sponsers) {
            let sponsers = req.body.tournament_sponsers;
            for (let i of sponsers) {
                if (!i.id) {
                    let uploadPath = helper.uploadBase64(i.SponserLogo.toString(), sponserPath);
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_sponsers(
                    name, logo, created_at, tournament_id)
                    VALUES ('${i.personName}', '${uploadPath.path}', now(), ${req.body.tournamentID})`)
                }
                else {
                    let uploadPath
                    if (i.SponserLogo && i.SponserLogo.length) {
                        uploadPath = helper.uploadBase64(i.SponserLogo.toString(), sponserPath);
                        uploadPath = `,logo = '${uploadPath.path}'`;
                    }
                    else {
                        uploadPath = '';
                    }
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.tournament_sponsers SET 
                    name = '${i.personName}' ${uploadPath} WHERE id = ${i.id};`;
                    await db.query(uploadQuery)
                }
            }
        }

        //background

        if (req.body.tournament_organizer) {
            let tournamentOrganizer = req.body.tournament_organizer;
            for (let i of tournamentOrganizer) {
                let idName = '', idValue = '';
                if (i.id) {
                    idName = 'id,'
                    idValue = i.id + ',';
                }
                let subName = '', subId = '';
                if (i.subscriberId) {
                    subName = 'subscriber_id,'
                    subId = i.subscriberId + ','
                }
                if (i.additionalContact == '') {
                    i.additionalContact = null; 
                }
                const organizerQuery = `INSERT INTO tournament_organizers (${idName}additional_email,
                    additional_contact,created_at,created_by,${subName}tournament_id)
                VALUES(${idValue}'${i.additionalEmail}',
                ${i.additionalContact},now(),
                ${req.myID},
                ${subId}
                ${req.body.tournamentID}
                ) 
                ON CONFLICT (id) 
                DO
                  UPDATE SET additional_email = EXCLUDED.additional_email,
                  additional_contact = EXCLUDED.additional_contact;`
                await db.query(organizerQuery)
            }
        }

        if (req.body.tournament_director) {
            let tournamentDirector = req.body.tournament_director;
            for (let i of tournamentDirector) {
                let idName = '', idValue = '';
                if (i.id) {
                    idName = 'id,'
                    idValue = i.id + ',';
                }
                let subName = '', subId = '';
                if (i.subscriberId) {
                    subName = 'subscriber_id,'
                    subId = i.subscriberId + ','
                }
                if (i.additionalContact == '') {
                    i.additionalContact = null;
                }

                const directorQuery = `INSERT INTO tournament_directors (${idName}additional_email,
                    additional_contact,created_at,created_by,${subName}tournament_id)
                VALUES(${idValue}'${i.additionalEmail}',
                ${i.additionalContact},now(),
                ${req.myID},
                ${subId}
                ${req.body.tournamentID}
                ) 
                ON CONFLICT (id) 
                DO
                  UPDATE SET additional_email = EXCLUDED.additional_email,
                  additional_contact = EXCLUDED.additional_contact;`
                await db.query(directorQuery)
            }
        }

        let tournamentStartDate = "";
        if (req.body.tournament_start_date) {
            tournamentStartDate = req.body.tournament_start_date.split('-');
            tournamentStartDate = tournamentStartDate[2] + '-' + tournamentStartDate[1] + '-' + tournamentStartDate[0];
            tournamentStartDate = `tournament_start_date = '${tournamentStartDate}',`;
        }
        let tournamentEndDate = "";
        if (req.body.tournament_end_date) {
            tournamentEndDate = req.body.tournament_end_date.split('-');
            tournamentEndDate = tournamentEndDate[2] + '-' + tournamentEndDate[1] + '-' + tournamentEndDate[0];
            tournamentEndDate = `tournament_end_date = '${tournamentEndDate}',`;
        }
        let tournamentStartTime = "";
        if (req.body.tournament_start_time) {
            tournamentStartTime = `tournament_start_time = '${req.body.tournament_start_time}',`
        }

        let tournamentEndTime = "";
        if (req.body.tournament_end_time) {
            tournamentEndTime = `tournament_end_time = '${req.body.tournament_end_time}',`
        }

        let tournamentRegistrationOpenDate = "";
        if (req.body.tournament_registration_open_date) {
            tournamentRegistrationOpenDate = req.body.tournament_registration_open_date.split('-');
            tournamentRegistrationOpenDate = tournamentRegistrationOpenDate[2] + '-' + tournamentRegistrationOpenDate[1] + '-' + tournamentRegistrationOpenDate[0];
            tournamentRegistrationOpenDate = `tournament_registration_open_date = \'${tournamentRegistrationOpenDate}'\,`;
        }
        let tournamentRegistrationEndDate = "";
        if (req.body.tournament_registration_end_date) {
            tournamentRegistrationEndDate = req.body.tournament_registration_end_date.split('-');
            tournamentRegistrationEndDate = tournamentRegistrationEndDate[2] + '-' + tournamentRegistrationEndDate[1] + '-' + tournamentRegistrationEndDate[0];
            tournamentRegistrationEndDate = `tournament_registration_end_date = \'${tournamentRegistrationEndDate}'\,`;
        }
        let tournamentEarlyBirdEndDate = "";
        if (req.body.tournament_early_bird_end_date) {
            tournamentEarlyBirdEndDate = req.body.tournament_early_bird_end_date.split('-');
            tournamentEarlyBirdEndDate = tournamentEarlyBirdEndDate[2] + '-' + tournamentEarlyBirdEndDate[1] + '-' + tournamentEarlyBirdEndDate[0];
            tournamentEarlyBirdEndDate = `tournament_early_bird_end_date = \'${tournamentEarlyBirdEndDate}'\,`;
        }

        if (req.body.removeImages && req.body.removeImages.length) {
            let filesToBeDeleted = await db.query(`SELECT attachment FROM ${process.env.SCHEMA}.tournament_attachment 
            WHERE id in (${req.body.removeImages}) AND tournament_id = ${req.body.tournamentID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.attachment)) {
                        fs.unlinkSync(item.attachment)
                    }
                }
            }

            let deleteQuery = `DELETE FROM ${process.env.SCHEMA}.tournament_attachment 
            WHERE id in (${req.body.removeImages}) AND tournament_id = ${req.body.tournamentID};`
            await db.query(deleteQuery);
        }

        if (req.body.removeDirector && req.body.removeDirector.length) {
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_directors
            WHERE  id IN (${req.body.removeDirector}) AND tournament_id = ${req.body.tournamentID};`)
        }

        if (req.body.removeOrganizer && req.body.removeOrganizer.length) {
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_organizers
            WHERE  id IN (${req.body.removeOrganizer}) AND tournament_id = ${req.body.tournamentID};`)
        }

        if (req.body.tournament_logo && req.body.tournament_logo.length) {
            logo = req.body.tournament_logo;
            logo = helper.uploadBase64(logo[0], tournamentPath + 'logo/');
            let logoNew = logo.path;
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_attachment WHERE tournament_id = ${req.body.tournamentID} AND type = 'logo'`)
            let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
                type,
                attachment,
                created_at,
                created_by,
                status,
                tournament_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${req.body.tournamentID});`
            await db.query(logoQuery);
        }

        if (req.body.removeLogo == 'true') {
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_attachment WHERE tournament_id = ${req.body.tournamentID} AND type = 'logo'`)
        }

        if (req.body.removeAffliate && req.body.removeAffliate.length) {
            let filesToBeDeleted = await db.query(`SELECT logo FROM ${process.env.SCHEMA}.tournament_affliations 
            WHERE id in (${req.body.removeAffliate}) AND tournament_id = ${req.body.tournamentID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.logo)) {
                        fs.unlinkSync(item.logo)
                    }
                }
            }
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_affliations
            WHERE id in (${req.body.removeAffliate}) AND tournament_id = ${req.body.tournamentID};`)
        }

        if (req.body.removeSponser && req.body.removeSponser.length) {
            let filesToBeDeleted = await db.query(`SELECT logo FROM ${process.env.SCHEMA}.tournament_sponsers 
            WHERE id in (${req.body.removeSponser}) AND tournament_id = ${req.body.tournamentID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.logo)) {
                        fs.unlinkSync(item.logo)
                    }
                }
            }
            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_sponsers
            WHERE id in (${req.body.removeSponser}) AND tournament_id = ${req.body.tournamentID};`)
        }

        if(req.body.removeAwards && req.body.removeAwards.length){

            await db.query(`DELETE FROM ${process.env.SCHEMA}.tournament_awards
            WHERE id in (${req.body.removeAwards}) AND tournament_id = ${req.body.tournamentID};`)
        }

        if (req.body.tournament_banner && req.body.tournament_banner.length) {
            let insertBanner = [], banner = req.body.tournament_banner;
            for (let item of banner) {
                const path = helper.uploadBase64(item, tournamentPath + 'banner/');
                insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${req.body.tournamentID})`)
            }
            const jointBanners = insertBanner.join();
            const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
            type,
            attachment,
            created_at,
            created_by,
            status,
            tournament_id) 
            VALUES ${jointBanners};`;
            await db.query(insert);
        }

        if (req.body.background && req.body.background.length) {
            let insertbackground = [], background = req.body.background;
            for (let item of background) {
                const path = helper.uploadBase64(item, tournamentPath + 'background/');
                insertbackground.push(`('background','${path.path}',now(),${req.myID},1,${req.body.tournamentID})`)
            }
            const jointBanners = insertbackground.join();
            const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
            type,
            attachment,
            created_at,
            created_by,
            status,
            tournament_id) 
            VALUES ${jointBanners};`;
            await db.query(insert);
        }
        const query = `UPDATE ${process.env.SCHEMA}.tournament SET 
        ${tournamentName}
        ${olympics_sports}
        ${url}
        ${is_champ}

        ${tournamentRegistration_fee}
        ${tournamentDescription}
        ${tournamentVenue}
        ${tournamentType}
        ${venue_other}
        ${sub_sports}
        ${tournamentCountry}
        ${tournamentCity}
        ${tournamentState}
        ${status}
        ${tournamentStartTime}
        ${tournamentEndTime}
        ${tournamentStartDate}
        ${tournamentEndDate}
        ${tournamentRegistrationOpenDate}
        ${tournamentRegistrationEndDate}
        ${tournamentEarlyBirdEndDate}
        updated_at = now(),
        updated_by = ${req.myID}
        WHERE id = ${req.body.tournamentID}`;
        console.log("query000000000000000000000000000000");
        console.log(query);
        await db.query(query);
        // if(req.body.) 
        let result = {};
        if (typeof (req.body.list) != "undefined" && req.body.list) {
            let listStr = "SELECT _t.id AS tournament_id,_t.tournament_name,_t.status,_t.tournament_description,to_char(_t.created_at,'DD-MM-YYYY') created,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".tournament AS _t  INNER JOIN " + process.env.schema + ".subscriber AS s ON _t.created_by = s.id ORDER BY _t.id";
            const list = await db.query(listStr);
            result.list = list.rows;
        } else {
            result.list = [];
        }
        return result
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const deletedata = async (req, res) => {
    try {
        console.log("123333");

    if(req.body.id && req.body.id !== undefined && req.body.id !==""){
        console.log("id....");
        console.log(req.body.id);
        let statusStr = "UPDATE tournament SET status= 2 ,updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.id + "";
        await db.query(statusStr);

        let stattourafe = "update tournament_affliations set status =2 ,updated_at = now() WHERE tournament_id = "+req.body.id+"";
        await db.query(stattourafe);

        let strtrnatach = "UPDATE tournament_attachment SET status = 2,updated_at =now() WHERE tournament_id = "+req.body.id+"";
        await db.query(strtrnatach);

        let strtrnawrd = "UPDATE tournament_awards SET status =2,updated_at = now() WHERE tournament_id ="+req.body.id+"";
        await db.query(strtrnawrd);

        let strtrnfee ="UPDATE tournament_fee SET status = 2, updated_at = now() WHERE tournament_id ="+req.body.id+" ";
        await db.query(strtrnfee);

        let strtrnorg = "UPDATE tournament_organizers SET status =2, updated_at =now() WHERE tournament_id = "+req.body.id+" ";
        await db.query(strtrnorg);

        let strtrnspon = "UPDATE tournament_sponsers SET status = 2,updated_at = now() WHERE tournament_id = "+req.body.id+"";
        await db.query(strtrnspon);

        console.log("statusStr...."); 
        console.log(statusStr);
        
        return true;
        }

    }catch (err) {
        console.log(err)
        return false;  
    }
}

module.exports = { searchFilter, updateTournament, list, search, organizer, eventCategory, prize, location, affliation, event, eventMatches, eventReviews,deletedata }