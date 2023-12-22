const { Query } = require('pg');
const db = require('../../db');
const helper = require('../../helper/helper');

const olympic = async (req, res) => {
    const result = {};
    try {
        result.add = false; result.update = false;
        if ((typeof (req.body.name) != "undefined" && req.body.name != "") || (typeof (req.body.olympicID) != "undefined" && req.body.olympicID != "")) {
            let id = ""; let idval = "";
            if ((typeof (req.body.olympicID) != "undefined" && req.body.olympicID != "")) {
                id = "id,"; idval = req.body.olympicID + ",";
                result.update = true;
            }

            let name = ""; let nameval = ""; let updatename = "";
            if ((typeof (req.body.name) != "undefined" && req.body.name != "")) {
                name = "olympic_name,"; nameval = "$$" + req.body.name + "$$,";
                updatename = ",olympic_name=$$" + req.body.name + "$$ ";
            }

            let updatedescription = "";
            if ((typeof (req.body.description) != "undefined" && req.body.description != "")) {
                updatedescription = ",description=$$" + req.body.description + "$$ ";
            }

            let status = 1;
            if ((typeof (req.body.status) != "undefined" && req.body.status != "")) {
                status = req.body.status;
            }

            let olympicStr = "INSERT INTO " + process.env.schema + ".olympic (" + id + "olympic_name,status,description,created_by) VALUES (" + idval + "$$" + req.body.name + "$$," + status + ",$$" + req.body.description + "$$," + req.myID + ") ON CONFLICT (id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + " " + updatename + " , status=" + status + " " + updatedescription + " ";
            await db.query(olympicStr);
            result.add = true;
        }
         if (typeof (req.body.list) != "undefined" && req.body.list) {
            let listStr = "SELECT _t.id AS olympic_id,_t.olympic_name,_t.olympic_sports as sport_id,_t.status,_t.olympic_description,to_char(_t.created_at,'DD-MM-YYYY') created,to_char(_t.olympic_start_date,'DD-MM-YYYY') start_date,to_char(_t.olympic_end_date,'DD-MM-YYYY') end_date,_t.olympic_start_time as start_time,_t.olympic_end_time as end_time,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".olympic AS _t  INNER JOIN " + process.env.schema + ".subscriber AS s ON _t.created_by = s.id where _t.status =1 ORDER BY _t.id DESC";
            const list = await db.query(listStr); 
            
            var data = list.rows;
            for (var i = 0; i < data.length; i++) {
            
            let sportStr = "SELECT  sports_name FROM sports WHERE id in (" + data[i].sport_id + ")";
            let sportStr_data = await db.query(sportStr);
            
            data[i].sport_list = sportStr_data.rows;

        }
        result.list = list.rows;
           
     } 

    else {
            result.list = [];
        }
        if (req.body.olympicDetail) {

            console.log("req.body.olympicDetail: ");
            console.log(req.body.olympicDetail);

            let queryString = `
           SELECT t.id,
           t.olympic_name,
           t.olympic_description,
           t.olympic_type,
           t.olympic_venue,
           t.olympic_country,
           t.olympic_city,
           t.olympic_state,
           t.olympic_sports,
           to_char(t.olympic_start_date,'DD-MM-YYYY') as olympic_start_date,
           to_char(t.olympic_end_date,'DD-MM-YYYY') as olympic_end_date,
           to_char(t.olympic_registration_open_date,'DD-MM-YYYY') as olympic_registration_open_date,
           to_char(t.olympic_registration_end_date,'DD-MM-YYYY') as olympic_registration_end_date,
           to_char(t.olympic_early_bird_end_date,'DD-MM-YYYY') as olympic_early_bird_end_date,
           t.olympic_start_time,
           t.olympic_end_time

           FROM olympic as t 
           WHERE t.id = ${req.body.olympicDetail} and t.status=1 LIMIT 1;`

           console.log("queryString: ");
           console.log(queryString);

            queryString = await db.query(queryString); 

            console.log("queryString data: ");
            console.log(queryString);

            if (queryString.rowCount) {
                let finalData = queryString.rows[0];

                console.log("finalData: ");
                console.log(finalData);

                // ORGANIZERS
                let organizerQuery = await db.query(`SELECT 
            s.subscriber_id,s.username,s.full_name,s.email_id,s.mobile_number,
            torg.additional_email,torg.subscriber_id,torg.id,
            CASE WHEN torg.additional_contact IS NULL  THEN 
            CAST('' AS VARCHAR)
            ELSE 
            CAST(torg.additional_contact AS VARCHAR)
            END as additional_contact
            FROM 
            ${process.env.SCHEMA}.olympic_organizers as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE olympic_id = ${req.body.olympicDetail}`);
                finalData['olympic_organizers'] = (organizerQuery.rowCount) ? organizerQuery.rows : [];
                // DIRECTORS
                /*let directorQuery = await db.query(`SELECT 
            s.subscriber_id,s.username,s.email_id,s.mobile_number,
            torg.additional_email,torg.subscriber_id,torg.id,
            CASE WHEN torg.additional_contact IS NULL  THEN 
            CAST('' AS VARCHAR)
            ELSE 
            CAST(torg.additional_contact AS VARCHAR)
            END as additional_contact
            FROM 
            ${process.env.SCHEMA}.olympic_directors as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE olympic_id = ${req.body.olympicDetail}`);
                finalData['olympic_directors'] = (directorQuery.rowCount) ? directorQuery.rows : []*/

                // SPONSERS
                let sponsersQuery = await db.query(`SELECT id,name,logo FROM ${process.env.SCHEMA}.olympic_sponsers WHERE olympic_id = ${req.body.olympicDetail}`)
                if (sponsersQuery.rowCount) {
                    for (let item of sponsersQuery.rows) {
                        if (item.logo) {
                            let logo = [];
                            logo.push(item.logo)
                            item.logo = logo;
                        }
                    }
                }
                finalData['olympic_sponsers'] = sponsersQuery.rows;

                // AFFLIATIONS
                let affliations = await db.query(`SELECT id,name,logo FROM ${process.env.SCHEMA}.olympic_affliations WHERE olympic_id = ${req.body.olympicDetail}`)
                if (affliations.rowCount) {
                    for (let item of affliations.rows) {
                        if (item.logo) {
                            let logo = [];
                            logo.push(item.logo)
                            item.logo = logo;
                        }
                    }
                }
                finalData['olympic_affliations'] = affliations.rows;

                // Awards
                
                let awards = await db.query(`SELECT a.*,sa.award_name as awards_type ,a.awards_type as awards_type_id FROM olympic_awards as a left join subscriber_play_awards_master as sa on sa.id:: varchar = a.awards_type WHERE olympic_id = ${req.body.olympicDetail}`)
                if (awards.rowCount) {
                    for (let item of awards.rows) {
                        if (item.logo) {
                            let logo = [];
                            logo.push(item.logo)
                            item.logo = logo;
                        }
                    }
                }
                finalData['olympic_awards'] = awards.rows;

                // BANNERS AND LOGO
                let olympicImages = await db.query(`SELECT id ,type,attachment FROM ${process.env.SCHEMA}.olympic_attachment WHERE olympic_id = ${req.body.olympicDetail}`)
                if (olympicImages.rowCount) {
                    const logo = olympicImages.rows.filter(item => item.type == 'logo').map(item => ({ id: item.id, attachment: item.attachment }));
                    const banner = olympicImages.rows.filter(item => item.type == 'banner').map(item => ({ id: item.id, attachment: item.attachment }));
                    const tile = olympicImages.rows.filter(item => item.type == 'background').map(item => ({ id: item.id, attachment: item.attachment }));
                    finalData['olympic_logo'] = (logo.length) ? logo[0] : {};
                    finalData['olympic_banner'] = banner
                    finalData['olympics_tile'] = tile
                }
                else {
                    finalData['olympic_logo'] = {};
                    finalData['olympic_banner'] = []
                    finalData['olympics_tile'] = []
                }

                console.log("adter finalDataL ");
                console.log(finalData);

                result.finalData = finalData;
            }
        }
    } catch (err) {
        console.log("error: ");
        console.log(err);

        result.list = [];
    }
    return result;
}


const olympic_list = async (req, res) => {
    const result = {};
    try {

        const current = new Date();
        const date = `${current.getFullYear()}-${current.getMonth()+1}-${current.getDate()}`;

        console.log(date);
        console.log('ddddddddddddddddddddddddddddddd');

        
           
            //pastList_data = `and DATE(_t.olympic_end_date) < '${date}'`;
           
        
        let listStr = "SELECT _t.id AS olympic_id,_t.olympic_name,_t.status,_t.olympic_description,to_char(_t.created_at,'DD-MM-YYYY') created,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".olympic AS _t  INNER JOIN " + process.env.schema + ".subscriber AS s ON _t.created_by = s.id where _t.status = 1 ORDER BY _t.id ";

        console.log('listStr///////////////////////////////////////');
        console.log(listStr);
        const list = await db.query(listStr);
        result.list = list.rows;
    } catch (err) {
        console.log("error: ");
        console.log(err);

        result.list = [];
    }
    return result;
} 


const olympic_details = async (req, res) => {
    const result = {};
    try {
        let listStr = "SELECT _t.id AS olympic_id,_t.olympic_name,_t.status,_t.olympic_description,to_char(_t.created_at,'DD-MM-YYYY') created,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".olympic where where _t.status=1 and id="+req.body.olympic_id;
        const list = await db.query(listStr);
        result.info = list.rows;
    } catch (err) {
        console.log("error: ");
        console.log(err);

        result.info = [];
    }
    return result;
}

const olympic_sport_list = async (req, res) => {
    console.log("olympic_sport_list: ");
    const result = {};
    var list = [];
    var details = [];
    try {

        console.log("olympic_sport_list: 201");
        var where_var = "";
        if(req.body.olympic_id && typeof req.body.olympic_id !=="undefined" && req.body.olympic_id !==""){
            console.log("olympic_sport_list: if");
            let listsportsStr = "SELECT id, olympic_sports FROM " + process.env.schema + ".olympic where id="+req.body.olympic_id;
            var sports_list = await db.query(listsportsStr);
            console.log("sports_list rows: ");
            console.log(sports_list.rows[0].olympic_sports);
            console.log(typeof sports_list.rows[0].olympic_sports);
            where_var = "where id in ("+sports_list.rows[0].olympic_sports+")"
        }else{
            console.log("olympic_sport_list: else");
        }
        
        var listStr = "SELECT * FROM " + process.env.schema + ".sports "+where_var;
        var list = await db.query(listStr);

        //var listStrnew = "SELECT *, DATE_FORMAT(olympic_early_bird_end_date, '%Y-%m-%d') as olympic_early_bird_end_date, DATE_FORMAT(olympic_registration_end_date, '%Y-%m-%d') as olympic_registration_end_date, DATE_FORMAT(olympic_registration_open_date, '%Y-%m-%d') as olympic_registration_open_date, DATE_FORMAT(olympic_start_date, '%Y-%m-%d') as olympic_start_date, DATE_FORMAT(olympic_end_date, '%Y-%m-%d') as olympic_end_date FROM " + process.env.schema + ".olympic where id = "+req.body.olympic_id;

        var listStrnew = "SELECT *, TO_CHAR(olympic_start_date, 'DD-MM-YYYY') as olympic_start_date, TO_CHAR(olympic_end_date, 'DD-MM-YYYY') as olympic_end_date, TO_CHAR(olympic_early_bird_end_date, 'DD-MM-YYYY') as olympic_early_bird_end_date, TO_CHAR(olympic_registration_end_date, 'DD-MM-YYYY') as olympic_registration_end_date, TO_CHAR(olympic_registration_open_date, 'DD-MM-YYYY') as olympic_registration_open_date FROM " + process.env.schema + ".olympic where id = "+req.body.olympic_id;
        
        
        console.log("listStrnew: ++++++++++++++++++");
        console.log(listStrnew);

        var details = await db.query(listStrnew);

        

        /*console.log("details: ");
        console.log(details);*/
        
        result.list = list.rows;
        result.details = details.rows;
    } catch (err) {
        console.log("error: ");
        console.log(err);

        result.list = [];
        result.details = [];
    }
    return result;
}

const olympicTypes = async () => {
    try {
        const state = await db.query(`SELECT id,state_name AS state,country_id FROM ${process.env.SCHEMA}.state ORDER BY id;`);
        const city = await db.query(`SELECT id,city_name AS city,state_id FROM ${process.env.SCHEMA}.city ORDER BY id;`);
        const fee_type = await db.query(`SELECT id,name FROM ${process.env.SCHEMA}.fee_type ORDER BY id;`)
        const country = await db.query("SELECT id,code,name AS country,alias FROM " + process.env.SCHEMA + ".country ORDER BY id;");
        const result = {
            state: state.rows,
            city: city.rows,
            fee_type: fee_type.rows,
            country: country.rows
        }
        return result;
    }
    catch (err) {
        return {};
    }
}

const filterVenue = async (req) => {
    try {
        const venue = await db.query(`SELECT id,venue_name,address_1,status FROM ${process.env.SCHEMA}.venue WHERE city_id=${req.body.city_id} AND state_id=${req.body.state_id} AND country_id=${req.body.country_id} ORDER BY id; `)
        return {
            venues: venue.rows
        };
    }
    catch (err) {
        return {};
    }
}

const searchSubscriber = async (req, res) => {
    try {
        let limit = '';
        if (req.body.limit) {
            limit = `LIMIT ${req.body.limit}`;
        }
        //const subscriber = await db.query(`SELECT id as subscriber_display_id,subscriber_id,username,mobile_number,full_name,isd_code,email_id
        //FROM ${process.env.SCHEMA}.subscriber
        //WHERE (subscriber_id || username || mobile_number || full_name) ~* '^.*${req.body.search_string}.*$' and user_type != 3 ${limit};`)

        const subscriber = await db.query(`SELECT id as subscriber_display_id,subscriber_id,username,mobile_number,full_name,isd_code,email_id
        FROM ${process.env.SCHEMA}.subscriber
        WHERE (mobile_number) ~* '^.*${req.body.search_string}.*$' and user_type != 3 ${limit};`)
        if (!subscriber.rowCount) {
            return []
        }
        return subscriber.rows;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const olympicCreate = async (req, res) => {
    //try {
        console.log("204");
        let fee = req.body.olympic_fee;
        let affliations = req.body.olympic_affliations;
        let olympic_awards = req.body.olympic_awards;
        let sponsers = req.body.olympic_sponsers;
        let olympic_logo = req.body.olympic_logo;
        let olympic_banner = req.body.olympic_banner;
        let organizer = req.body.olympic_organizers;
        let director = req.body.olympic_director;
        let affliationPath = 'images/affliations/';
        let awardsPath = 'images/awards/';
        let sponserPath = 'images/sponsers/';
        let olympicPath = 'images/olympics/';  
        
        let olympics_tile =  req.body.olympics_tile;


        let olympicStartDate = "";
        if(req.body.olympic_start_date){
            let strolympicStartDate = req.body.olympic_start_date.split('-');
            olympicStartDate = strolympicStartDate[2] + '-' + strolympicStartDate[1] + '-' + strolympicStartDate[0];    
        }

        let olympicEndDate = "";
        if(req.body.olympic_end_date){
            let strolympicEndDate = req.body.olympic_end_date.split('-');
            olympicEndDate = strolympicEndDate[2] + '-' + strolympicEndDate[1] + '-' + strolympicEndDate[0];    
        }
        
        let olympicRegistrationOpenDate ="";
        if(req.body.olympic_registration_open_date){
            let strolympicRegistrationOpenDate = req.body.olympic_registration_open_date.split('-');
            olympicRegistrationOpenDate = strolympicRegistrationOpenDate[2] + '-' + strolympicRegistrationOpenDate[1] + '-' + strolympicRegistrationOpenDate[0];    
        }
        
        let olympicRegistrationEndDate = "";
        if(req.body.olympic_registration_end_date){
            let strolympicRegistrationEndDate = req.body.olympic_registration_end_date.split('-');
            olympicRegistrationEndDate = strolympicRegistrationEndDate[2] + '-' + strolympicRegistrationEndDate[1] + '-' + strolympicRegistrationEndDate[0];    
        }
        
        let olympicEarlyBirdEndDate = '';
        if (req.body.olympic_early_bird_end_date) {
            let strolympicEarlyBirdEndDate = req.body.olympic_early_bird_end_date.split('-');
            olympicEarlyBirdEndDate = strolympicEarlyBirdEndDate[2] + '-' + strolympicEarlyBirdEndDate[1] + '-' + strolympicEarlyBirdEndDate[0];
            olympicEarlyBirdEndDate = `,'${olympicEarlyBirdEndDate}'`
        }

        var created_by ='1';
        if (req.myID) {
            created_by = req.myID;
        }

        let olympic_venue ='olympic_venue';
        if (req.body.olympic_venue) {
            olympic_venue = req.body.olympic_venue;
        }

        let olympic_type ='1';
        if (req.body.olympic_type) {
            olympic_type = req.body.olympic_type;
        }

        if(!req.body.olympic_start_time || req.body.olympic_start_time ==="undefined" || req.body.olympic_start_time ===""){
            req.body.olympic_start_time = null;
        }

        if(!req.body.olympic_end_time || req.body.olympic_end_time ==="undefined" || req.body.olympic_end_time ===""){
            req.body.olympic_end_time = null;
        }

        /*let olympicStr = `INSERT INTO ${process.env.SCHEMA}.olympic
            (olympic_name,status,olympic_description,created_by,olympic_venue,
             olympic_type,olympic_country,olympic_state,olympic_city,
             olympic_registration_open_date,olympic_registration_end_date,
             olympic_start_time,olympic_end_time,
             olympic_start_date,olympic_end_date     
             ${(olympicEarlyBirdEndDate) ? ',olympic_early_bird_end_date' : ''}
             )
             VALUES('${req.body.olympic_name}',${req.body.status},'${req.body.olympic_description}',
                ${created_by},${olympic_venue},${olympic_type},
                ${req.body.olympic_country},${req.body.olympic_state},${req.body.olympic_city},  
                '${olympicRegistrationOpenDate}','${olympicRegistrationEndDate}',
                '${req.body.olympic_start_time}','${req.body.olympic_end_time}',
                '${olympicStartDate}','${olympicEndDate}'${olympicEarlyBirdEndDate}
                ) RETURNING id`;*/
        //var tournament_description_a = req.body.tournament_description;
        //var tournament_description = (tournament_description_a.replace(/'/g, '')); 
        var olympic_des_a = req.body.olympic_description;
        var olympic_description = (olympic_des_a.replace(/'/g, ''));

        let olympicStr = `INSERT INTO ${process.env.SCHEMA}.olympic
            (olympic_sports,olympic_name,status,olympic_description,created_by,
             olympic_country,olympic_state,olympic_city,
             olympic_start_time,olympic_end_time,
             olympic_start_date,olympic_end_date     
             ${(olympicEarlyBirdEndDate) ? ',olympic_early_bird_end_date' : ''}
             )
             VALUES('${req.body.olympic_sports}','${req.body.olympic_name}',${req.body.status},'${olympic_description}',
                ${created_by},
                ${req.body.olympic_country},${req.body.olympic_state},${req.body.olympic_city},
                '${req.body.olympic_start_time}','${req.body.olympic_end_time}',
                '${olympicStartDate}','${olympicEndDate}'${olympicEarlyBirdEndDate}
                ) RETURNING id`;



        console.log("olympicStr: +++++++++++");
        console.log(olympicStr);
        
        const olympic = await db.query(olympicStr);

        console.log("olympic: +++++++++++");
        console.log(olympic);

        if (olympic.rowCount) {

            const olympic_id = olympic.rows[0].id;
            if (affliations.length) {
                console.log("affliations: ");
                for (let i of affliations) {
                    let logo = i.AffLogo;
                    if (Array.isArray(logo) && logo.length) {
                        let uploadPath = helper.uploadBase64(i.AffLogo.toString(), affliationPath);
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_affliations(
                            name, logo, created_at, olympic_id)
                            VALUES ('${i.personName}', '${uploadPath.path}', now(), ${olympic_id})`)
                    }
                    else {
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_affliations(
                                name, logo, created_at, olympic_id)
                                VALUES ('${i.personName}', null, now(), ${olympic_id})`)
                    }
                }
            }

            if (olympic_awards.length) {
                console.log("olympic_awards: ");
                for (let i of olympic_awards) {
                    console.log("olympic_awards foor loop: ")
                    //let logo = i.AffLogo;
                    let logo = i.logo;
                    console.log("logo: ");
                    console.log(logo);

                    if (Array.isArray(logo) && logo.length) {
                        console.log("if ===");
                        let uploadPath = helper.uploadBase64(i.logo.toString(), awardsPath);
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                            name, logo, created_at, olympic_id)
                            VALUES ('${i.name}', '${uploadPath.path}', now(), ${olympic_id})`)*/

                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                            awards_type, created_at, olympic_id)
                            VALUES ('${i.awards_type_id}', now(), ${olympic_id})`)
                    }
                    else {
                        console.log("else ===");
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                                name, logo, created_at, olympic_id)
                                VALUES ('${i.name}', null, now(), ${olympic_id})`)*/
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_awards(
                            awards_type, created_at, olympic_id)
                                VALUES ('${i.awards_type_id}', now(), ${olympic_id})`)
                    }
                }
            }

            if (sponsers.length) {
                console.log("sponsers: ");
                for (let i of sponsers) {
                    let logo = i.SponserLogo;
                    if (Array.isArray(logo) && logo.length) {
                        let uploadPath = helper.uploadBase64(i.SponserLogo.toString(), sponserPath);
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_sponsers(
                            name, logo, created_at, olympic_id)
                            VALUES ('${i.personName}', '${uploadPath.path}', now(), ${olympic_id})
                            RETURNING id;`)
                    }
                    else {
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.olympic_sponsers(
                                name, logo, created_at, olympic_id)
                                VALUES ('${i.personName}', null, now(), ${olympic_id})
                                RETURNING id;`)
                    }
                }
            }

            /*if (olympic_logo.length>0) {
                console.log("olympic_logo: ");
                var created_by = 1;
                olympic_logo = helper.uploadBase64(olympic_logo[0], olympicPath + 'logo/');
                console.log("olympic_logo: ");
                console.log(olympic_logo);
                logoNew = olympic_logo.path;
                //let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                        //type, attachment, created_at, created_by, status, olympic_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${olympic_id})`
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                        type, attachment, created_at, created_by, status, olympic_id) VALUES ('logo','${logoNew}',now(),${created_by},1,${olympic_id})`

                        

                await db.query(logoQuery);
                console.log("logoQuery: ");
                        console.log(logoQuery);
            }*/

            if (olympic_logo && typeof olympic_logo !== undefined && olympic_logo!=="") {
                console.log("olympic_logo: ");
                var created_by = 1;
                olympic_logo = helper.uploadBase64(olympic_logo, olympicPath + 'logo/');
                console.log("olympic_logo: ");
                console.log(olympic_logo);
                logoNew = olympic_logo.path;
                //let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                        //type, attachment, created_at, created_by, status, olympic_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${olympic_id})`
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                        type, attachment, created_at, created_by, status, olympic_id) VALUES ('logo','${logoNew}',now(),${created_by},1,${olympic_id})`

                        

                await db.query(logoQuery);
                console.log("logoQuery: ");
                        console.log(logoQuery);
            }

            

            if (olympics_tile.length>0) {
                console.log("background: ");
                var created_by = 1;
                let insertBanner = [];
                for (let item of olympics_tile) {
                    
                    /*const path = helper.uploadBase64(item, olympicPath + 'banner/');
                    insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${olympic_id})`)*/
                    var path = helper.uploadBase64(item, olympicPath + 'banner/');
                    console.log("path: ");
                    console.log(path);

                    insertBanner.push(`('background','${path.path}',now(),${created_by},1,${olympic_id})`) 
                }
                const jointBanners = insertBanner.join();
                const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                    type, attachment, created_at, created_by, status, olympic_id) VALUES ${jointBanners};`; 
                await db.query(insert);

                console.log("jointBanners: ");
                        console.log(insert);

            }

            

            if (olympic_banner.length>0) {
                console.log("banner: ");
                var created_by = 1;
                let insertBanner = [];
                for (let item of olympic_banner) {
                    
                    /*const path = helper.uploadBase64(item, olympicPath + 'banner/');
                    insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${olympic_id})`)*/
                    var path = helper.uploadBase64(item, olympicPath + 'banner/');
                    console.log("path: ");
                    console.log(path);

                    insertBanner.push(`('banner','${path.path}',now(),${created_by},1,${olympic_id})`)
                }
                const jointBanners = insertBanner.join();
                const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_attachment (
                    type, attachment, created_at, created_by, status, olympic_id) VALUES ${jointBanners};`;
                await db.query(insert);

                console.log("jointBanners: ");
                        console.log(insert);

            }

            if (organizer && typeof organizer !=="undefined" && organizer.length>0) {
                console.log("organizer: ");
                var created_by = 1;
                let insertOrganizers = [];
                for (let i of organizer) {
                    let additionalEmail = (i.additionalEmail) ? i.additionalEmail : '';
                    /*let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertOrganizers.push(`('${additionalEmail}',${additionalContact},${+i.id},${req.myID},now(),${olympic_id})`)*/
                    let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertOrganizers.push(`('${additionalEmail}',${additionalContact},${+i.id},${created_by},now(),${olympic_id})`)
                }
                const jointOrganizers = insertOrganizers.join()
                const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_organizers
                    (additional_email,additional_contact,subscriber_id,created_by,created_at,olympic_id) 
                    VALUES ${jointOrganizers};`;
                await db.query(insert);
            }

            if (director && typeof director !=="undefined" && director.length>0) {
                console.log("director: ");
                var created_by = 1;
                let insertDirectors = [];
                for (let i of director) {
                    let additionalEmail = (i.additionalEmail) ? i.additionalEmail : '';
                    /*let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertDirectors.push(`('${additionalEmail}',${additionalContact},${+i.id},${req.myID},now(),${olympic_id})`)*/
                    let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertDirectors.push(`('${additionalEmail}',${additionalContact},${+i.id},${created_by},now(),${olympic_id})`)
                }
                const jointDirectors = insertDirectors.join()
                const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_directors
                    (additional_email,additional_contact,subscriber_id,created_by,created_at,olympic_id) 
                    VALUES ${jointDirectors};`;
                await db.query(insert);
            }

            if (fee && !req.body.isolympicfree) {
                console.log("fee: ");
                var created_by = 1;
                /*const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_fee
                    (type,entry_fee,early_bird_entry_fee,created_by,created_at,olympic_id) 
                    VALUES (${req.body.olympic_fee_type},${fee.entry_fees},${fee.early_bird_entry_fees},
                        ${req.myID},now(),${olympic_id});`;*/
                const insert = `INSERT INTO ${process.env.SCHEMA}.olympic_fee
                    (type,entry_fee,early_bird_entry_fee,created_by,created_at,olympic_id) 
                    VALUES (${req.body.olympic_fee_type},${fee.entry_fees},${fee.early_bird_entry_fees},
                        ${created_by},now(),${olympic_id});`;
                await db.query(insert);
            }
        }
        return true;
    /*}
    catch (err) {
        console.log("olympicCreate model catch err:")
        console.log(err)
        return false
    }*/
}

const imageUpload = (file, folder) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let imageName = random + file.name;
    let path = `images/olympics/${folder}/` + imageName;
    file.mv(path, function (err) {
        if (err)
            throw Error;
    });
    return path;
}

const details = async (req, res) => {
    try {
        const city = await db.query(`SELECT id,state_id,city_name FROM ${process.env.SCHEMA}.city`);
        const state = await db.query(`SELECT id,country_id,state_name FROM ${process.env.SCHEMA}.state`);
        const country = await db.query(`SELECT id,code,name,alias,min_age FROM ${process.env.SCHEMA}.country`);
        //const olympic_type = await db.query(`SELECT id,name FROM ${process.env.SCHEMA}.olympic_type`);
        //const sports_category = await db.query(`SELECT id,sports_id,category_name FROM ${process.env.SCHEMA}.sports_category`);
        const sports = await db.query(`SELECT id,sports_name FROM ${process.env.SCHEMA}.sports`);

        console.log("city: ");
        console.log(city);

        console.log("state: ");
        console.log(state);

        console.log("country: ");
        console.log(country);

        console.log("sports: ");
        console.log(sports);

        return {
            city: city.rows,
            state: state.rows,
            country: country.rows,
            //olympic_type: olympic_type.rows,
            sports: sports.rows
        }
    }
    catch (err) {
        console.log("error: ");
        console.log(err)
        return {}
    }
}


module.exports = { details, olympic, olympic_list, olympic_sport_list, olympicTypes, filterVenue, searchSubscriber, olympicCreate, olympic_details }