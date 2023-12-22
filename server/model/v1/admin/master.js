const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');

const tournament = async (req, res) => {
    const result = {};
    try {

        console.log('req.body.tournamentDetail+++++++++')
        console.log(req.body.tournamentDetail)
        result.add = false; result.update = false;
        if ((typeof (req.body.name) != "undefined" && req.body.name != "") || (typeof (req.body.tournamentID) != "undefined" && req.body.tournamentID != "")) {
            let id = ""; let idval = "";
            if ((typeof (req.body.tournamentID) != "undefined" && req.body.tournamentID != "")) {
                id = "id,"; idval = req.body.tournamentID + ",";
                result.update = true;
            }

            let name = ""; let nameval = ""; let updatename = "";
            if ((typeof (req.body.name) != "undefined" && req.body.name != "")) {
                name = "tournament_name,"; nameval = "$$" + req.body.name + "$$,";
                updatename = ",tournament_name=$$" + req.body.name + "$$ ";
            }

            let updatedescription = "";
            if ((typeof (req.body.description) != "undefined" && req.body.description != "")) {
                updatedescription = ",description=$$" + req.body.description + "$$ ";
            }

            let status = 1;
            if ((typeof (req.body.status) != "undefined" && req.body.status != "")) {
                status = req.body.status;
            }

            let tournamentStr = "INSERT INTO " + process.env.schema + ".tournament (" + id + "tournament_name,status,description,created_by) VALUES (" + idval + "$$" + req.body.name + "$$," + status + ",$$" + req.body.description + "$$," + req.myID + ") ON CONFLICT (id) DO UPDATE SET updated_at=now(),updated_by=" + req.myID + " " + updatename + " , status=" + status + " " + updatedescription + " ";
            await db.query(tournamentStr);
            result.add = true;
        }
        if (typeof (req.body.list) != "undefined" && req.body.list) {
            let listStr = "SELECT _t.url,_t.id AS tournament_id,_t.type,_t.no_team,_t.max_player,_t.min_player,_t.tournament_name,o.olympic_start_date,o.olympic_end_date,o.olympic_name as champ_name,_t.sports as sport_id,_t.status,_t.tournament_description,to_char(_t.created_at,'DD-MM-YYYY') created,to_char(_t.tournament_start_date,'DD-MM-YYYY') start_date,to_char(_t.tournament_end_date,'DD-MM-YYYY') end_date,_t.tournament_start_time as start_time,_t.tournament_end_time as end_time,s.full_name,s.subscriber_id FROM  " + process.env.schema + ".tournament AS _t LEFT join olympic as o on _t.olympics_sports = o.id INNER JOIN " + process.env.schema + ".subscriber AS s ON _t.created_by = s.id WHERE _t.status = 1 ORDER BY _t.id DESC";

            console.log('listStr:::::::::::::::::::::::::');
            console.log(listStr);
            const list = await db.query(listStr);
         var data = list.rows;
            
                for (var i = 0; i < data.length; i++) {
                    //data[i]
                    var query = "SELECT sports_name FROM sports where id in ("+data[i].sport_id+")"; 
                    const listdata  = await db.query(query);
                    data[i].sport_data = listdata.rows;
                }
           // }
            result.list = list.rows;
            console.log('result');
            console.log(result);
        } else {
            result.list = [];
        }

        console.log('req.body.tournamentDetail11111111111111111111111111111111');
        console.log(req.body.tournamentDetail)

        if (req.body.tournamentDetail) {
            let queryString = `
           SELECT t.id,
           t.discount_value_percentage,
           t.type,
           t.no_team,
           t.max_player,
           t.min_player,
           t.registration_fee,
           t.early_bird_last_date,
           to_char(t.early_bird_last_date,'DD-MM-YYYY') as early_bird_last_date,
           t.early_bird_discount,
           t.olympics_sports,
           t.sports,
           t.sub_sports,
           t.discount_type,
           t.discount_value,
           t.url,
           t.tournament_name,
           t.tournament_description,
           t.tournament_type,
           t.tournament_venue,
           t.venue_other,
           t.tournament_country,
           t.tournament_city,
           t.tournament_state,
           to_char(t.tournament_start_date,'DD-MM-YYYY') as tournament_start_date,
           to_char(t.tournament_end_date,'DD-MM-YYYY') as tournament_end_date, 
           to_char(t.tournament_registration_open_date,'DD-MM-YYYY') as tournament_registration_open_date, 
           to_char(t.tournament_registration_end_date,'DD-MM-YYYY') as tournament_registration_end_date,
           to_char(t.tournament_early_bird_end_date,'DD-MM-YYYY') as tournament_early_bird_end_date,
           t.tournament_start_time,
           t.tournament_end_time,
           tf.type as tournament_fee_type,
           tf.entry_fee as tournament_entry_fees,
           tf.early_bird_entry_fee as early_bird_entry_fees,
           tf.currency,
          o.olympic_start_date,o.olympic_end_date
           FROM tournament as t 
           LEFT JOIN tournament_fee as tf
           ON tf.tournament_id = t.id

           LEFT join olympic as o on t.olympics_sports = o.id

           WHERE t.status=1 and t.id = ${req.body.tournamentDetail} LIMIT 1;` 
            queryString = await db.query(queryString);
            console.log('1111111111111111111111111111111');
            console.log(queryString);

            if (queryString.rowCount) {
                let finalData = queryString.rows[0];
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
            ${process.env.SCHEMA}.tournament_organizers as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE tournament_id = ${req.body.tournamentDetail}`);
                finalData['tournament_organizers'] = (organizerQuery.rowCount) ? organizerQuery.rows : [];
                // DIRECTORS
                let directorQuery = await db.query(`SELECT 
            s.subscriber_id,s.username,s.email_id,s.mobile_number,
            torg.additional_email,torg.subscriber_id,torg.id,
            CASE WHEN torg.additional_contact IS NULL  THEN 
            CAST('' AS VARCHAR)
            ELSE 
            CAST(torg.additional_contact AS VARCHAR)
            END as additional_contact
            FROM 
            ${process.env.SCHEMA}.tournament_directors as torg
            INNER JOIN subscriber as s
            ON s.subscriber_id = torg.subscriber_id
            WHERE tournament_id = ${req.body.tournamentDetail}`);
                finalData['tournament_directors'] = (directorQuery.rowCount) ? directorQuery.rows : []

                // SPONSERS
                let sponsersQuery = await db.query(`SELECT id,name,logo FROM ${process.env.SCHEMA}.tournament_sponsers WHERE tournament_id = ${req.body.tournamentDetail}`)
                if (sponsersQuery.rowCount) {
                    for (let item of sponsersQuery.rows) {
                        if (item.logo) {
                            let logo = [];
                            logo.push(item.logo)
                            item.logo = logo;
                        }
                    }
                }
                finalData['tournament_sponsers'] = sponsersQuery.rows;

                // AFFLIATIONS
                let affliations = await db.query(`SELECT id,name,logo FROM ${process.env.SCHEMA}.tournament_affliations WHERE tournament_id = ${req.body.tournamentDetail}`)
                if (affliations.rowCount) {
                    for (let item of affliations.rows) {
                        if (item.logo) {
                            let logo = [];
                            logo.push(item.logo)
                            item.logo = logo;
                        }
                    }
                }
                finalData['tournament_affliations'] = affliations.rows;

                // Awards
                let awards = await db.query(`SELECT t.*,t.awards_type as awards_type_id ,sw.award_name as awards_type FROM tournament_awards as t left join subscriber_play_awards_master as sw on sw.id = t. awards_type WHERE status = 1 and tournament_id = ${req.body.tournamentDetail}`)
                // if (awards.rowCount) {
                //     for (let item of awards.rows) {
                //         // if (item.logo) {
                //         //     let logo = [];
                //         //     logo.push(item.logo)
                //         //     item.logo = logo;
                //         // }
                //     }
                // }
                finalData['tournament_awards'] = awards.rows;  
                
                // BANNERS AND LOGO
                let tournamentImages = await db.query(`SELECT id,type,attachment FROM ${process.env.SCHEMA}.tournament_attachment WHERE tournament_id = ${req.body.tournamentDetail}`)
                if (tournamentImages.rowCount) {
                    const logo = tournamentImages.rows.filter(item => item.type == 'logo').map(item => ({ id: item.id, attachment: item.attachment }));
                    const banner = tournamentImages.rows.filter(item => item.type == 'banner').map(item => ({ id: item.id, attachment: item.attachment }));
                     const background = tournamentImages.rows.filter(item => item.type == 'background').map(item => ({ id: item.id, attachment: item.attachment }));
                    finalData['tournament_logo'] = (logo.length) ? logo[0] : {};
                    finalData['tournament_banner'] = banner
                    finalData['tournament_background'] = background
                }
                else {
                    finalData['tournament_logo'] = {};
                    finalData['tournament_banner'] = []
                    finalData['tournament_background'] = []
                }
                result.finalData = finalData;  
            }
        }
    } catch (err) {
        console.log(err);
        result.list = [];
    }
    return result;
}

const tournamentTypes = async () => {
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
       const searchTerm = req.body.search_string; // Convert the search string to lowercase for case-insensitive search

const queryString = `
  SELECT id as subscriber_display_id, subscriber_id, username, mobile_number, full_name, isd_code, email_id
  FROM ${process.env.SCHEMA}.subscriber
  WHERE CAST(subscriber_id AS TEXT) ILIKE '%${searchTerm}%' OR
        username ILIKE '%${searchTerm}%' OR
        CAST(mobile_number AS TEXT) ILIKE '%${searchTerm}%' OR 
        full_name ILIKE '%${searchTerm}%'
  ${limit};
`;
console.log("queryString,,,,//////////////////////////"); 
        console.log(queryString); 

        const subscriber = await db.query(queryString);
        


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

const tournamentCreate = async (req, res) => {
    try {
        let fee = req.body.tournament_fee;

        let affliations = req.body.tournament_affliations;
        let sponsers = req.body.tournament_sponsers;
        let logo = req.body.tournament_logo;
        let background = req.body.background;

        let banner = req.body.tournament_banner;
        let organizer = req.body.tournament_organizer;
        let tournament_awards = req.body.tournament_awards;
        let director = req.body.tournament_director;
        let affliationPath = 'images/affliations/';
        let sponserPath = 'images/sponsers/';
        let tournamentPath = 'images/tournaments/';
        let awardsPath = 'images/awards/';
        let strtournamentStartDate = req.body.tournament_start_date.split('-');
        let tournamentStartDate = strtournamentStartDate[2] + '-' + strtournamentStartDate[1] + '-' + strtournamentStartDate[0];
        let strtournamentEndDate = req.body.tournament_end_date.split('-');
        let tournamentEndDate = strtournamentEndDate[2] + '-' + strtournamentEndDate[1] + '-' + strtournamentEndDate[0];
        let strtournamentRegistrationOpenDate = req.body.tournament_registration_open_date.split('-');
        let tournamentRegistrationOpenDate = strtournamentRegistrationOpenDate[2] + '-' + strtournamentRegistrationOpenDate[1] + '-' + strtournamentRegistrationOpenDate[0];
        let strtournamentRegistrationEndDate = req.body.tournament_registration_end_date.split('-');
        let tournamentRegistrationEndDate = strtournamentRegistrationEndDate[2] + '-' + strtournamentRegistrationEndDate[1] + '-' + strtournamentRegistrationEndDate[0];
        let tournamentEarlyBirdEndDate = '';
        if (req.body.tournament_early_bird_end_date) {
            let strtournamentEarlyBirdEndDate = req.body.tournament_early_bird_end_date.split('-');
            tournamentEarlyBirdEndDate = strtournamentEarlyBirdEndDate[2] + '-' + strtournamentEarlyBirdEndDate[1] + '-' + strtournamentEarlyBirdEndDate[0];
            tournamentEarlyBirdEndDate = `,'${tournamentEarlyBirdEndDate}'`
        }

        if(!tournamentEarlyBirdEndDate || typeof tournamentEarlyBirdEndDate === undefined || tournamentEarlyBirdEndDate ===""){
            tournamentEarlyBirdEndDate = null
        }else{
            tournamentEarlyBirdEndDate = "'"+tournamentEarlyBirdEndDate+"'";
        }
        let tournamentEarlyBirdLastDate = null;
        if (req.body.early_bird_last_date) {
            let strtournamentEarlyBirdLastDate = req.body.early_bird_last_date.split('-');
            tournamentEarlyBirdLastDate = strtournamentEarlyBirdLastDate[2] + '-' + strtournamentEarlyBirdLastDate[1] + '-' + strtournamentEarlyBirdLastDate[0];
            tournamentEarlyBirdLastDate = `'${tournamentEarlyBirdLastDate}'`
        }


        if(!req.body.discount_value_percentage || req.body.discount_value_percentage ==="undefined" || req.body.discount_value_percentage ===""){
            req.body.discount_value_percentage = null;
        }

        if(!req.body.registration_fee || req.body.registration_fee ==="undefined" || req.body.registration_fee ===""){
            req.body.registration_fee = null;
        }

        console.log("req.body.early_bird_last_date: ");
        console.log(req.body.early_bird_last_date);

        if(!req.body.early_bird_last_date || req.body.early_bird_last_date ==="undefined" || req.body.early_bird_last_date ===""){
            req.body.early_bird_last_date = 'NULL';
        }

        if(!req.body.early_bird_discount || req.body.early_bird_discount ==="undefined" || req.body.early_bird_discount ===""){
            req.body.early_bird_discount = null;
        }

        if(!req.body.discount_value || req.body.discount_value ==="undefined" || req.body.discount_value ===""){
            req.body.discount_value = null;
        }

        if(!req.body.discount_type || req.body.discount_type ==="undefined" || req.body.discount_type ===""){
            req.body.discount_type = null;
        }

        if(!req.body.tournament_type || req.body.tournament_type ==="undefined" || req.body.tournament_type ===""){
            req.body.tournament_type = null;
        }

         if(!req.body.tournament_city || req.body.tournament_city ==="undefined" || req.body.tournament_city ===""){
            req.body.tournament_city = null;
        }

        if(!req.body.sub_sports || req.body.sub_sports ==="undefined" || req.body.sub_sports ===""){
            req.body.sub_sports = null;
        }
        if(!req.body.type || req.body.type ==="undefined" || req.body.type ===""){
            req.body.type = null;
        }
        if(!req.body.no_team || req.body.no_team ==="undefined" || req.body.no_team ===""){
            req.body.no_team = null;
        }
        if(!req.body.min_player || req.body.min_player ==="undefined" || req.body.min_player ===""){
            req.body.min_player = null;
        }
        if(!req.body.max_player || req.body.max_player ==="undefined" || req.body.max_player ===""){
            req.body.max_player = null;
        }

        


        console.log("req.body.olympics_sports: ");
        console.log(req.body.olympics_sports);

        //var is_champ = false;
        if(!req.body.olympics_sports || req.body.olympics_sports ==="undefined" || req.body.olympics_sports ===""){
            req.body.is_champ = false;
            req.body.olympics_sports = null;
            is_champ = false;
            console.log("if")
        }
        else{
            console.log("else")
            is_champ = true;
            req.body.is_champ = true;
            
            req.body.olympics_sports = "'"+req.body.olympics_sports+"'";
        }

        if(!req.body.url || req.body.url ==="undefined" || req.body.url ===""){
            req.body.is_live = false;
            console.log("if")
        }
        else{
            console.log("else")
            req.body.is_live = true;
        }

        if(req.body.tournament_venue == 0){
            
          var venue_other = req.body.venue_other;

        }
        else{

            var venue_other = null;
        }



      var tournament_description_a = req.body.tournament_description;
      var tournament_description = (tournament_description_a.replace(/'/g, '')); 

       
        let tournamentStr = `INSERT INTO ${process.env.SCHEMA}.tournament
            (discount_value_percentage,early_bird_last_date,early_bird_discount,olympics_sports,sports,discount_type,discount_value,  tournament_name,status,tournament_description,created_by,tournament_venue,venue_other,
             tournament_type,sub_sports,tournament_country,tournament_state,tournament_city,
             tournament_registration_open_date,tournament_registration_end_date,
             tournament_start_time,tournament_end_time,is_champ,registration_fee,type,no_team,min_player,max_player,
             tournament_start_date,url,tournament_end_date,tournament_early_bird_end_date
             )
             VALUES('${req.body.discount_value_percentage}',${tournamentEarlyBirdLastDate},'${req.body.early_bird_discount}',${req.body.olympics_sports},'${req.body.sports}','${req.body.discount_type}','${req.body.discount_value}','${req.body.tournament_name}',${req.body.status},'${tournament_description}',
                ${req.myID},${req.body.tournament_venue},'${venue_other}',${req.body.tournament_type},${req.body.sub_sports},
                ${req.body.tournament_country},${req.body.tournament_state},${req.body.tournament_city},
                '${tournamentRegistrationOpenDate}','${tournamentRegistrationEndDate}',
                '${req.body.tournament_start_time}','${req.body.tournament_end_time}',${is_champ},${req.body.isTournamentfree},'${req.body.type}',${req.body.no_team},${req.body.min_player},${req.body.max_player},
                '${tournamentStartDate}','${req.body.url}','${tournamentEndDate}',${tournamentEarlyBirdEndDate}
                ) RETURNING id`;
        
        console.log("tournament insert secound");

        console.log("tournamentStr: ++++");
        console.log(tournamentStr);


        console.log("tournament insert first");

        const tournament = await db.query(tournamentStr);

        console.log("insert+++");

        console.log("tournament insert done");

        if (tournament.rowCount) {
            const tournament_id = tournament.rows[0].id;
            if (affliations.length>0) {
                
                for (let i of affliations) {
                    console.log("tournament_affliations: ++++++++++++++++++++++++++++++++");

                    let logo = i.AffLogo;
                    if (Array.isArray(logo) && logo.length) {
                        console.log("affliations insert:");
                        let uploadPath = helper.uploadBase64(i.AffLogo.toString(), affliationPath);
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_affliations(
                            name, logo, created_at, tournament_id)
                            VALUES ('${i.personName}', '${uploadPath.path}', now(), ${tournament_id})`)
                        console.log("affliations: insert ++++++++++++++++++++++++++++++++");
                    }
                    else {
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_affliations(
                                name, logo, created_at, tournament_id)
                                VALUES ('${i.personName}', null, now(), ${tournament_id})`)
                        console.log("tournament: insert ++++++++++++++++++++++++++++++++");
                    }
                }
            }
            if (sponsers.length>0) {
                for (let i of sponsers) {
                    console.log("tournament_sponsers: ++++++++++++++++++++++++++++++++");
                    let logo = i.SponserLogo;
                    if (Array.isArray(logo) && logo.length) {
                        console.log("sponsers insert:");
                        let uploadPath = helper.uploadBase64(i.SponserLogo.toString(), sponserPath);
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_sponsers(
                            name, logo, created_at, tournament_id)
                            VALUES ('${i.personName}', '${uploadPath.path}', now(), ${tournament_id})
                            RETURNING id;`)
                        console.log("sponsers: insert ++++++++++++++++++++++++++++++++");
                    }
                    else {
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_sponsers(
                                name, logo, created_at, tournament_id)
                                VALUES ('${i.personName}', null, now(), ${tournament_id})
                                RETURNING id;`)
                        console.log("sponsers: insert ++++++++++++++++++++++++++++++++");
                    }
                }
            }

            if (logo.length>0) {
                console.log("logo: ++++++++++++++++++++++++++++++++");
                logo = helper.uploadBase64(logo[0], tournamentPath + 'logo/');
                logoNew = logo.path;
                console.log("logo insert:");
                let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
                        type, attachment, created_at, created_by, status, tournament_id) VALUES ('logo','${logoNew}',now(),${req.myID},1,${tournament_id})`

                        console.log("logo logoQuery: ");
                        console.log(logoQuery);

                await db.query(logoQuery);

                console.log("logo: insert ++++++++++++++++++++++++++++++++");
            }

            // if (background.length>0) {
            //     console.log("background: ++++++++++++++++++++++++++++++++");
            //     background = helper.uploadBase64(background, tournamentPath + 'background/');
            //     logoNew = background.path;
            //     console.log("background insert:");
            //     let logoQuery = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
            //             type, attachment, created_at, created_by, status, tournament_id) VALUES ('background','${logoNew}',now(),${req.myID},1,${tournament_id})`

            //             console.log("background logoQuery: ");
            //             console.log(logoQuery);

            //     await db.query(logoQuery);
            //     console.log("background: insert ++++++++++++++++++++++++++++++++");
            // }


               if (background && background.length>0) {
                            console.log("background insert: ++++++++++++++++++++++++++++++++");
                            let insertbackground = [];
                            for (let item of background) {
                                const path = helper.uploadBase64(item, tournamentPath + 'background/');
                                insertbackground.push(`('background','${path.path}',now(),${req.myID},1,${tournament_id})`)
                            }
                            const jointbackgrounds = insertbackground.join();
                            const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
                                type, attachment, created_at, created_by, status, tournament_id) VALUES ${jointbackgrounds};`;

                                console.log("background logoQuery: ");
                                    console.log(insert);

                            await db.query(insert);
                            console.log("background: insert ++++++++++++++++++++++++++++++++");
                        }


            
            if (banner && banner.length>0) {
                console.log("banner insert: ++++++++++++++++++++++++++++++++");
                let insertBanner = [];
                for (let item of banner) {
                    const path = helper.uploadBase64(item, tournamentPath + 'banner/');
                    insertBanner.push(`('banner','${path.path}',now(),${req.myID},1,${tournament_id})`)
                }
                const jointBanners = insertBanner.join();
                const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_attachment (
                    type, attachment, created_at, created_by, status, tournament_id) VALUES ${jointBanners};`;

                    console.log("banner logoQuery: ");
                        console.log(insert);

                await db.query(insert);
                console.log("banner: insert ++++++++++++++++++++++++++++++++");
            }

            if (tournament_awards && tournament_awards.length) {
                console.log("tournament_awards: ++++++++++++++++++++++++++++++++");
                for (let i of tournament_awards) {
                    console.log("tournament_awards foor loop: ")
                    //let logo = i.AffLogo;
                    let logo = i.logo;
                    //console.log("logo: ");
                   // console.log(logo);

                    if (Array.isArray(logo) && logo.length) {
                        console.log("if ===");
                        //let uploadPath = helper.uploadBase64(i.logo.toString(), awardsPath);
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_awards(
                            name, logo, created_at, tournament_id)
                            VALUES ('${i.name}', '${uploadPath.path}', now(), ${tournament_id})`)*/

                            await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_awards(
                            awards_type,created_at,tournament_id)
                            VALUES (${i.awards_type_id},now(), ${tournament_id})`)
                            console.log("awards: insert ++++++++++++++++++++++++++++++++");

                    }
                    else {
                        console.log("else ===");
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_awards(
                                name, logo, created_at, tournament_id)
                                VALUES ('${i.name}', null, now(), ${tournament_id})`)*/

                                await db.query(`INSERT INTO ${process.env.SCHEMA}.tournament_awards(
                                awards_type,created_at, tournament_id)
                                VALUES (${i.awards_type_id},now(),${tournament_id})`)
                                console.log("awards: insert ++++++++++++++++++++++++++++++++");
                    }
                }
            }

            if (organizer.length>0) {
                console.log("tournament_organizers: ++++++++++++++++++++++++++++++++");
                let insertOrganizers = [];
                console.log("organizer insert:");
                for (let i of organizer) {
                    let additionalEmail = (i.additionalEmail) ? i.additionalEmail : '';
                    let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertOrganizers.push(`('${additionalEmail}',${additionalContact},${+i.id},${req.myID},now(),${tournament_id})`)
                }
                const jointOrganizers = insertOrganizers.join()
                const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_organizers
                    (additional_email,additional_contact,subscriber_id,created_by,created_at,tournament_id) 
                    VALUES ${jointOrganizers};`;

                    console.log("organizer insert: ");
                        console.log(insert);

                await db.query(insert);
                console.log("organizer: insert ++++++++++++++++++++++++++++++++");
            }

            if (director.length>0) {
                console.log("director insert: ++++++++++++++++++++++++++++++++");
                let insertDirectors = [];
                for (let i of director) {
                    let additionalEmail = (i.additionalEmail) ? i.additionalEmail : '';
                    let additionalContact = (i.additionalContact) ? i.additionalContact : null;
                    insertDirectors.push(`('${additionalEmail}',${additionalContact},${+i.id},${req.myID},now(),${tournament_id})`)
                }
                const jointDirectors = insertDirectors.join()
                const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_directors
                    (additional_email,additional_contact,subscriber_id,created_by,created_at,tournament_id) 
                    VALUES ${jointDirectors};`;

                    console.log("organizer insert: ");
                        console.log(insert);

                await db.query(insert);
                console.log("director: insert ++++++++++++++++++++++++++++++++");
            }



            if (fee && !req.body.isTournamentfree) {

                if(fee.entry_fees === null || fee.entry_fees === "undefined" || fee.entry_fees ===""){
                    console.log("iffffffffffffffffffffffffff");
                    fee.entry_fees = null;
                }
                if(fee.currency === null || fee.currency === "undefined" || fee.currency ===""){
                    console.log("iffffffffffffffffffffffffff");
                    fee.currency = null;
                }
                console.log("fee insert: ++++++++++++++++++++++++++++++++");
                const insert = `INSERT INTO ${process.env.SCHEMA}.tournament_fee
                    (type,entry_fee,early_bird_entry_fee,currency,created_by,created_at,tournament_id) 
                    VALUES (${req.body.tournament_fee_type},${fee.entry_fees},${fee.early_bird_entry_fees},${fee.currency},
                        ${req.myID},now(),${tournament_id});`;

                        console.log("fee insert: ");
                        console.log(insert);

                await db.query(insert);
                console.log("fee: insert 11111111111111111111111111111111111111111");
            }
        }
        return true;
    }
    catch (err) {
        console.log("err++++++++++++++")
        console.log(err)
        return false
    }
}

const imageUpload = (file, folder) => {
    let random = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    let imageName = random + file.name;
    let path = `images/tournaments/${folder}/` + imageName;
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
        const tournament_type = await db.query(`SELECT id,name FROM ${process.env.SCHEMA}.tournament_type`);

        //const city = await db.query(`SELECT id,state_id,city_name FROM city where state_id = ${req.body.state_id}`);
        //const state = await db.query(`SELECT id,country_id,state_name FROM state where country_id = ${req.body.country_id}`);
        //const country = await db.query(`SELECT id,code,name,alias,min_age FROM country`);
        //const sports_category = await db.query(`SELECT id,sports_id,category_name FROM ${process.env.SCHEMA}.sports_category`);
        const sports = await db.query(`SELECT id,sports_name FROM ${process.env.SCHEMA}.sports`);
        return {
            city: city.rows,
            state: state.rows,
            country: country.rows,
            tournament_type: tournament_type.rows,
            sports: sports.rows
        }
    }
    catch (err) {
        return {}
    }
}
const currency = async (req,res) => {
    try{
           var currencydata = "SELECT * FROM currency where status = 1";

           var currencyinfo = await db.query(currencydata);

           var currency = currencyinfo.rows;

           return currency;

    }
    catch(err){
        return false;

    }
}

module.exports = { details, tournament, tournamentTypes, filterVenue, searchSubscriber, tournamentCreate ,currency}