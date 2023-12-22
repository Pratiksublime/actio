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
            search = ` AND (olympic_name) ~* '^.*${req.body.search}.*$'`;
        }
        let radius = '';
        if (req.body.radius) {
            radius = ` AND distance < ${req.body.radius}`;
        }
        let type = '';
        if (req.body.type) {
            type = ` AND olympic_type = ${req.body.type}`;
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
        // GET olympics by location
        let queryLocation = `SELECT * FROM(SELECT DISTINCT ON (id)
        id,olympic_name,
        CONCAT(address,', ',city_name) as olympic_venue,
        olympic_start_date,
        olympic_start_month,
        olympic_start_year,
        olympic_start_range,
        olympic_end_range,
        olympic_logo,
        distance,
        entry_fee,
        is_Registration_Open,
        status
        FROM(SELECT t.id,
            t.olympic_name,
            t.olympic_type,
            v.address_1 as address,
             e.sports_id,
             c.city_name,
             c.id as city_id,
             calculate_distance(v.latitude,v.longitude,${req.body.latitude},${req.body.longitude},'K') AS distance,
             to_char(t.olympic_start_date,'DD') as olympic_start_date,
             to_char(t.olympic_end_date,'DD') as olympic_end_date,
             TRIM(to_char(t.olympic_start_date,'Month')) as olympic_start_month,
             TRIM(to_char(t.olympic_end_date,'Month')) as olympic_end_month,
             to_char(t.olympic_start_date,'YYYY') as olympic_start_year,
             to_char(t.olympic_end_date,'YYYY') as olympic_end_year,
             to_char(t.olympic_start_date,'DY MON DD YYYY') as olympic_start_range,
             to_char(t.olympic_end_date,'DY MON DD YYYY') as olympic_end_range,
             ta.attachment as olympic_logo,

             CASE 
             WHEN now() BETWEEN t.olympic_registration_open_date AND t.olympic_registration_end_date THEN 1
             WHEN now() > t.olympic_registration_end_date THEN 2
             WHEN now() < t.olympic_registration_open_date THEN 3
             END AS is_Registration_Open,
             t.status,
             tf.entry_fee
             FROM olympic as t
             INNER JOIN venue as v
             ON t.olympic_venue = v.id
             INNER JOIN city as c
             ON v.city_id = c.id
             LEFT JOIN event as e
             ON e.olympic_id = t.id
             LEFT JOIN olympic_attachment as ta
             ON ta.olympic_id = t.id AND ta.type= 'logo'
             LEFT JOIN olympic_fee as tf
             ON tf.olympic_id = t.id
             ) AS it
             WHERE 1=1
            ${radius} 
            ${type}
            ${city}
            ${sports}
            ${category}
            ${price}
            ${search}
            AND status =1
            ) AS ot
            ORDER BY distance;`
        queryLocation = await db.query(queryLocation);
        finalQuery['nearMe'] = queryLocation.rows;
        if (isFilterQuery) {
            return finalQuery;
        }
        const getAllolympicsQuery = `SELECT t.id,
        t.olympic_name,
        CONCAT(v.venue_name,', ',c.city_name) as venue,
        to_char(t.olympic_start_date,'DD') as olympic_start_date,
        TRIM(to_char(t.olympic_start_date,'Month')) as olympic_start_month,
        to_char(t.olympic_start_date,'YYYY') as olympic_start_year,
        to_char(t.olympic_start_date,'DY MON DD YYYY') as olympic_start_range,
        to_char(t.olympic_end_date,'DY MON DD YYYY') as olympic_end_range,
        ta.attachment as olympic_logo,
        
        CASE 
        WHEN now() BETWEEN t.olympic_registration_open_date AND t.olympic_registration_end_date THEN 1
        WHEN now() > t.olympic_registration_end_date THEN 2
        WHEN now() < t.olympic_registration_open_date THEN 3
        END AS is_Registration_Open

        FROM ${process.env.SCHEMA}.olympic as t
        INNER JOIN ${process.env.SCHEMA}.venue as v
        ON t.olympic_venue = v.id
        INNER JOIN ${process.env.SCHEMA}.city as c
        ON v.city_id = c.id
        LEFT JOIN olympic_attachment as ta
        ON ta.olympic_id = t.id AND ta.type= 'logo'
        WHERE 1=1 
        ${search}
        AND t.status =1
        ORDER BY t.id`;
        const getFavoriteSports = await db.query(`SELECT s.id FROM ${process.env.SCHEMA}.sports AS s INNER JOIN ${process.env.SCHEMA}.subscriber_play AS sp
        ON s.id = sp.sports_id AND sp.subscriber_id = ${req.myID};`);
        if (!getFavoriteSports.rowCount) {
            // GET ALL olympics query
            const allolympics = await db.query(getAllolympicsQuery);
            finalQuery['favorites'] = allolympics.rows;
            return finalQuery;
        };
        const favoritesArray = getFavoriteSports.rows.map(item => item.id);
        let getolympicFavorites = await db.query(`SELECT olympic_id FROM ${process.env.SCHEMA}.event WHERE sports_id IN (${favoritesArray}) GROUP BY olympic_id;`);
        if (!getolympicFavorites.rowCount) {
            // GET ALL olympics query
            const allolympics = await db.query(getAllolympicsQuery);
            finalQuery['favorites'] = allolympics.rows;
            return finalQuery;
        };
        const olympicRows = getolympicFavorites.rows.map(item => item.olympic_id);
        // GET MATCHING olympics by ids 
        let getolympicFavoritesDetails = await db.query(`SELECT t.id,
        t.olympic_name,
        CONCAT(v.venue_name,', ',c.city_name) as venue,
        to_char(t.olympic_start_date,'DD') as olympic_start_date,
        TRIM(to_char(t.olympic_start_date,'Month')) as olympic_start_month,
        to_char(t.olympic_start_date,'YYYY') as olympic_start_year,
        to_char(t.olympic_start_date,'DY MON DD YYYY') as olympic_start_range,
        to_char(t.olympic_end_date,'DY MON DD YYYY') as olympic_end_range,
        ta.attachment as olympic_logo,

        CASE 
        WHEN now() BETWEEN t.olympic_registration_open_date AND t.olympic_registration_end_date THEN 1
        WHEN now() > t.olympic_registration_end_date THEN 2
        WHEN now() < t.olympic_registration_open_date THEN 3
        END AS is_Registration_Open

        FROM ${process.env.SCHEMA}.olympic as t
        INNER JOIN ${process.env.SCHEMA}.venue as v
        ON t.olympic_venue = v.id 
        INNER JOIN ${process.env.SCHEMA}.city as c
        ON v.city_id = c.id 
        LEFT JOIN olympic_attachment as ta
        ON ta.olympic_id = t.id AND ta.type= 'logo'
        WHERE t.id IN (${olympicRows})
        ${search}
        AND t.status =1
        ORDER BY t.id`);
        if (!getolympicFavoritesDetails.rowCount) {
            // GET ALL olympics query
            const allolympics = await db.query(getAllolympicsQuery);
            finalQuery['favorites'] = allolympics.rows;
            return finalQuery;
        }
        finalQuery['favorites'] = getolympicFavoritesDetails.rows;
        return finalQuery;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}


const list_new = async (req) => {
    try {
        let finalQuery = {};
        let queryLocation = `SELECT * FROM olympic where status=1;`
        queryLocation = await db.query(queryLocation);
        finalQuery['list'] = queryLocation.rows;
        
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
            search = ` AND (olympic_name) ~* '^.*${req.body.search}.*$'`;
        }
        let radius = '';
        if (req.body.radius) {
            radius = ` AND distance < ${req.body.radius}`;
        }
        let type = '';
        if (req.body.type) {
            type = ` AND olympic_type = ${req.body.type}`;
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
        id,olympic_name,
        CONCAT(address,', ',city_name) as olympic_venue,
        olympic_start_date,
        olympic_start_month,
        olympic_start_year,
        olympic_start_range,
        olympic_end_range,
        olympic_logo,
        is_Registration_Open
        FROM(SELECT t.id,
            t.olympic_name,
            t.olympic_type,
            v.address_1 as address,
             e.sports_id,
             c.city_name,
             c.id as city_id,
             calculate_distance(v.latitude,v.longitude,${req.body.latitude},${req.body.longitude},'K') AS distance,
             to_char(t.olympic_start_date,'DD') as olympic_start_date,
             to_char(t.olympic_end_date,'DD') as olympic_end_date,
             TRIM(to_char(t.olympic_start_date,'Month')) as olympic_start_month,
             TRIM(to_char(t.olympic_end_date,'Month')) as olympic_end_month,
             to_char(t.olympic_start_date,'YYYY') as olympic_start_year,
             to_char(t.olympic_end_date,'YYYY') as olympic_end_year,
             to_char(t.olympic_start_date,'DY MON DD YYYY') as olympic_start_range,
             to_char(t.olympic_end_date,'DY MON DD YYYY') as olympic_end_range,
             t.olympic_logo,
             t.status AS is_Registration_Open,
             ((t.olympic_fee->>'entry_fees')::int) as entry_fee
             FROM olympic as t
             INNER JOIN venue as v
             ON t.olympic_venue = v.id
             INNER JOIN city as c
             ON v.city_id = c.id
             LEFT JOIN event as e
             ON e.olympic_id = t.id) AS it
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
        //         let fee = +item.olympic_fee.entry_fees
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
        let queryString = await db.query(`
        SELECT t.id,t.olympic_name,t.olympic_description,tt.name as olympic_type,
        v.id as venue_id,
        v.venue_name as olympic_venue,CONCAT(v.address_1,', ',c.city_name,', ',v.zip_code) as olympic_address,
        
        CASE WHEN cast(v.latitude as varchar) IS NULL  THEN 
        CAST('0.000' AS VARCHAR)
        ELSE 
        CAST(v.latitude AS VARCHAR)
        END as olympic_lat,

        CASE WHEN cast(v.longitude as varchar) IS NULL  THEN 
        CAST('0.000' AS VARCHAR)
        ELSE 
        CAST(v.longitude AS VARCHAR)
        END as olympic_long,

        c.city_name as olympic_city_name,
        st.state_name as olympic_state_name,
        cou.name as olympic_country_name,
        to_char(t.olympic_start_date,'DD-MM-YYYY') as olympic_start_date,
        to_char(t.olympic_end_date,'DD-MM-YYYY') as olympic_end_date,
        to_char(t.olympic_registration_open_date,'DD-MM-YYYY') as olympic_registration_open_date,
        to_char(t.olympic_registration_end_date,'DD-MM-YYYY') as olympic_registration_end_date,
        to_char(t.olympic_early_bird_end_date,'DD-MM-YYYY') as olympic_early_bird_end_date,
        to_char(t.olympic_start_time,'HH12:MI AM') as olympic_start_time,
        to_char(t.olympic_end_time,'HH12:MI AM') as olympic_end_time,
        to_char(t.olympic_start_time,'HH24:MI:SS') as olympic_start_time_2,
        to_char(t.olympic_end_time,'HH24:MI:SS') as olympic_end_time_2,
        to_char(t.olympic_registration_end_date,'DD MON YYYY') as olympic_registration_end_date_range,
        to_char(t.olympic_early_bird_end_date,'DD MON YYYY') as olympic_early_bird_end_date_range,
        CONCAT(to_char(t.olympic_start_date,'DD MON YYYY'),' - ',to_char(t.olympic_end_date,'DD MON YYYY')) AS olympic_date,
        
        CASE WHEN ft.name IS NULL  THEN
        'Free'
        ELSE 
        ft.name::varchar
        END as olympic_fee_type,
		tf.entry_fee as olympic_entry_fees,
        tf.early_bird_entry_fee as early_bird_entry_fees,
        tf.entry_fee - tf.early_bird_entry_fee as early_bird_discount
        FROM olympic as t 
        LEFT JOIN olympic_type as tt
        ON tt.id = t.olympic_type
        LEFT JOIN venue as v
        ON t.olympic_venue = v.id
        LEFT JOIN city as c
        ON c.id = v.city_id
		LEFT JOIN olympic_fee as tf
        ON tf.olympic_id = t.id
        LEFT JOIN fee_type as ft
        ON ft.id = tf.type
        INNER JOIN state as st
        ON st.id = c.state_id
        INNER JOIN country as cou
        ON cou.id = v.country_id
		WHERE t.id = ${req.body.olympicID} LIMIT 1;`)

        if (queryString.rowCount) {
            const finalData = queryString.rows[0];
            // REVIEWS
            finalData['olympic_reviews'] = [];

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
            ${process.env.SCHEMA}.olympic_organizers as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE olympic_id = ${req.body.olympicID}`);
            finalData['olympic_directors_organizers'] = [];
            finalData['olympic_directors_organizers'][0] = {
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
            ${process.env.SCHEMA}.olympic_directors as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE olympic_id = ${req.body.olympicID}`);
            // finalData['olympic_directors_organizers'][1] = {
            //     "name": "Director",
            //     "items": (directorQuery.rowCount) ? directorQuery.rows : []
            // }

            // SPONSERS
            let sponsersQuery = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.olympic_sponsers WHERE olympic_id = ${req.body.olympicID}`)
            finalData['olympic_sponsers'] = sponsersQuery.rows;

            // AFFLIATIONS
            let affliations = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.olympic_affliations WHERE olympic_id = ${req.body.olympicID}`)
            finalData['olympic_affliations'] = affliations.rows;

            // BANNERS AND LOGO
            let olympicImages = await db.query(`SELECT type,attachment FROM ${process.env.SCHEMA}.olympic_attachment
             WHERE olympic_id = ${req.body.olympicID}`)

            if (olympicImages.rowCount) {
                const logo = olympicImages.rows.filter(item => item.type == 'logo').map(item => item.attachment);
                const banner = olympicImages.rows.filter(item => item.type == 'banner').map(item => item.attachment);
                finalData['olympic_logo'] = (logo.length) ? logo[0] : '';
                finalData['olympic_banner'] = banner
            }
            else {
                finalData['olympic_logo'] = '';
                finalData['olympic_banner'] = []
            }

            // FEE
            if (finalData['olympic_entry_fees']) {
                finalData['olympic_entry_fees_value'] = finalData['olympic_entry_fees'];
                finalData['olympic_entry_fees'] = 'Rs.' + finalData['olympic_entry_fees'] + '/- per team';
            }
            else {
                finalData['olympic_entry_fees'] = ''
            }
            if (finalData['early_bird_entry_fees'] == 0 || finalData['early_bird_entry_fees']) {
                finalData['early_bird_entry_fees_value'] = finalData['early_bird_entry_fees'];
                finalData['early_bird_entry_fees'] = 'Rs.' + finalData['early_bird_entry_fees'] + '/- per team';
            }
            else {
                finalData['early_bird_entry_fees'] = '';
                finalData['early_bird_entry_fees_value'] = '';
            }

            return finalData;
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

const organizer = async (req, res) => {
    try {
        let finalData = {};
        let directors = [], organizers = [];
        let ids = await db.query(`SELECT olympic_organizer,olympic_director
        FROM ${process.env.SCHEMA}.olympic WHERE id = ${req.body.olympicID}`);
        if (ids.rowCount) {
            directors.push(ids.rows[0].olympic_director)
            organizers.push(ids.rows[0].olympic_organizer)
        }
        else {
            throw Error
        }
        let queryString = await db.query(`SELECT username,email_id,mobile_number FROM 
        ${process.env.SCHEMA}.subscriber as s
        INNER JOIN ${process.env.SCHEMA}.olympic as t
        ON s.subscriber_id IN (${organizers})
        WHERE t.id = ${req.body.olympicID}`);
        if (queryString.rowCount) {
            finalData['organizer'] = queryString.rows;
        }
        queryString = await db.query(`SELECT username,email_id,mobile_number FROM 
        ${process.env.SCHEMA}.subscriber as s
        INNER JOIN ${process.env.SCHEMA}.olympic as t
        ON s.subscriber_id IN (${directors})
        WHERE t.id = ${req.body.olympicID}`);
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
        WHERE e.olympic_id =${req.body.olympicID}
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
        let query = await db.query(`SELECT venue_name,latitude,longitude,city_name,state_name FROM olympic as t 
        LEFT JOIN ${process.env.SCHEMA}.venue as v
        ON t.olympic_venue = v.id
        LEFT JOIN ${process.env.SCHEMA}.city as c
        ON t.olympic_city = c.id
        LEFT JOIN ${process.env.SCHEMA}.state as s
        ON t.olympic_state = s.id
        WHERE t.id= ${req.body.olympicID};`);
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
        let query = await db.query(`SELECT olympic_affliations FROM ${process.env.SCHEMA}.olympic
        WHERE id = ${req.body.olympicID};`);
        if (query.rowCount) {
            let affliations = query.rows[0].olympic_affliations;
            if (Array.isArray(affliations)) {
                let olympic_affliations = await db.query(`SELECT name,logo FROM ${process.env.SCHEMA}.affliations WHERE id IN (${affliations})`)
                finalData['olympic_sponsers'] = olympic_affliations.rows;
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

const updateolympic = async (req, res) => {
    try {
        console.log('wwwwwwwwwwwwwwwwwwww');
        let affliationPath = 'images/affliations/';
        let sponserPath = 'images/sponsers/';
        let olympicPath = 'images/olympics/';
        let olympicName = "";
        console.log('demo2');
        console.log(req.body.olympicID);
        if (req.body.olympic_name) {
            olympicName = `olympic_name = '${req.body.olympic_name}',`
        }

        if (req.body.olympic_sports) {
            olympicSport = `olympic_sports = '${req.body.olympic_sports}',`
        }

        let status = "";
        if (req.body.status) {
            status = `status = ${req.body.status},`
        }
        let olympicDescription = "";
        if (req.body.olympic_description) {
            olympicDescription = `olympic_description = '${req.body.olympic_description}',`
        }
        let olympicVenue = "";
        if (req.body.olympic_venue) {
            olympicVenue = `olympic_venue = ${req.body.olympic_venue},`
        }
        let olympicType = "";
        if (req.body.olympic_type) {
            olympicType = `olympic_type = ${req.body.olympic_type},`
        }
        let olympicCountry = "";
        if (req.body.olympic_country) {
            olympicCountry = `olympic_country = ${req.body.olympic_country},`
        }
        let olympicCity = "";
        if (req.body.olympic_city || req.body.olympic_city !== null || req.body.olympic_city!== "") {
            olympicCity = `olympic_city = ${req.body.olympic_city},`
        }
        else{
            console.log("333333333333333");
            olympicCity = `olympic_city = null,` 
        }
        let olympicState = "";
        if (req.body.olympic_state) {
            olympicState = `olympic_state = ${req.body.olympic_state},`
        }
        let olympicFeeType = "";
        /*if (req.body.olympic_fee_type) {
            olympicFeeType = `type = ${req.body.olympic_fee_type},`
        }*/
        /*if (req.body.olympic_fee && req.body.alreadyExistsFee) {
            await db.query(`UPDATE ${process.env.SCHEMA}.olympic_fee
            SET ${olympicFeeType}
            entry_fee = ${req.body.olympic_fee.entry_fees},
            early_bird_entry_fee = ${(req.body.olympic_fee.early_bird_entry_fees) ? req.body.olympic_fee.early_bird_entry_fees : null},
            updated_by = ${req.myID},
            updated_at = now()
            WHERE olympic_id = ${req.body.olympicID}`)
        }*/
        /*if (req.body.olympic_fee && !req.body.alreadyExistsFee && !req.body.isolympicfree) {
            const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_fee
            (type,entry_fee,early_bird_entry_fee,created_by,created_at,olympic_id) 
            VALUES (${req.body.olympic_fee_type},${req.body.olympic_fee.entry_fees},${req.body.olympic_fee.early_bird_entry_fees},
                ${req.myID},now(),${req.body.olympicID});`;
            await db.query(insert);
        }
        if (req.body.isolympicfree) {
            await db.query(`DELETE FROM olympic_fee WHERE olympic_id = ${req.body.olympicID}`);
            await db.query(`UPDATE olympic SET olympic_early_bird_end_date = null WHERE id = ${req.body.olympicID}`)
        }*/
        if (req.body.olympic_affliations) {
            let affliations = req.body.olympic_affliations;
            for (let i of affliations) {
                console.log('101');
                var uploadPath = '';
                if (!i.id) {
                     uploadPath = helper.uploadBase64(i.AffLogo.toString(), affliationPath);
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_affliations(
                    name, logo, created_at, olympic_id)
                    VALUES ('${i.personName}', '${uploadPath.path}', now(), ${req.body.olympicID})`)
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
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.olympic_affliations SET 
                    name = '${i.personName}' ${uploadPath} WHERE id = ${i.id};`;

                    console.log('olympic_affliations uploadQuery+++++++++++++++++++++++');
                    console.log(uploadQuery);

                    await db.query(uploadQuery)
                }
            }
        }

        if (req.body.olympic_awards) {
            console.log('req.body.olympic_awards///////////////////////');
            console.log(req.body.olympic_awards);
            let affliations = req.body.olympic_awards;
            for (let i of affliations) {
                if (!i.id) {
                    //let uploadPath = helper.uploadBase64(i.logo.toString(), affliationPath);
                    /*await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                    name, logo, created_at, olympic_id)
                    VALUES ('${i.personName}', '${uploadPath.path}', now(), ${req.body.olympicID})`)*/
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                    awards_type, created_at, olympic_id)
                    VALUES ('${i.awards_type_id}', now(), ${req.body.olympicID})`)
                }
                else {
                    
                    
                    /*let uploadQuery = `UPDATE ${process.env.SCHEMA}.olympic_awards SET 
                    name = '${i.personName}' ${uploadPath} WHERE id = ${i.id};`;
                    await db.query(uploadQuery)*/
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.olympic_awards SET 
                    awards_type = '${i.awards_type_id}' WHERE id = ${i.id};`;

                   console.log(' olympic_awardsuploadQuery----------------------');
                    console.log(uploadQuery);
                    await db.query(uploadQuery)
                }
            }
        }

        console.log("req.body.olympic_sponsers: ++++-----");
        console.log(req.body.olympic_sponsers);
        console.log(typeof req.body.olympic_sponsers)

        if (req.body.olympic_sponsers) {
            console.log('sponsers');
           console.log(req.body.olympic_sponsers);
            let sponsers = req.body.olympic_sponsers;
            for (let i of sponsers) {
                if (!i.id) {
                    let uploadPath = helper.uploadBase64(i.SponserLogo.toString(), sponserPath);

                    await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_sponsers(
                    name, logo, created_at, olympic_id)
                    VALUES ('${i.personName}', '${uploadPath.path}', now(), ${req.body.olympicID})`)
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
                    let uploadQuery = `UPDATE ${process.env.SCHEMA}.olympic_sponsers SET 
                    name = '${i.personName}' ${uploadPath} WHERE id = ${i.id};`;

                    console.log('uploadQuery=================================');
                    console.log(uploadQuery);
                    await db.query(uploadQuery)
                }
            }
        }

       

        if (req.body.olympic_organizer) {
            let olympicOrganizer = req.body.olympic_organizer;
            for (let i of olympicOrganizer) {
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
                const organizerQuery = `INSERT INTO olympic_organizers (${idName}additional_email,
                    additional_contact,created_at,created_by,${subName}olympic_id)
                VALUES(${idValue}'${i.additionalEmail}',
                ${i.additionalContact},now(),
                ${req.myID},
                ${subId}
                ${req.body.olympicID}
                ) 
                ON CONFLICT (id) 
                DO
                  UPDATE SET additional_email = EXCLUDED.additional_email,
                  additional_contact = EXCLUDED.additional_contact;`

                  console.log('organizerQuery]]]]]]]]]]]]]]]]]]]]]]]]');
                  console.log(organizerQuery);
                await db.query(organizerQuery)
            }
        }

        /*if (req.body.olympic_director) {
            let olympicDirector = req.body.olympic_director;
            for (let i of olympicDirector) {
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

                const directorQuery = `INSERT INTO olympic_directors (${idName}additional_email,
                    additional_contact,created_at,created_by,${subName}olympic_id)
                VALUES(${idValue}'${i.additionalEmail}',
                ${i.additionalContact},now(),
                ${req.myID},
                ${subId}
                ${req.body.olympicID}
                ) 
                ON CONFLICT (id) 
                DO
                  UPDATE SET additional_email = EXCLUDED.additional_email,
                  additional_contact = EXCLUDED.additional_contact;`
                await db.query(directorQuery)
            }
        }*/

        let olympicStartDate = "";
        if (req.body.olympic_start_date) {
            /*olympicStartDate = req.body.olympic_start_date.split('-');
            olympicStartDate = olympicStartDate[2] + '-' + olympicStartDate[1] + '-' + olympicStartDate[0];
            olympicStartDate = `olympic_start_date = '${olympicStartDate}',`;*/
            olympicStartDate = `olympic_start_date = '${req.body.olympic_start_date}',`;
        }
        let olympicEndDate = "";
        if (req.body.olympic_end_date) {
            /*olympicEndDate = req.body.olympic_end_date.split('-');
            olympicEndDate = olympicEndDate[2] + '-' + olympicEndDate[1] + '-' + olympicEndDate[0];
            olympicEndDate = `olympic_end_date = '${olympicEndDate}',`;*/
            olympicEndDate = `olympic_end_date = '${req.body.olympic_end_date}',`;
        }
        let olympicStartTime = "";
        if (req.body.olympic_start_time) {
            olympicStartTime = `olympic_start_time = '${req.body.olympic_start_time}',`
        }

        let olympicEndTime = "";
        if (req.body.olympic_end_time) {
            olympicEndTime = `olympic_end_time = '${req.body.olympic_end_time}',`
        }

        /*let olympicRegistrationOpenDate = "";
        if (req.body.olympic_registration_open_date) {
            olympicRegistrationOpenDate = req.body.olympic_registration_open_date.split('-');
            olympicRegistrationOpenDate = olympicRegistrationOpenDate[2] + '-' + olympicRegistrationOpenDate[1] + '-' + olympicRegistrationOpenDate[0];
            olympicRegistrationOpenDate = `olympic_registration_open_date = \'${olympicRegistrationOpenDate}'\,`;
        }
        let olympicRegistrationEndDate = "";
        if (req.body.olympic_registration_end_date) {
            olympicRegistrationEndDate = req.body.olympic_registration_end_date.split('-');
            olympicRegistrationEndDate = olympicRegistrationEndDate[2] + '-' + olympicRegistrationEndDate[1] + '-' + olympicRegistrationEndDate[0];
            olympicRegistrationEndDate = `olympic_registration_end_date = \'${olympicRegistrationEndDate}'\,`;
        }
        let olympicEarlyBirdEndDate = "";
        if (req.body.olympic_early_bird_end_date) {
            olympicEarlyBirdEndDate = req.body.olympic_early_bird_end_date.split('-');
            olympicEarlyBirdEndDate = olympicEarlyBirdEndDate[2] + '-' + olympicEarlyBirdEndDate[1] + '-' + olympicEarlyBirdEndDate[0];
            olympicEarlyBirdEndDate = `olympic_early_bird_end_date = \'${olympicEarlyBirdEndDate}'\,`;
        }*/
        console.log('demo');


        if (req.body.removeImages && req.body.removeImages.length) {
            let filesToBeDeleted = await db.query(`SELECT attachment FROM ${process.env.SCHEMA}.olympic_attachment 
            WHERE id in (${req.body.removeImages}) AND olympic_id = ${req.body.olympicID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.attachment)) {
                        fs.unlinkSync(item.attachment)
                    }
                }
            }

            let deleteQuery = `DELETE FROM ${process.env.SCHEMA}.olympic_attachment 
            WHERE id in (${req.body.removeImages}) AND olympic_id = ${req.body.olympicID};`  

            console.log('deleteQuery'); 
            console.log(deleteQuery);

            await db.query(deleteQuery);
        }
console.log("deo");
        if (req.body.removeDirector && req.body.removeDirector.length) {
            console.log('req.body.removeDirector,..........');
            console.log(req.body.removeDirector);
            let deleteQueryone = `DELETE FROM olympic_directors
            WHERE  id IN (${req.body.removeDirector}) AND olympic_id = ${req.body.olympicID};` 
            
            console.log('deleteQueryone1111111111111111111111111111111111111111'); 
            console.log(deleteQueryone)
            await db.query(deleteQueryone);

            
        }
        console.log("meo");

        if (req.body.removeOrganizer && req.body.removeOrganizer.length) {

          var deleteQuerytwo = `DELETE FROM ${process.env.SCHEMA}.olympic_organizers
            WHERE  id IN (${req.body.removeOrganizer}) AND olympic_id = ${req.body.olympicID};`
            console.log('deleteQueryone222222222222222222222222222222222');
            console.log(deleteQuerytwo)
            await db.query(deleteQuerytwo);
        }
        console.log("jio");

        if (req.body.olympic_logo && req.body.olympic_logo.length) {
            logo = req.body.olympic_logo;
            logo = helper.uploadBase64(logo[0], olympicPath + 'logo/');
            let logoNew = logo.path;
            await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_attachment WHERE olympic_id = ${req.body.olympicID} AND type = 'logo'`)
            let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                type,
                attachment,
                created_at,
                created_by,
                status,
                olympic_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${req.body.olympicID});`
            await db.query(logoQuery);
        }

        // if (req.body.olympic_tile && req.body.olympic_tile.length) {
        //     logo = req.body.olympic_logo;
        //     logo = helper.uploadBase64(logo[0], olympicPath + 'logo/');
        //     let logoNew = logo.path;
        //     await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_attachment WHERE olympic_id = ${req.body.olympicID} AND type = 'logo'`)
        //     let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
        //         type,
        //         attachment,
        //         created_at,
        //         created_by,
        //         status,
        //         olympic_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${req.body.olympicID});`
        //     await db.query(logoQuery);
        // }
        console.log("piooo");

        if (req.body.removeLogo == 'true') {
            await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_attachment WHERE olympic_id = ${req.body.olympicID} AND type = 'logo'`)
        }

        if (req.body.removeAffliate && req.body.removeAffliate.length) {
            let filesToBeDeleted = await db.query(`SELECT logo FROM ${process.env.SCHEMA}.olympic_affliations 
            WHERE id in (${req.body.removeAffliate}) AND olympic_id = ${req.body.olympicID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.logo)) {
                        fs.unlinkSync(item.logo)
                    }
                }
            }
            await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_affliations
            WHERE id in (${req.body.removeAffliate}) AND olympic_id = ${req.body.olympicID};`)
        }
        console.log('bheeo');

        if (req.body.removeAwards && req.body.removeAwards.length) {

            // var deleteaward = `SELECT * FROM ${process.env.SCHEMA}.olympic_awards 
            // WHERE id in (${req.body.removeAwards}) AND olympic_id = ${req.body.olympicID};`
            // let filesToBeDeleted = await db.query(deleteaward);
            // if (filesToBeDeleted.rowCount) {
            //     for (let item of filesToBeDeleted.rows) {
            //         if (fs.existsSync(item.logo)) {
            //             fs.unlinkSync(item.logo)
            //         }
            //     }
            // }
            await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_awards
            WHERE id in (${req.body.removeAwards}) AND olympic_id = ${req.body.olympicID};`)
        }
        console.log("meeeeeeee");

        if (req.body.removeSponser && req.body.removeSponser.length) {
            let filesToBeDeleted = await db.query(`SELECT logo FROM ${process.env.SCHEMA}.olympic_sponsers 
            WHERE id in (${req.body.removeSponser}) AND olympic_id = ${req.body.olympicID}`);
            if (filesToBeDeleted.rowCount) {
                for (let item of filesToBeDeleted.rows) {
                    if (fs.existsSync(item.logo)) {
                        fs.unlinkSync(item.logo)
                    }
                }
            }
            await db.query(`DELETE FROM ${process.env.SCHEMA}.olympic_sponsers
            WHERE id in (${req.body.removeSponser}) AND olympic_id = ${req.body.olympicID};`)
        }
        console.log("rooooooooo");

        if (req.body.olympic_banner && req.body.olympic_banner.length) {
            let insertBanner = [], banner = req.body.olympic_banner;
            for (let item of banner) {
                const path = helper.uploadBase64(item, olympicPath + 'banner/');
                insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${req.body.olympicID})`)
            }
            const jointBanners = insertBanner.join();
            const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
            type,
            attachment,
            created_at,
            created_by,
            status,
            olympic_id) 
            VALUES ${jointBanners};`;

           console.log('insert');
            console.log(insert);
            await db.query(insert);
        }

        if (req.body.olympics_tile && req.body.olympics_tile.length) {
            let insertBanner = [], background = req.body.olympics_tile;
            for (let item of background) {
                const path = helper.uploadBase64(item, olympicPath + 'banner/');
                insertBanner.push(`('background','${path.path}',now(),${req.myID},1,${req.body.olympicID})`)
            }
            const jointBanners = insertBanner.join();
            const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
            type,
            attachment,
            created_at,
            created_by,
            status,
            olympic_id) 
            VALUES ${jointBanners};`;

           console.log('insert');
            console.log(insert);
            await db.query(insert);
        }
        
        const query = `UPDATE ${process.env.SCHEMA}.olympic SET 
        ${olympicName}
        ${olympicSport}
        ${olympicDescription}
        ${olympicVenue}
        ${olympicType}
        ${olympicCountry}
        ${olympicCity}
        ${olympicState}
        ${status}
        ${olympicStartTime}
        ${olympicEndTime}
        ${olympicStartDate}
        ${olympicEndDate}
        updated_at = now(),
        updated_by = ${req.myID}
        WHERE id = ${req.body.olympicID}`;

        console.log("update query: ");
        console.log(query);

        await db.query(query);
         //if(req.body.) 
        let result = {};
        if (typeof (req.body.list) != "undefined" && req.body.list) {
             let listStr = "SELECT _t.id AS olympic_id,_t.olympic_name,_t.status,_t.olympic_description,to_char(_t.created_at,'DD-MM-YYYY') created,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".olympic AS _t  INNER JOIN " + process.env.schema + ".subscriber AS s ON _t.created_by = s.id ORDER BY _t.id";
             const list = await db.query(listStr);
             result.list = list.rows;
         } else {
             result.list = [];
         }
        return result
    }
    catch (err) {
        console.log(err);
        console.log("serverError: ");
        console.log(err);

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
        let statusStr = "UPDATE olympic SET status= 2 ,updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.id + "";
        
        let strolafns ="UPDATE olympic_affliations SET status = 2 ,updated_at = now() WHERE olympic_id = "+req.body.id+"";
        await db.query(strolafns);


        let strolatt = "UPDATE olympic_attachment SET status = 2,updated_at = now() WHERE olympic_id = "+req.body.id+" ";
        await db.query(strolatt);

        let strolawd = "UPDATE olympic_awards SET status =2,updated_at = now() WHERE olympic_id = "+req.body.id+"";
        await db.query(strolawd);

        let strolorg = "UPDATE olympic_organizers SET status = 2,updated_at =now() WHERE olympic_id = "+req.body.id+"";
        await db.query(strolorg);

        let strolspon = "UPDATE olympic_sponsers SET status = 2,updated_at = now() WHERE olympic_id = "+req.body.id+" ";
        await db.query(strolspon);

        console.log("statusStr....");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    }
    } catch (err) {
        console.log(err)
        return false;  
    }
}

module.exports = { searchFilter, updateolympic, list, search, organizer, eventCategory, prize, location, affliation, event, eventMatches, eventReviews,deletedata }