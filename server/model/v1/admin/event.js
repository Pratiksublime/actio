const { schedule } = require('node-cron');
const db = require('../../../db');
const helper = require('../../../helper/helper');
const { logout } = require('../common');
const matchModel = require('./match');

const master = async (req, res) => {
    const result = {};
    try {
        const playerStr = "SELECT gender,id FROM " + process.env.SCHEMA + ".gender";
        const playerType = await db.query(playerStr);
        result.playerType = playerType.rows;

        const eventStr = "SELECT id,type FROM " + process.env.SCHEMA + ".event_type";
        const eventType = await db.query(eventStr);
        result.eventType = eventType.rows;

        const ageStr = "SELECT id,group_name,min_age,max_age FROM " + process.env.SCHEMA + ".age_group";
        const ageGroup = await db.query(ageStr);
        result.ageGroup = ageGroup.rows;

        const sportStr = "SELECT id,sports_name AS sports FROM " + process.env.SCHEMA + ".sports ORDER BY id";
        const sports = await db.query(sportStr);
        result.sports = sports.rows;

        let andCategory = '';
        if (typeof (req.body.sportsID) != "undefined" && req.body.sportsID != null && req.body.sportsID != '') {
            andCategory += " AND sports_id =" + req.body.sportsID;
        }

        // const categoryStr = "SELECT id,sports_id,category_name AS category FROM "+process.env.SCHEMA+".sports_category WHERE 1=1 "+andCategory+" ORDER BY id";
        // const category    = await db.query(categoryStr);
        // result.category   = category.rows;

        const venueStr = "SELECT v.id,v.venue_name,v.address_1,v.address_2,city.city_name AS city,s.state_name AS state,c.name AS Country  FROM " + process.env.SCHEMA + ".venue AS v  INNER JOIN " + process.env.SCHEMA + ".city ON v.city_id=city.id INNER JOIN " + process.env.SCHEMA + ".state AS s ON city.state_id=s.id INNER JOIN " + process.env.SCHEMA + ".country AS c ON s.country_id=c.id WHERE v.status=1 ORDER BY v.id DESC";
        const venue = await db.query(venueStr);
        result.venue = venue.rows;

        const tournamentStr = "SELECT id,tournament_name AS tournament FROM " + process.env.SCHEMA + ".tournament WHERE status=1 ORDER BY id DESC";
        const tournament = await db.query(tournamentStr);
        result.tournament = tournament.rows;

        const cityStr = "SELECT id,city_name AS city FROM " + process.env.SCHEMA + ".city ";
        const city = await db.query(cityStr);
        result.city = city.rows;
    } catch (err) {
        result.playerType = [];
        result.eventType = [];
        result.ageGroup = [];
        result.sports = [];
        // result.category   = [];
        result.venue = [];
        result.tournament = [];
        result.city = [];
    }

    return result;
}

const add = async (req, res) => {
    const result = {};
    try {
        let tournamentQuery = await db.query(`
        SELECT to_char(tournament_start_date,'YYYY-MM-DD') AS tournament_start_date,

        to_char(tournament_end_date,'YYYY-MM-DD') AS tournament_end_date,
        tournament_start_time AS tournament_start_time,
        tournament_end_time AS tournament_end_time,
        to_char(tournament_registration_open_date,'YYYY-MM-DD') AS tournament_registration_open_date,
        to_char(tournament_registration_end_date,'YYYY-MM-DD') AS tournament_registration_end_date
         FROM tournament WHERE id=${req.body.tournamentID};`);

       // "SELECT to_char(tournament_start_date,'DD-MM-YYYY') AS tournament_start_date,
       //  to_char(tournament_end_date,'DD-MM-YYYY') AS tournament_end_date,
       //  (tournament_start_time,'HH24:MI:SS') AS tournament_start_time,
       //  (tournament_end_time,'HH24:MI:SS') AS tournament_end_time,
       //  to_char(tournament_registration_open_date,'DD-MM-YYYY') AS tournament_registration_open_date,
       //  to_char(tournament_registration_end_date,'DD-MM-YYYY') AS tournament_registration_end_date
       //   FROM tournament WHERE id=${req.body.tournamentID};`);"

        //console.log("tournamentQuery....."); 
        //console.log(tournamentQuery);


        tournamentQuery = (tournamentQuery.rowCount) ? tournamentQuery.rows[0] : {};

        let eventStartDate;
        if (req.body.eventStartDate) {
            let streventStartDate = req.body.eventStartDate.split('-');
            eventStartDate = streventStartDate[2] + '-' + streventStartDate[1] + '-' + streventStartDate[0];
        }
        else {
            eventStartDate = tournamentQuery.tournament_start_date
        }
        let eventEndDate;
        if (req.body.eventEndDate) {
            let streventEndDate = req.body.eventEndDate.split('-');
            eventEndDate = streventEndDate[2] + '-' + streventEndDate[1] + '-' + streventEndDate[0];
        }
        else {
            eventEndDate = tournamentQuery.tournament_end_date;
        }
        let registerStartDate;
        if (req.body.registerStartDate) {
            let strregisterStartDate = req.body.registerStartDate.split('-');
            registerStartDate = strregisterStartDate[2] + '-' + strregisterStartDate[1] + '-' + strregisterStartDate[0];
        }
        else {
            registerStartDate = tournamentQuery.tournament_registration_open_date;
        }
        let registerEndDate;
        if (req.body.registerEndDate) {
            let strregisterEndDate = req.body.registerEndDate.split('-');
            registerEndDate = strregisterEndDate[2] + '-' + strregisterEndDate[1] + '-' + strregisterEndDate[0];
        }
        else {
            registerEndDate = tournamentQuery.tournament_registration_end_date;
        }
        let endBirdField = '', strearlyBirdEndDate = '';
        if (req.body.earlyBirdEndDate) {
            endBirdField = ',early_bird_end_date'
            strearlyBirdEndDate = req.body.earlyBirdEndDate.split('-');
            strearlyBirdEndDate = ",'" + strearlyBirdEndDate[2] + '-' + strearlyBirdEndDate[1] + '-' + strearlyBirdEndDate[0] + "'";
        }

        if (typeof (req.body.noofTeam) == "undefined" || req.body.noofTeam == '') {
            req.body.noofTeam = 0;
        }

        if (typeof (req.body.minPerTeam) == "undefined" || req.body.minPerTeam == '') {
            req.body.minPerTeam = 0;
        }

        if (typeof (req.body.maxPerTeam) == "undefined" || req.body.maxPerTeam == '') {
            req.body.maxPerTeam = 0;
        }

        if (typeof (req.body.amount) == "undefined" || req.body.amount == '') {
            req.body.amount = null;
        }
        if (typeof (req.body.birdDiscount) == "undefined" || req.body.birdDiscount == '') {
            req.body.birdDiscount = null;
        }

        if (!req.body.fromSlot) {
            req.body.fromSlot = tournamentQuery.tournament_start_time
        }

        if(typeof req.body.fromSlot == undefined || req.body.fromSlot){
            req.body.fromSlot =null
        }

        if (!req.body.toSlot) {
            req.body.toSlot = tournamentQuery.tournament_end_time
        }


        if(req.body.toSlot || typeof req.body.toSlot == undefined ){
           
            req.body.toSlot = null
        }

        if (!req.body.noofTeam) {
            req.body.noofTeam = null
        }

        if (!req.body.playerType) {
            req.body.playerType = null
        }
        if (!req.body.venueID) {
            req.body.venueID = null
        }

        if (typeof (req.body.registration_fee) == "undefined" || req.body.registration_fee == '') {
            req.body.registration_fee = null;
        }

        if (typeof (req.body.early_bird_last_date) == "undefined" || req.body.early_bird_last_date == '') {
            //req.body.early_bird_last_date = "0000-00-00 00:00:00";
            req.body.early_bird_last_date = null;
        }

        if (typeof (req.body.early_bird_discount) == "undefined" || req.body.early_bird_discount == '') {
            req.body.early_bird_discount = null;
        }

        if (typeof (req.body.discount_type) == "undefined" || req.body.discount_type == '') {
            req.body.discount_type = null;
        }

        if (typeof (req.body.discount_value) == "undefined" || req.body.discount_value == '') {
            req.body.discount_value = null;
        }


        // let amountField = '',amountValue = ''
        // if(typeof(req.body.amount) == "undefined" || req.body.amount == '') {
        //     amountField = ',amount'
        //     amountValue = req.body.amount;
        // }

        // let birdAmountField = '',birdAmountValue = ''
        // if(typeof(req.body.birdDiscount) == "undefined" || req.body.birdDiscount == '') {
        //     birdAmountField = ',bird_discount'
        //     birdAmountValue = req.body.birdDiscount;
        // }
        req.body.event_venue_name = req.body.event_venue_name ? req.body.event_venue_name : '';
        req.body.status = req.body.status ? req.body.status : 1;
        //req.body.fromSlot = req.body.fromSlot.length > 10 ? req.body.fromSlot.slice(0, 8) : '00:00:00';
        //const addStr = "INSERT INTO " + process.env.SCHEMA + ".event (registration_fee, early_bird_last_date, early_bird_discount, discount_type, discount_value, event_name,tournament_id,sports_id,description,no_of_team,min_member_per_team,max_member_per_team,amount,bird_discount,player_type_id,min_age_group_id,max_age_group_id,event_start_date,event_end_date,from_time_slot,to_time_slot,register_start_date,register_end_date,venue,venue_id,status,created_by,event_type_id" + endBirdField + ") VALUES ('" + req.body.eventName + "'," + req.body.tournamentID + "," + req.body.sportsID + ",'" + ((req.body.description) ? req.body.description : '') + "'," + req.body.noofTeam + "," + req.body.minPerTeam + "," + req.body.maxPerTeam + "," + req.body.amount + "," + req.body.birdDiscount + "," + req.body.playerType + "," + req.body.minAgegroup + "," + req.body.maxAgegroup + ",'" + eventStartDate + "','" + eventEndDate + "','" + req.body.fromSlot + "','" + req.body.toSlot + "','" + registerStartDate + "','" + registerEndDate + "'," + req.body.venueID + "," + req.body.venueID + "," + req.body.status + "," + req.myID + "," + req.body.eventTypeID + strearlyBirdEndDate + ")";


        if (typeof (req.body.registration_fee) == "undefined" || req.body.registration_fee == '') {
            req.body.registration_fee = null;
        }

        if (typeof (req.body.early_bird_last_date) == "undefined" || req.body.early_bird_last_date == '') {
            req.body.early_bird_last_date = null;
        }

        if (typeof (req.body.early_bird_discount) == "undefined" || req.body.early_bird_discount == '') {
            req.body.early_bird_discount = null;
        }

        if (typeof (req.body.discount_type) == "undefined" || req.body.discount_type == '') {
            req.body.discount_type = null;
        }

        if (typeof (req.body.discount_value) == "undefined" || req.body.discount_value == '') {
            req.body.discount_value = null;
        }
        if (typeof (req.body.sportsID) == "undefined" || req.body.sportsID == '') {
            req.body.sportsID = null;
        }
        if (typeof (req.body.currency) == "undefined" || req.body.currency == '') {
            req.body.currency = null;
        }
      var event_description_a = req.body.description;
      var event_description = (event_description_a.replace(/'/g, '')); 


        const addStr = "INSERT INTO " + process.env.SCHEMA + ".event (sports_id,currency,subsport_id,registration_fee, early_bird_last_date, early_bird_discount, discount_type, discount_value, event_name,tournament_id,description,no_of_team,min_member_per_team,max_member_per_team,amount,bird_discount,player_type_id,min_age_group_id,max_age_group_id,event_start_date,event_end_date,from_time_slot,to_time_slot,register_start_date,register_end_date,venue_id,status,created_by,event_type_id" + endBirdField + ") VALUES ('" + req.body.sportsID + "',"+req.body.currency+",'"+req.body.subsport_id+"','" + req.body.amount + "', " + req.body.early_bird_last_date + ", '" + req.body.early_bird_discount + "', '" + req.body.discount_type + "', '" + req.body.discount_value + "', '" + req.body.eventName + "'," + req.body.tournamentID + ",'" + event_description + "'," + req.body.noofTeam + "," + req.body.minPerTeam + "," + req.body.maxPerTeam + "," + req.body.amount + "," + req.body.birdDiscount + "," + req.body.playerType + "," + req.body.minAgegroup + "," + req.body.maxAgegroup + ",'" + eventStartDate + "','" + eventEndDate + "'," + req.body.fromSlot + "," + req.body.toSlot + ",'" + registerStartDate + "','" + registerEndDate + "'," + req.body.venueID + "," + req.body.status + "," + req.myID + "," + req.body.eventTypeID + strearlyBirdEndDate + ")";


 //const addStr = "INSERT INTO " + process.env.SCHEMA + ".event (registration_fee, early_bird_last_date, early_bird_discount, discount_type, discount_value, event_name,tournament_id,description,no_of_team,min_member_per_team,max_member_per_team,amount,bird_discount,player_type_id,min_age_group_id,max_age_group_id,event_start_date,event_end_date,from_time_slot,to_time_slot,register_start_date,register_end_date,venue_id,status,created_by,event_type_id" + endBirdField + ") VALUES ('" + req.body.amount + "', " + req.body.early_bird_last_date + ", '" + req.body.early_bird_discount + "', '" + req.body.discount_type + "', '" + req.body.discount_value + "', '" + req.body.eventName + "'," + req.body.tournamentID + ",'" + ((req.body.description) ? req.body.description : '') + "'," + req.body.noofTeam + "," + req.body.minPerTeam + "," + req.body.maxPerTeam + "," + req.body.amount + "," + req.body.birdDiscount + "," + req.body.playerType + "," + req.body.minAgegroup + "," + req.body.maxAgegroup + ",'" + eventStartDate + "','" + eventEndDate + "','" + req.body.fromSlot + "','" + req.body.toSlot + "','" + registerStartDate + "','" + registerEndDate + "'," + req.body.venueID + "," + req.body.status + "," + req.myID + "," + req.body.eventTypeID + strearlyBirdEndDate + ")";

        console.log("addStr:////// ");
        console.log(addStr);
        
        await db.query(addStr);

        let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".event','id'))";
        const eventID = await db.query(strID);

         console.log("strID: ");
        console.log(strID);

        /* let managerStr = "INSERT INTO "+process.env.SCHEMA+".event_managers (event_id,subscriber_id,additional_email,additional_contact,created_by) VALUES ";
        req.body.manager.forEach(e => {
            managerStr += "( '"+eventID.rows[0].currval+"','"+e.id+"','"+e.additionalEmail+"','"+e.additionalContact+"',"+req.myID+"),";
        });
        managerStr = managerStr.replace(/(^,)|(,$)/g, "");
        managerStr +=";";
        await db.query(managerStr); */

        if (typeof (req.body.manager) != "undefined" && req.body.manager.length > 0) {
            let managerStr = "";
            req.body.manager.forEach(e => {
                managerStr += " INSERT INTO " + process.env.SCHEMA + ".event_managers (event_id,subscriber_id,additional_email,additional_contact,created_by,status) VALUES ( " + eventID.rows[0].currval + "," + e.id + ",'" + e.additionalEmail + "','" + e.additionalContact + "'," + req.myID + ",1) ON CONFLICT (event_id,subscriber_id)  DO UPDATE SET additional_email = '" + e.additionalEmail + "',additional_contact = '" + e.additionalContact + "' , updated_at=NOW() , updated_by=" + req.myID + " ,status=1 ;";
            });
            await db.query(managerStr);
        }

        if (typeof (req.body.manager) != "undefined" && req.body.manager.length > 0) {
            let managerStr = "";
            req.body.manager.forEach(e => {
                managerStr += " INSERT INTO " + process.env.SCHEMA + ".event_managers (event_id,subscriber_id,additional_email,additional_contact,created_by,status) VALUES ( " + eventID.rows[0].currval + "," + e.id + ",'" + e.additionalEmail + "','" + e.additionalContact + "'," + req.myID + ",1) ON CONFLICT (event_id,subscriber_id)  DO UPDATE SET additional_email = '" + e.additionalEmail + "',additional_contact = '" + e.additionalContact + "' , updated_at=NOW() , updated_by=" + req.myID + " ,status=1 ;";
            });
            await db.query(managerStr);
        }

        let event_awards = req.body.event_awards;
        let awardsPath = 'images/awards/';

        if (event_awards && typeof event_awards !=="undefined" && event_awards.length>0) {
                console.log("event_awards: ");
                for (let i of event_awards) {
                    console.log("event_awards foor loop: ")
                    //let logo = i.AffLogo;
                    let logo = i.logo;
                    console.log("logo: ");
                    console.log(logo);

                    if (Array.isArray(logo) && logo.length) {
                        console.log("if ===");
                        let uploadPath = helper.uploadBase64(i.logo.toString(), awardsPath);
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.event_awards(
                            name, logo, created_at, event_id)
                            VALUES ('${i.name}', '${uploadPath.path}', now(), ${eventID.rows[0].currval})`)*/

                        await db.query(`INSERT INTO ${process.env.SCHEMA}.event_awards(
                            awards_type, position, description, logo, created_at, event_id)
                            VALUES ('${i.awards_type_id}', '${i.position}', '${i.description}', '${uploadPath.path}', now(), ${eventID.rows[0].currval})`)
                    }
                    else {
                        console.log("else ===");
                        /*await db.query(`INSERT INTO ${process.env.SCHEMA}.event_awards(
                                name, logo, created_at, event_id)
                                VALUES ('${i.name}', null, now(), ${eventID.rows[0].currval})`)*/
                        await db.query(`INSERT INTO ${process.env.SCHEMA}.event_awards( 
                            awards_type, position, description, logo, created_at, event_id)
                                VALUES ('${i.awards_type_id}', '${i.position}', '${i.description}', null, now(), ${eventID.rows[0].currval})`)
                    }
                }
            }

        if (Array.isArray(req.body.controller) && req.body.controller.length) {
            let controllerstr = "";
            let submenuInsert = "";
            for (let e of req.body.controller) {
                controllerstr += ` INSERT INTO ${process.env.SCHEMA}.event_controllers (event_id,subscriber_id,status,created_at) VALUES (${eventID.rows[0].currval},${e.subscriberId},1,now());`
                //let controller = await db.query(`SELECT id FROM menu_permission WHERE subscriber_id=${e.id} AND sub_menu_id IN (12,13);`) 
                /*submenuInsert += `INSERT INTO public.menu_permission(
                    sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                    VALUES (12, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                    INSERT INTO public.menu_permission(
                        sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                        VALUES (13, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                        INSERT INTO public.menu_permission(
                            sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                            VALUES (14, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;`*/

                            submenuInsert += `INSERT INTO public.menu_permission(id, 
                    sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                    VALUES (null, 12, ${e.subscriberId}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                    INSERT INTO public.menu_permission(id, 
                        sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                        VALUES (null, 13, ${e.subscriberId}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                        INSERT INTO public.menu_permission(id, 
                            sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                            VALUES (null ,14, ${e.subscriberId}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;`
            }
            await db.query(controllerstr);
            await db.query(submenuInsert)

            // let menuInsert = ''
            // for(let j of subscriberIdsToInsert) {
            //     menuInsert += `INSERT INTO public.menu_permission(
            //         sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
            //         VALUES (12, ${j.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
            //         INSERT INTO public.menu_permission(
            //             sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
            //             VALUES (13, ${j.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
            //         `
            // }
            // if(menuInsert) {
            //     await db.query(menuInsert);
            // }
            // ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING
        }

        let tournamentId = req.body.tournamentID;
        let subscriberIdsToInsert = [];
        let allIdquery = `
        SELECT subscriber_id FROM tournament_organizers WHERE tournament_id = ${tournamentId}
        UNION 
        SELECT subscriber_id FROM tournament_directors WHERE tournament_id = ${tournamentId}`;
        let subRows = await db.query(allIdquery);
        if (subRows.rowCount) {
            subscriberIdsToInsert = subRows.rows.map((item) => item.subscriber_id);
        }

        let menuInsert = ''
        for (let j of subscriberIdsToInsert) {
            menuInsert += `INSERT INTO public.menu_permission(
                sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                VALUES (12, ${j}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                INSERT INTO public.menu_permission(
                sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                VALUES (13, ${j}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                `;
        }

        if (menuInsert) {
            await db.query(menuInsert);
        }
        let imageStr = "INSERT INTO " + process.env.SCHEMA + ".event_attachment (event_id,type,attachment,created_by) VALUES";
        req.body.eventImage.forEach(e => {
            imageStr += "( '" + eventID.rows[0].currval + "','" + e.type + "','" + e.imagePath + "'," + req.myID + "),";
        });
        imageStr = imageStr.replace(/(^,)|(,$)/g, "");
        imageStr += ";";
        if (req.body.eventImage.length) {
            await db.query(imageStr);
        }
        result.id = eventID.rows[0].currval;
    } catch (err) {
        console.log(err)
        result.id = false;
    }

    return result;
}

const list = async (req, res) => {
    const result = {};
    try {
        let and = '';
        let groupby = '';
        if (typeof (req.body.role) != "undefined" && req.body.role != null && (req.body.role == process.env.ROLE_ORGANIZER || req.body.role == process.env.ROLE_MANAGER)) {
            and += " AND ( e.created_by =" + req.myID + " OR  e.id IN (SELECT DISTINCT event_id FROM " + process.env.SCHEMA + ".event_managers WHERE subscriber_id = " + req.myID + " AND status=1 ) )";
        }

        if (typeof (req.body.eventID) != "undefined" && req.body.eventID != null && req.body.eventID != '') {
            and += " AND e.id =" + req.body.eventID;
        }

        if (typeof (req.body.search) != "undefined" && req.body.search != null && req.body.search != '') {
            and += " AND LOWER(e.event_name) LIKE '%" + req.body.search.toLowerCase() + "%' ";
        }

        if (typeof (req.body.cityID) != "undefined" && req.body.cityID !== null && req.body.cityID != '') {
            and += " AND v.city_id=" + req.body.cityID;
        }

        if (typeof (req.body.range) != "undefined" && req.body.range !== null && req.body.range != '') {
            //and += " AND e.tournament_id="+req.body.tournamentID;
            groupby = " group by e.id,tour.tournament_name ,s.sports_name ,e.tournament_id,e.sports_id, e.event_name,e.description,e.no_of_team,e.min_member_per_team,e.max_member_per_team,e.amount,e.bird_discount,e.min_age_group_id,e.max_age_group_id,e.player_type_id,e.event_type_id,e.event_start_date,e.event_end_date,e.from_time_slot,e.to_time_slot,e.register_start_date,e.register_end_date,e.status,e.created_by,e.created_at,e.event_start_date,v.latitude,v.longitude,v.id,v.venue_name,v.address_1,v.address_2,city.city_name,st.state_name,co.name,v.zip_code,a_min.id,a_max.id,p_t.type,e_t.type having calculate_distance(v.latitude,v.longitude," + req.body.latitude + ", " + req.body.longitude + " , 'K') < " + req.body.range + "";
        }

        if (typeof (req.body.priceFrom) != "undefined" && req.body.priceFrom !== null && req.body.priceFrom != '' && typeof (req.body.priceTo) != "undefined" && req.body.priceTo !== null && req.body.priceTo != '') {
            and += " AND e.amount  BETWEEN " + req.body.priceFrom + " AND " + req.body.priceTo;
        }

        if (typeof (req.body.tournamentID) != "undefined" && req.body.tournamentID !== null && req.body.tournamentID != '') {
            and += " AND e.tournament_id=" + req.body.tournamentID;
        }

        if (typeof (req.body.sportsID) != "undefined" && req.body.sportsID !== null && req.body.sportsID != '') {
            and += " AND e.sports_id=" + req.body.sportsID;
        }

        if (typeof (req.body.categoryID) != "undefined" && req.body.categoryID !== null && req.body.categoryID != '') {
            and += " AND e.category_id=" + req.body.categoryID;
        }

        if (typeof (req.body.status) != "undefined" && req.body.status !== null && req.body.status != '') {
            and += " AND e.status=" + req.body.status;
        }

        let selectand = '';
        if (req.body.nearMe) {
            selectand = " ,calculate_distance(v.latitude,v.longitude," + req.body.latitude + ", " + req.body.longitude + " , 'K') AS distance ";
        }

        let eventselectStr = "SELECT e.id,tour.tournament_name , s.sports_name ,e.tournament_id," +
            `CASE WHEN e.early_bird_end_date IS NULL  THEN
        ''
        ELSE 
        to_char(e.early_bird_end_date,'DD-MM-YYYY')
        END as early_bird_end_date,
        array_to_json(array(SELECT d FROM (SELECT sub.id,sub.subscriber_id,sub.username,sub.mobile_number,sub.email_id from event_controllers as econ LEFT JOIN subscriber as sub ON sub.subscriber_id = econ.subscriber_id WHERE econ.event_id=e.id) d)) AS event_controllers,
        ` 
            + "e.sports_id,o.olympic_name as champ_name,s.sports_name,tour.tournament_name,e.event_name,e.is_upload,e.description,e.no_of_team,e.min_member_per_team,e.max_member_per_team,e.amount,e.bird_discount,e.min_age_group_id,e.max_age_group_id,e.player_type_id,e.event_type_id,to_char(e.event_start_date,'DD-MM-YYYY') AS event_start_date,to_char(e.event_end_date,'DD-MM-YYYY') AS event_end_date,to_char(e.from_time_slot,'HH12:MI AM') AS from_time_slot,to_char(e.to_time_slot,'HH12:MI AM') AS to_time_slot,to_char( e.from_time_slot,'HH24:MI:SS') AS from_time,to_char(e.to_time_slot,'HH24:MI:SS') AS to_time,to_char(e.register_start_date,'DD-MM-YYYY') AS register_start_date,to_char(e.register_end_date,'DD-MM-YYYY') AS register_end_date,e.status,e.created_by,to_char(e.created_at,'DD-MM-YYYY HH12:MI:SS AM') AS created_at,to_char(e.event_start_date,'DD') AS f_e_start_day,to_char(e.event_start_date,'Month') AS f_e_start_month,to_char(e.event_start_date,'YYYY') AS f_e_start_year,to_char(e.event_start_date,'DY MON DD YYYY') AS f_e_start_date,to_char(e.event_end_date,'DY MON DD YYYY') AS f_e_end_date, to_char(e.register_start_date,'DY MON DD YYYY') AS f_r_start_date,to_char(e.register_end_date,'DY MON DD YYYY') AS f_r_end_date,CASE WHEN CURRENT_DATE < e.register_start_date THEN '3' WHEN CURRENT_DATE >= e.register_start_date AND CURRENT_DATE <= e.register_end_date THEN '1' WHEN CURRENT_DATE >= e.register_end_date THEN '2' END AS event_status,v.id AS venue_id,v.venue_name,v.address_1,v.address_2,city.city_name,st.state_name,co.name AS country_name,v.latitude,v.longitude,v.zip_code,(SELECT attachment FROM " + process.env.SCHEMA + ".event_attachment AS e_a WHERE e_a.event_id=e.id AND e_a.type='banner' LIMIT 1)  AS banner,array_to_json (array((SELECT d FROM (SELECT e_a.id , e_a.attachment FROM " + process.env.SCHEMA + ".event_attachment AS e_a WHERE e_a.event_id=e.id AND e_a.type!='banner' AND e_a.status=1 ORDER BY e_a.id) d)))AS images,array_to_json (array((SELECT d FROM (SELECT s.id,s.subscriber_id,s.full_name,s.isd_code||s.mobile_number AS mobile,s.email_id,e_m.additional_email,e_m.additional_contact FROM " + process.env.SCHEMA + ".event_managers AS e_m INNER JOIN " + process.env.SCHEMA + ".subscriber AS s on e_m.subscriber_id=s.id WHERE e_m.event_id=e.id AND e_m.status=1 ) d)))AS  managers,CASE WHEN a_min.min_age <= a_max.min_age THEN a_min.min_age ELSE a_max.min_age END AS c_min_age,CASE WHEN a_min.max_age >= a_max.max_age THEN a_min.max_age ELSE a_max.max_age END AS c_max_age , a_min.group_name AS min_name,a_max.group_name AS max_name,p_t.type AS player_type,e_t.type AS event_type";

        let eventOtherstr = " FROM " + process.env.SCHEMA + ".event AS e LEFT JOIN " + process.env.SCHEMA + ".tournament AS tour ON e.tournament_id = tour.id LEFT join olympic as o on o.id = tour.olympics_sports LEFT JOIN " + process.env.SCHEMA + ".sports AS s ON e.sports_id = s.id LEFT JOIN " + process.env.SCHEMA + ".player_type AS p_t ON e.player_type_id = p_t.id LEFT JOIN " + process.env.SCHEMA + ".venue AS v ON e.venue_id=v.id LEFT JOIN " + process.env.SCHEMA + ".city AS city ON v.city_id=city.id LEFT JOIN " + process.env.SCHEMA + ".state AS st ON city.state_id = st.id LEFT JOIN " + process.env.SCHEMA + ".country AS co ON st.country_id=co.id LEFT JOIN " + process.env.SCHEMA + ".age_group AS a_min ON e.min_age_group_id = a_min.id LEFT JOIN " + process.env.SCHEMA + ".age_group AS a_max ON e.max_age_group_id = a_max.id LEFT JOIN " + process.env.SCHEMA + ".event_type AS e_t ON e.event_type_id=e_t.id WHERE e.status = 1 " + and + "";
        let eventsStr = eventselectStr + eventOtherstr + groupby + " ORDER BY e.id DESC"; 
        console.log('eventsStr');
        console.log(eventsStr);
        const list = await db.query(eventsStr);

        var data = list.rows;
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].id);
            let eventStr = "SELECT  * FROM " + process.env.SCHEMA + ".event_awards WHERE id=" + data[i].id + "";
            let eventawards = await db.query(eventStr);
            data[i].awards_list = eventawards.rows;
        }
        result.list = list.rows;

        if (req.body.nearMe) {
            let nearStr = eventselectStr + selectand + eventOtherstr + groupby + " ORDER BY distance";
            const near = await db.query(nearStr);
            result.near = near.rows;
        } else {
            result.near = [];
        }
    } catch (err) {
        result.list = [];
        result.near = [];
    }
    return result;
}

const allowEdit = async (id, res) => {
    const result = {};
    try {
        let eventStr = "SELECT CASE  WHEN CURRENT_DATE < register_end_date THEN '1' ELSE '0' END AS allow FROM " + process.env.SCHEMA + ".event WHERE id=" + id + "";
        let event = await db.query(eventStr);
        result.event = event.rows;
    } catch (err) {
        result.event = [];
    }

    return result.event;
}

const edit = async (req, res) => {
    const result = {};
    try {
        if (typeof (req.body.managerRemove) != "undefined" && req.body.managerRemove.length > 0) {
            let removeManagerStr = "UPDATE " + process.env.SCHEMA + ".event_managers SET status=0 , updated_at = NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND subscriber_id IN (" + req.body.managerRemove.toString() + ")";
            await db.query(removeManagerStr);
        }

        if (typeof (req.body.manager) != "undefined" && req.body.manager.length > 0) {
            let managerStr = "";
            req.body.manager.forEach(e => {
                managerStr += " INSERT INTO " + process.env.SCHEMA + ".event_managers (event_id,subscriber_id,additional_email,additional_contact,created_by,status) VALUES ( " + req.body.eventID + "," + e.id + ",'" + e.additionalEmail + "','" + e.additionalContact + "'," + req.myID + ",1) ON CONFLICT (event_id,subscriber_id)  DO UPDATE SET additional_email = '" + e.additionalEmail + "',additional_contact = '" + e.additionalContact + "' , updated_at=NOW() , updated_by=" + req.myID + " ,status=1 ;";
            });
            await db.query(managerStr);
        }

        if (typeof (req.body.eventOtherImage) != "undefined" && req.body.eventOtherImage.length > 0) {
            let otherImageStr = "INSERT INTO " + process.env.SCHEMA + ".event_attachment (event_id,type,attachment,created_by) VALUES";
            req.body.eventOtherImage.forEach(e => {
                otherImageStr += "( '" + req.body.eventID + "','" + e.type + "','" + e.imagePath + "'," + req.myID + "),";
            });
            otherImageStr = otherImageStr.replace(/(^,)|(,$)/g, "");
            otherImageStr += ";";
            await db.query(otherImageStr);
        }

        console.log("banner if model req.body.bannerImage++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
        console.log(req.body.bannerImage);

        if (req.body.bannerImage) {

            console.log("req.body.bannerImage if: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

            let strIDFetch = "SELECT * from " + process.env.SCHEMA + ".event_attachment where event_id = "+req.body.eventID;
            var checkResultFetch = await db.query(strIDFetch);


            console.log("strIDFetch: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(strIDFetch);

            console.log("checkResultFetch: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(checkResultFetch);

            if(checkResultFetch && checkResultFetch.rowCount>0){

                console.log("checkResultFetch if: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

                let bannerImageUpdateStr = "UPDATE " + process.env.SCHEMA + ".event_attachment SET attachment='" + req.body.bannerImage + "', updated_at=NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND type='banner' ";
                var bannerImageUpdateResult = await db.query(bannerImageUpdateStr);

                console.log("bannerImageUpdateStr: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log(bannerImageUpdateStr);

                console.log("bannerImageUpdateResult: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log(bannerImageUpdateResult);
            }else{
                
                console.log("checkResultFetch else: -----------------------------------------------------------");

                let bannerImageInsertStr = "INSERT INTO " + process.env.SCHEMA + ".event_attachment (event_id,type,attachment,created_by) VALUES ( '" + req.body.eventID + "','banner', '"+ req.body.bannerImage + "'," + req.myID + ")";
                var bannerImageInsertResult = await db.query(bannerImageInsertStr);

                console.log("bannerImageInsertStr: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log(bannerImageInsertStr);

                console.log("bannerImageInsertResult: ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
                console.log(bannerImageInsertResult);

            }
            

        }else{
            console.log("req.body.bannerImage if: --------------------------------------------------------------");
        }

        if (typeof (req.body.otherImageRemove) != "undefined" && req.body.otherImageRemove.length > 0) {
            //let removeotherImageStr = "UPDATE " + process.env.SCHEMA + ".event_attachment SET status=0 , updated_at = NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND id IN (" + req.body.otherImageRemove.toString() + ") AND type='other'";
            let removeotherImageStr = "UPDATE " + process.env.SCHEMA + ".event_attachment SET status=0 , updated_at = NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND id IN (" + req.body.otherImageRemove.toString() + ") ";
            await db.query(removeotherImageStr);
        }

        if (typeof (req.body.removeImages) != "undefined" && req.body.removeImages.length > 0) {
            //let removeotherImageStr = "UPDATE " + process.env.SCHEMA + ".event_attachment SET status=0 , updated_at = NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND id IN (" + req.body.otherImageRemove.toString() + ") AND type='other'";
            let removeotherImageStr = "UPDATE " + process.env.SCHEMA + ".event_attachment SET status=0 , updated_at = NOW() , updated_by=" + req.myID + " WHERE event_id=" + req.body.eventID + " AND attachment IN (" + req.body.removeImages.map(x => "'" + x + "'").toString() + ") ";
            
            console.log("removeotherImageStr: +++");
            console.log(removeotherImageStr);

            await db.query(removeotherImageStr);
        }

        let eventUpdateStr = "UPDATE " + process.env.SCHEMA + ".event SET  updated_at=NOW() , updated_by=" + req.myID;
        console.log('req.body.currency........');
        console.log(req.body.currency);
        if (typeof (req.body.currency) != "undefined" && req.body.currency != '') {
            eventUpdateStr += " , currency='" + req.body.currency + "'"; 
        }
        if (typeof (req.body.subsport_id) != "undefined" && req.body.subsport_id != '') {
            eventUpdateStr += " , subsport_id='" + req.body.subsport_id + "'";
        }

        if (typeof (req.body.early_bird_last_date) != "undefined" && req.body.early_bird_last_date != '') {
            eventUpdateStr += " , early_bird_last_date='" + req.body.early_bird_last_date + "'";
        }

        if (typeof (req.body.early_bird_discount) != "undefined" && req.body.early_bird_discount != '') {
            eventUpdateStr += " , early_bird_discount='" + req.body.early_bird_discount + "'";
        }

        if (typeof (req.body.discount_type) != "undefined" && req.body.discount_type != '') {
            eventUpdateStr += " , discount_type='" + req.body.discount_type + "'";
        }

        if (typeof (req.body.discount_value) != "undefined" && req.body.discount_value != '') {
            eventUpdateStr += " , discount_value='" + req.body.discount_value + "'";
        }

        if (typeof (req.body.tournamentID) != "undefined" && req.body.tournamentID != '') {
            eventUpdateStr += " , tournament_id=" + req.body.tournamentID;
        }

        if (typeof (req.body.eventTypeID) != "undefined" && req.body.eventTypeID != '') {
            eventUpdateStr += " , event_type_id=" + req.body.eventTypeID;
        }

        if (typeof (req.body.eventName) != "undefined" && req.body.eventName != '') {
            eventUpdateStr += " , event_name='" + req.body.eventName + "'";
        }

        if (typeof (req.body.sportsID) != "undefined" && req.body.sportsID != '') {
            eventUpdateStr += " , sports_id=" + req.body.sportsID;
        }

        if (typeof (req.body.categoryID) != "undefined" && req.body.categoryID != '') {
            eventUpdateStr += " , category_id=" + req.body.categoryID;
        }

        if (typeof (req.body.description) != "undefined" && req.body.description != '') {
            eventUpdateStr += " , description='" + req.body.description + "'";
        }

        if (typeof (req.body.noofTeam) != "undefined" && req.body.noofTeam != '') {
            eventUpdateStr += " , no_of_team=" + req.body.noofTeam;
        }

        if (typeof (req.body.minPerTeam) != "undefined" && req.body.minPerTeam != '') {
            eventUpdateStr += " , min_member_per_team=" + req.body.minPerTeam;
        }

        if (typeof (req.body.maxPerTeam) != "undefined" && req.body.maxPerTeam != '') {
            eventUpdateStr += " , max_member_per_team=" + req.body.maxPerTeam;
        }

        if (req.body.amount && typeof (req.body.amount) != "undefined" && req.body.amount != '') {
            eventUpdateStr += " , amount=" + req.body.amount;
        }

        if (typeof (req.body.birdDiscount) != "undefined" && req.body.birdDiscount != '') {
            eventUpdateStr += " , bird_discount=" + req.body.birdDiscount;
        }

        if (typeof (req.body.eventStartDate) != "undefined" && req.body.eventStartDate != '') {
            if (req.body.eventStartDate != null) {
                let streventStartDate = req.body.eventStartDate.split('-');
                let eventStartDate = streventStartDate[2] + '-' + streventStartDate[1] + '-' + streventStartDate[0];
                eventUpdateStr += " , event_start_date='" + eventStartDate + "'";
            }
        }

        if (typeof (req.body.eventEndDate) != "undefined" && req.body.eventEndDate != '') {
            if (req.body.eventEndDate != null) {
                let streventEndDate = req.body.eventEndDate.split('-');
                let eventEndDate = streventEndDate[2] + '-' + streventEndDate[1] + '-' + streventEndDate[0];
                eventUpdateStr += " , event_end_date='" + eventEndDate + "'";
            }
        }

        if (req.body.fromSlot && typeof (req.body.fromSlot) != "undefined" && req.body.fromSlot != '') {
            eventUpdateStr += " , from_time_slot='" + req.body.fromSlot + "'";
        }else{
           eventUpdateStr += " , from_time_slot="+null; 
        }

        if (req.body.toSlot && typeof (req.body.toSlot) != "undefined" && req.body.toSlot != '') {
            eventUpdateStr += " , to_time_slot='" + req.body.toSlot + "'";
        }else{
            eventUpdateStr += " , to_time_slot="+null;
        }

        if (typeof (req.body.registerStartDate) != "undefined" && req.body.registerStartDate != '') {
            if (req.body.registerStartDate != null) {
                let strregisterStartDate = req.body.registerStartDate.split('-');
                let registerStartDate = strregisterStartDate[2] + '-' + strregisterStartDate[1] + '-' + strregisterStartDate[0];
                eventUpdateStr += " , register_start_date='" + registerStartDate + "'";
            }
        }

        else{
             registerStartDate = null;
        }

        if (typeof (req.body.registerEndDate) != "undefined" && req.body.registerEndDate != '') {
            if (req.body.registerEndDate != null) {
                let strregisterEndDate = req.body.registerEndDate.split('-');
                let registerEndDate = strregisterEndDate[2] + '-' + strregisterEndDate[1] + '-' + strregisterEndDate[0];
                eventUpdateStr += " , register_end_date='" + registerEndDate + "'";
            }
        }

        else{

            registerEndDate = null
        }

        if (typeof (req.body.playerType) != "undefined" && req.body.playerType != '') {
            eventUpdateStr += " , player_type_id=" + req.body.playerType;
        }

        if (typeof (req.body.minAgegroup) != "undefined" && req.body.minAgegroup != '') {
            eventUpdateStr += " , min_age_group_id=" + req.body.minAgegroup;
        }

        if (typeof (req.body.maxAgegroup) != "undefined" && req.body.maxAgegroup != '') {
            eventUpdateStr += " , max_age_group_id=" + req.body.maxAgegroup;
        }

        if (typeof (req.body.venueID) != "undefined" && req.body.venueID != '') {
            eventUpdateStr += " , venue_id=" + req.body.venueID;
        }

        if (typeof (req.body.status) != "undefined" && req.body.status != '') {
            eventUpdateStr += " , status =" + req.body.status;
        }

        if (typeof (req.body.earlyBirdEndDate) != "undefined" && req.body.earlyBirdEndDate != '') {
            if (req.body.earlyBirdEndDate != null) {
                let strearlyBirdEndDate = req.body.earlyBirdEndDate.split('-');
                strearlyBirdEndDate = "'" + strearlyBirdEndDate[2] + '-' + strearlyBirdEndDate[1] + '-' + strearlyBirdEndDate[0] + "'";
                eventUpdateStr += " , early_bird_end_date =" + strearlyBirdEndDate;
            }
        }



        if (Array.isArray(req.body.controller) && req.body.controller.length) {
            await db.query(`DELETE FROM event_controllers WHERE event_id = ${req.body.eventID}`)
            let controllerstr = "";
            let submenuInsert = "";
            for (let e of req.body.controller) {
                controllerstr += ` INSERT INTO ${process.env.SCHEMA}.event_controllers (event_id,subscriber_id,status,created_at) VALUES (${req.body.eventID},${e.subscriberId},1,now());`
                //let controller = await db.query(`SELECT id FROM menu_permission WHERE subscriber_id=${e.id} AND sub_menu_id IN (12,13);`) 
                submenuInsert += `INSERT INTO public.menu_permission(
                    sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                    VALUES (12, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                    INSERT INTO public.menu_permission(
                        sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                        VALUES (13, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;
                        INSERT INTO public.menu_permission(
                            sub_menu_id, subscriber_id, status, validity_date, created_at, created_by)
                            VALUES (14, ${e.id}, 1, '2050-05-10', now(), 1) ON CONFLICT ON CONSTRAINT menu_unique_key DO NOTHING;`
            }

            //console.log('controllerstr------------------------------');
            //console.log(controllerstr);

            //console.log('submenuInsert===================================');
            //console.log(submenuInsert);

            await db.query(controllerstr);


            await db.query(submenuInsert)
        }
        eventUpdateStr += " WHERE id=" + req.body.eventID;

        console.log('eventUpdateStr000000000000000000000000000000000000000000+++++++++++++'); 
            console.log(eventUpdateStr);
            console.log('eventUpdateStr000000000000000000000000000000000000000000+++++++++++++');

        var updateEventResult = await db.query(eventUpdateStr);

        console.log("updateEventResult +++000");
        console.log(updateEventResult);

        let event_awards = req.body.award_list;
        let awardsPath = 'images/awards/';

        if (event_awards && typeof event_awards !=="undefined" && event_awards.length>0) {
            console.log("event_awards: ");
            for (let i of event_awards) {
                console.log("event_awards foor loop: ")
                if(i.awards_type_id && typeof i.awards_type_id !== undefined && i.awards_type_id !==""){
                    await db.query(`INSERT INTO ${process.env.SCHEMA}.event_awards(
                        awards_type, created_at, event_id)
                        VALUES ('${i.awards_type_id}', now(), ${req.body.eventID})`)    
                }
                
            }
        }

        result.id = req.body.eventID;
    } catch (err) {

        console.log("err: ------------------------------------------");
        console.log(err);

        result.id = false;
    }
    return result;
}

const validDate = async (req, res) => {
    const result = {};
    try {
        let registerstartdate = "register_start_date";
        if (typeof (req.body.registerStartDate) != "undefined" && req.body.registerStartDate != '') {
            let str_r_s_date = req.body.registerStartDate.split('-');
            let r_s_date = str_r_s_date[2] + '-' + str_r_s_date[1] + '-' + str_r_s_date[0];
            registerstartdate = " '" + r_s_date + "' ";
        }
        let registerenddate = "register_end_date";
        if (typeof (req.body.registerEndDate) != "undefined" && req.body.registerEndDate != '') {
            let str_r_e_date = req.body.registerEndDate.split('-');
            let r_e_date = str_r_e_date[2] + '-' + str_r_e_date[1] + '-' + str_r_e_date[0];
            registerenddate = " '" + r_e_date + "' ";
        }
        let eventstartdate = "event_start_date";
        if (typeof (req.body.eventStartDate) != "undefined" && req.body.eventStartDate != '') {
            let str_e_s_date = req.body.eventStartDate.split('-');
            let e_s_date = str_e_s_date[2] + '-' + str_e_s_date[1] + '-' + str_e_s_date[0];
            eventstartdate = " '" + e_s_date + "' ";
        }
        let eventenddate = "event_end_date";
        if (typeof (req.body.eventEndDate) != "undefined" && req.body.eventEndDate != '') {
            let str_e_e_date = req.body.eventEndDate.split('-');
            let e_e_date = str_e_e_date[2] + '-' + str_e_e_date[1] + '-' + str_e_e_date[0];
            eventenddate = " '" + e_e_date + "' ";
        }
        let dateStr = "SELECT CASE WHEN " + eventstartdate + " > " + eventenddate + " THEN '0' WHEN   " + registerstartdate + " > " + registerenddate + " THEN '0' WHEN " + registerenddate + " > " + eventstartdate + " THEN '0' ELSE '1' END AS allow FROM " + process.env.SCHEMA + ".event WHERE id=" + req.body.eventID + "";
        let eventDate = await db.query(dateStr);
        result.allow = eventDate.rows;
    } catch (err) {
        result.allow = [];
    }
    return result.allow;
}

const nonActiolist = async (req, res) => {
    try {
        let query = `SELECT e.id as event_id,nt.id as tournament_id,* FROM non_actio_events as e INNER JOIN non_actio_tournaments as nt ON nt.id = e.tournament_id;`
        query = await db.query(query);
        if (query.rowCount) {
            return query.rows;
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

const nonActioView = async (req, res) => {
    try {
        let query = `SELECT 
        DISTINCT ON (e.id) e.id,
        e.event_name,
        e.sports_id as event_sports,
        nt.tournament_name,
        nt.tournament_venue as event_venue, 
        s.id as event_state,
        c.id as  event_country, 
        nt.tournament_start_date as event_start_date,
        nt.tournament_end_date as event_end_date,
        to_char(nt.tournament_start_date,'YYYY') AS event_year
        FROM non_actio_events as e
        INNER JOIN non_actio_tournaments as nt
        ON nt.id = e.tournament_id
        INNER JOIN state as s
        ON s.id = nt.tournament_state
        INNER JOIN country as c
        ON c.id = nt.tournament_country
        WHERE e.id = ${req.body.eventID}`
        query = await db.query(query);
        if (query.rowCount) {
            return query.rows[0];
        }
        return {}
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const nonActioEdit = async (req, res) => {
    try {
        let country = '';
        if (req.body.country) {
            country = `tournament_country = ${req.body.country},`
        }
        let state = '';
        if (req.body.state) {
            state = `tournament_state = ${req.body.state},`
        }
        let tournament_name = '';
        if (req.body.tournament_name) {
            tournament_name = `tournament_name = '${req.body.tournament_name}',`
        }
        let from_date = '';
        if (req.body.from_date) {
            from_date = req.body.from_date.split('-');
            from_date = from_date[2] + '-' + from_date[1] + '-' + from_date[0];
            from_date = `tournament_start_date = '${from_date}',`
        }
        let to_date = '';
        if (req.body.to_date) {
            to_date = req.body.to_date.split('-');
            to_date = to_date[2] + '-' + to_date[1] + '-' + to_date[0];
            to_date = `tournament_end_date = '${to_date}',`
        }
        let venue = '';
        if (req.body.venue) {
            venue = `tournament_venue = '${req.body.venue}',`
        }

        let tournamentQuery = `UPDATE non_actio_tournaments SET 
        ${country}
        ${state}
        ${tournament_name}
        ${from_date}
        ${to_date}
        ${venue}
        updated_at = now(),
        updated_by = ${req.myID}
        WHERE id = ${req.body.tournamentID}  
        `;
        tournamentQuery = await db.query(tournamentQuery);

        let ename = ''
        if (req.body.event_name) {
            ename = ` event_name = '${req.body.event_name}',`
        }
        let esports = ''
        if (req.body.event_sports) {
            esports = ` sports_id = '${req.body.event_sports}'`
        }
        let eventQuery = `UPDATE non_actio_events SET 
        ${ename}
        ${esports}
        id = id
        WHERE id = ${req.body.eventID}`;
        eventQuery = await db.query(eventQuery);
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const eventControllerList = async (req, res) => {
    try {
        // let subscriber = await db.query(`select 
        // e.id as event_id,
        // CONCAT(e.id,' - ',e.event_name) as event_id_name,
        // e.event_name as event_name,
        // t.tournament_name,
        // to_char(e.event_start_date,'DD-MM-YYYY') as event_start_date,
        // to_char(e.event_end_date,'DD-MM-YYYY') as event_end_date,
        // to_char(e.from_time_slot,'HH12:MI AM') as from_time,
        // to_char(e.to_time_slot,'HH12:MI AM') as to_time
        // from event_controllers as ec
        // INNER JOIN subscriber as s
        // ON s.subscriber_id = ec.subscriber_id
        // INNER JOIN event as e
        // ON e.id = ec.event_id
        // INNER JOIN tournament as t
        // ON t.id = e.tournament_id
        // WHERE s.id = ${req.myID}`);
        let subscriber = `select 
        e.id as event_id,
        CONCAT(e.id,' - ',e.event_name) as event_id_name,
        e.event_name as event_name,
        t.id as tournament_id,
        t.tournament_name ,
        to_char(e.event_start_date,'DD-MM-YYYY') as event_start_date,
        to_char(e.event_end_date,'DD-MM-YYYY') as event_end_date,
        to_char(e.from_time_slot,'HH12:MI AM') as from_time,
        to_char(e.to_time_slot,'HH12:MI AM') as to_time
        from event AS e 
        INNER JOIN tournament as t
        ON t.id = e.tournament_id
        where
        e.id IN ((select 
        e.id 
        from event AS e 
        INNER JOIN tournament as t
        ON t.id = e.tournament_id
        where
        tournament_id IN (SELECT
        tog.tournament_id
        from tournament_organizers as tog
        LEFT JOIN tournament as t
        ON t.id = tog.tournament_id  
        WHERE tog.subscriber_id = ${req.myID}
        UNION

        select 
        td.tournament_id
        from tournament_directors as td
        INNER JOIN tournament as t
        ON t.id = td.tournament_id  
        WHERE td.subscriber_id = ${req.myID}))
        
        UNION 
        (SELECT 
        e.id 
        FROM event_controllers as ec
        INNER JOIN subscriber as s 
        ON s.subscriber_id = ec.subscriber_id
        INNER JOIN event as e
        ON e.id = ec.event_id
        WHERE s.id = ${req.myID}
        ));`
        subscriber = await db.query(subscriber);
        if (subscriber.rowCount) {
            return {
                data: subscriber.rows
            }
        }
        else {
            return {
                data: []
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

const eventControllerEdit = async (req, res) => {
    try {
        let actualDate = ''
        if (req.body.actual_start_date) {
            actualDate = req.body.actual_start_date.split('-');
            actualDate = actualDate[2] + '-' + actualDate[1] + '-' + actualDate[0];
            actualDate = `actual_start_date = '${actualDate}', `
        }

        let actual_start_time = ''
        if (req.body.actual_start_time) {
            actual_start_time = `actual_start_time = '${req.body.actual_start_time}',`
        }

        let actual_end_time = ''
        if (req.body.actual_end_time) {
            actual_end_time = `actual_end_time = '${req.body.actual_end_time}',`
        }

        let playground = ''
        if (req.body.playground) {
            playground = `playground = '${req.body.playground}',`
        }

        let team_one = ''
        if (req.body.team_one) {
            team_one = `team_one = '${req.body.team_one}',`
        }

        let team_two = ''
        if (req.body.team_two) {
            team_two = `team_two = '${req.body.team_two}',`
        }

        let remarks = ''
        if (req.body.remarks) {
            remarks = `remarks = '${req.body.remarks}',`
        }

        let query = `UPDATE event_controller_details SET
        ${actualDate}
        ${actual_start_time}
        ${actual_end_time}
        ${playground}
        ${team_one}
        ${team_two}
        ${remarks}
        updated_at=now(),
        updated_by = ${req.myID}
        WHERE 
        event_id=${req.body.event_id}
        AND
        match_schedule_id=${req.body.match_schedule_id}`
        await db.query(query);
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const eventControllerAdd = async (req, res) => {
    try {
        let actualDate = req.body.actual_start_date.split('-');
        actualDate = actualDate[2] + '-' + actualDate[1] + '-' + actualDate[0];
        let query = `INSERT INTO event_controller_details(event_id,match_schedule_id,
        actual_start_time,actual_end_time,actual_start_date,playground,team_one,team_two,remarks,status,created_at,created_by) 
       VALUES(${req.body.event_id},${req.body.match_schedule_id},'${req.body.actual_start_time}','${req.body.actual_end_time}','${actualDate}',
        '${req.body.playground}','${req.body.team_one}','${req.body.team_two}','${req.body.remarks}',0,now(),${req.myID})`;

        await db.query(query);
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getEventControllerDetail = async (req, res) => {
    try {
        let subComp = `AND ec.created_by = ${req.myID}`
        if (req.body.noSubscriberCompare) {
            subComp = ''
        }
        //,to_char(ec.actual_start_date,'DD-MM-YYYY') as actual_start_date
        let subscriber = await db.query(`Select *,to_char(ec.actual_start_date,'DD-MM-YYYY') as actual_start_date FROM
        event_controller_details as ec
        WHERE 
        ec.event_id = ${req.body.event_id}
        AND 
        ec.match_schedule_id = ${req.body.match_schedule_id}`);
        if (subscriber.rowCount) {
            return subscriber.rows[0];
        }
        else {
            return {
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

const createplayerStatistics = async (req, res) => {
    try {
        // Clear any existing data
        let deleted = await db.query(`DELETE FROM event_player_statistics WHERE event_id =${req.body.event_id} AND match_id=${req.body.match_id} AND team_id= ${req.body.team_id}`)
        req.body.headers.shift();
        req.body.headers = req.body.headers.map((item) => item.trim())
        let statId = await db.query(`INSERT INTO event_player_statistics(event_id,match_id,team_id,status,created_at,created_by)
        VALUES(${req.body.event_id},${req.body.match_id},${req.body.team_id},1,now(),${req.myID}) RETURNING id;`);
        statId = statId.rows[0].id;
        let insertedIds = [];
        for (let i of req.body.headers) {
            let insertKeys = `INSERT INTO event_player_statistics_keys(key,created_at,created_by,status) VALUES('${i.replace(/'/g, '\'\'')}',now(),${req.myID},1) RETURNING id; `;
            let id = await db.query(insertKeys);
            insertedIds.push(id.rows[0].id);
            // for(let j of req.body.statistics) {
            //     queryBuilder += `INSERT INTO event_player_statistics_details(statistics_id,player_subscriber_id,description,value,status,created_at) VALUES ()`
            // }
        }
        // let statistics = req.body.statistics.map((item) => {
        //     delete item.statistics;
        // })
        let query = '';
        for (let k of req.body.statistics) {
            // insertedkeyIds.push(k.rows[0].id)
            for (let m = 0; m < insertedIds.length; m++) {
                let value = (k[req.body.headers[m]]) ? k[req.body.headers[m]].toString().replace(/'/g, '\'\'') : '-';
                query += `INSERT INTO event_player_statistics_details(statistics_id,player_subscriber_id,key_id,value,status,created_at) 
                    VALUES (${statId},${k.subscriberId},${insertedIds[m]},'${value}',1,now());`
            }
        }
        await db.query(query);
        // // let insertedKeys = await db.query(insertKeys);
        // // console.log(insertedKeys);
        // // let insertedkeyIds = []
        // // for(let k of insertedKeys) {
        // //     insertedkeyIds.push(k.rows[0].id)
        // // }
        // // console.log(req.body.statistics[0]['4\'s']);
        // return;
        // // await db.query()

        // let insert1 = `INSERT INTO event_player_statistics(event_id,match_id,team_id,status,created_at,created_by)VALUES (${req.body.event_id},${req.body.match_id},${req.body.team_id},1,now(),${req.myID}) ON CONFLICT ON CONSTRAINT unqiuecols DO UPDATE SET updated_at = now(), updated_by = ${req.myID} RETURNING id;`;
        // let id = await db.query(insert1) ;
        // id = id.rows[0].id;

        // if(typeof(req.body.statistics) != "undefined" && req.body.statistics.length > 0) {
        //     let statStr = "";
        //     req.body.statistics.forEach(e => {
        //         statStr += " INSERT INTO "+process.env.SCHEMA+".event_player_statistics_details (statistics_id,player_subscriber_id,description,value,status,created_at) VALUES ( "+id+","+e.subscriberId+",'"+e.description+"','"+e.value+"',1,now()) ON CONFLICT ON CONSTRAINT unique_desc DO UPDATE SET value = '"+e.value+"', updated_at=NOW() , status=1 ;";
        //     });
        //     await db.query(statStr);
        // }

        // let insert2 = ``
    }
    catch (err) {
        console.log(err)
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getplayerStatistics = async (req, res) => {
    try {
        if (!req.body.team_id) {
            req.body.team_id = 000
        }
        let query = `SELECT
        ep.subscriber_id,
        epsd.player_subscriber_id,
        ep.full_name,
        regexp_replace(epsk.key, E'[\\n\\r]+', ' ', 'g' ) as key,
        epsd.value
        FROM 
        event_player_statistics_details as epsd
        INNER JOIN event_player_statistics_keys as epsk
        ON epsk.id = epsd.key_id
        INNER JOIN event_player_statistics as eps
        ON epsd.statistics_id = eps.id
        INNER JOIN subscriber as s
        ON s.subscriber_id = epsd.player_subscriber_id
        INNER JOIN event_players as ep 
        ON ep.registration_id = eps.team_id AND s.id = ep.subscriber_id
        WHERE eps.match_id = ${req.body.match_id} and eps.team_id=${req.body.team_id};`
        console.log(query)
        query = await db.query(query);
        let allPlayers = await db.query(`SELECT id,registration_id,subscriber_id,full_name FROM event_players WHERE registration_id =${req.body.team_id}; `);
        let scheduleDetails = {
            body: {
                scheduleID: req.body.match_id
            }
        };
        scheduleDetails = await matchModel.scheduleDetail(scheduleDetails);
        if ('competitor_logo' in scheduleDetails && !scheduleDetails.competitor_logo) {
            scheduleDetails.competitor_logo = 'images/registration/default/p1.png'
        }
        if ('opponent_logo' in scheduleDetails && !scheduleDetails.opponent_logo) {
            scheduleDetails.opponent_logo = 'images/registration/default/p2.png'
        }
        if ('opponent_short_name' in scheduleDetails && scheduleDetails.opponent_short_name == null) {
            scheduleDetails.opponent_short_name = ''
        }
        if ('competitor_short_name' in scheduleDetails && scheduleDetails.competitor_short_name == null) {
            scheduleDetails.competitor_short_name = ''
        }
        let matchStatistics = await matchModel.getMatchStatistics(req);
        if (!allPlayers.rowCount) {
            return {
                display: [],
                subscriber: [],
                scheduleDetails: scheduleDetails,
                matchStatistics: matchStatistics
            };
        }
        allPlayers = allPlayers.rows;
        if (query.rowCount) {
            let rows = query.rows;
            let keys = rows.map(item => item.key).filter((value, index, self) => self.indexOf(value) === index).map((i) => ({ value: i }));
            let existingId = [];
            let players = [];
            rows.forEach((item) => {
                if (!existingId.includes(item.subscriber_id)) {
                    existingId.push(item.subscriber_id)
                    players.push({ value: item.full_name })
                }
            });
            let leftPlayers = allPlayers.filter((item) => !existingId.includes(item.subscriber_id))
            if (leftPlayers.length) {
                let toPush = []
                for (let i of leftPlayers) {
                    players.push({ value: i.full_name })
                    existingId.push(i.subscriber_id)
                    for (let j of keys) {
                        let obj = {
                            key: j.value,
                            value: '-'
                        }
                        toPush.push(obj)
                    }
                }
                rows = rows.concat(toPush)
            }
            let values = []
            for (let k of keys) {
                let obj = {
                    headers: k.value,
                    values: []
                }
                for (let r of rows) {
                    if (r.key == k.value) {
                        obj.values.push({ value: r.value })
                    }
                }
                values.push(obj)
            }
            let returnArray = [
                // {
                //     headers : 'player_ids',
                //     values : existingId.map((item)=>({ value : item}))
                // },
                {
                    headers: 'players',
                    values: players
                },
            ];
            returnArray = returnArray.concat(values)
            return {
                display: returnArray,
                subscriber: existingId.map((item) => ({ value: item })),
                scheduleDetails: scheduleDetails,
                matchStatistics: matchStatistics
            };
        }
        else {
            let returnArray = [
                {
                    headers: 'players',
                    values: allPlayers.map((i) => ({ value: i.full_name }))
                }
            ];
            return {
                display: returnArray,
                subscriber: allPlayers.map((i) => ({ value: i.subscriber_id })),
                scheduleDetails: scheduleDetails,
                matchStatistics: matchStatistics
            };
        }
        // let query = `SELECT epsd.id,epsd.player_subscriber_id,ep.full_name ,epsd.description,epsd.value,ep.registration_id,eps.match_id
        // FROM event_player_statistics_details as epsd
        // INNER JOIN event_player_statistics as eps
        // ON epsd.statistics_id = eps.id
        // INNER JOIN subscriber as sub
        // ON sub.subscriber_id = epsd.player_subscriber_id
        // INNER JOIN event_players as ep
        // ON ep.registration_id = eps.team_id
        // INNER JOIN event as e
        // ON e.id = eps.event_id
        // WHERE eps.match_id = ${req.body.match_id} and ep.registration_id=${req.body.team_id};`;
        // query = await db.query(query);
        // if(query.rowCount) {
        //     let rows = query.rows;
        //     let uniqueDescription = rows.map(item => item.description)
        //     .filter((value, index, self) => self.indexOf(value) === index)
        //     console.log(uniqueDescription);
        //     let players = [];
        //     let values = [];
        //     let subIds = [];
        //     let descriptions = [];
        //     for(let i of uniqueDescription) {
        //         for(let j of rows)  {
        //             if(j.description == i) {
        //                 let subIdObj = {
        //                     subscriberId : j.player_subscriber_id
        //                 }
        //                 let playerObj = {
        //                     player : j.full_name
        //                 };
        //                 let valObj = { 
        //                     value : j.value
        //                 }; 
        //                 let descObj = { 
        //                     value : j.description
        //                 };                        
        //                 subIds.push(subIdObj)
        //                 players.push(playerObj)
        //                 values.push(valObj)
        //                 descriptions.push(descObj)
        //             }
        //             //if(j.value)
        //         }        
        //     }
        // //     return [
        // //         {
        // //             header : 'subIds',
        // //             values : subIds                    
        // //         },
        // //         {
        // //             header : 'players',
        // //             values : players                    
        // //         },
        // //         {
        // //             header : 'description',
        // //             values : descriptions
        // //         },
        // //         {
        // //             header : 'values',
        // //             values : values
        // //         },
        // //     ];
        // //     // let result = {
        // //     // };
        // //     // result.
        // // }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getEventDetails = async (req, res) => {
    try {
        let eventQuery = `SELECT 
        e.id as event_id,
        e.registration_fee,
        e.early_bird_last_date,
        e.early_bird_discount,
        e.discount_type,
        e.discount_value,
        e.event_name,
        t.id as tournament_id,
        t.tournament_name,
        s.id as sports_id,
        s.sports_name,
        array_to_json(array(SELECT d FROM (
			SELECT 
			ems.id as match_id,
			ems.match_name,
			((SELECT e FROM (
				SELECT er.id as event_registration_id,er.team_name,er.coach_name,
				array_to_json(array(SELECT f FROM 
									(SELECT * from event_players AS ep
									 LEFT JOIN subscriber AS s ON s.id = ep.subscriber_id WHERE ep.registration_id = er.id) f)) AS players
				from event_registration as er WHERE id = ems.competitor_id LIMIT 1
			) e)) AS match_competitor,
			((SELECT e FROM (
				SELECT er.id as event_registration_id,er.team_name,er.coach_name,
				array_to_json(array(SELECT f FROM (SELECT * from event_players AS ep
									 LEFT JOIN subscriber AS s ON s.id = ep.subscriber_id WHERE ep.registration_id = er.id) f)) AS players
				from event_registration as er WHERE id = ems.opponent_id LIMIT 1
			) e)) AS match_opponent
			from event_match_schedule AS ems 
			WHERE event_id=${req.body.event_id} AND ems.status = 1
		) d)) AS event_matches
        FROM event AS e
        LEFT JOIN tournament as t
        ON t.id = e.tournament_id
        LEFT JOIN sports as s
        ON s.id = e.sports_id
        WHERE e.id=${req.body.event_id}`;
        let eventDetails = await db.query(eventQuery);
        if (eventDetails.rowCount) {
            let resData = eventDetails.rows[0];
            if (req.body.match_id && Array.isArray(resData.event_matches) && resData.event_matches.length) {
                let matches = resData.event_matches.filter((item) => item.match_id == req.body.match_id)
                resData.event_matches = matches;
            }

            // Awards

            let awards = await db.query(`SELECT a.*, b.award_name FROM ${process.env.SCHEMA}.event_awards a left join subscriber_play_awards_master b on a.awards_type::integer=b.id WHERE a.event_id = ${req.body.event_id}`)
            if (awards.rowCount) {
                for (let item of awards.rows) {
                    if (item.logo) {
                        let logo = [];
                        logo.push(item.logo)
                        item.logo = logo;
                    }
                }
            }
            resData['event_awards'] = awards.rows;
                
            return resData
        }
        else {
            return {}
        }
    }
    catch (err) {

        console.log("err ----------");
        console.log(err);

        return {
            serverError: true,
            error: err.message
        }
    }
}

const getSpecificPlayerStatistics = async (req, res) => {
    try {
        let query = `SELECT 
        s.id,
        ep.full_name,
        to_char(s.date_of_birth,'YYYY-MM-DD') AS date_of_birth,
        er.id as team_id,
        er.team_name,
        gp.position,
        regexp_replace(epsk.key, E'[\\n\\r]+', ' ', 'g' ) as key,
        epsd.value,
        sp.profile_image
        FROM event_player_statistics_details as epsd
        INNER JOIN event_player_statistics as eps 
        ON epsd.statistics_id = eps.id
        INNER JOIN event_player_statistics_keys as epsk
        ON epsk.id = epsd.key_Id
        INNER JOIN subscriber as s
        ON epsd.player_subscriber_id = s.subscriber_id
        INNER JOIN event_players as ep 
        ON ep.subscriber_id = s.id AND ep.registration_id = eps.team_id
        INNER JOIN event_registration as er
        ON er.id = ep.registration_id
        INNER JOIN game_position as gp
        ON gp.id = ep.position_id
        LEFT JOIN subscriber_profile as sp
        ON sp.subscriber_id = s.id
        WHERE s.id=${req.body.subscriber_id} AND er.id = ${req.body.team_id} AND eps.match_id = ${req.body.match_id};`;
        query = await db.query(query);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        if (query.rowCount) {
            const d = new Date(query.rows[0].date_of_birth);
            let obj = {
                subid: query.rows[0].id,
                full_name: query.rows[0].full_name,
                date_of_birth: helper.getAgeFromYYYYMMDD(query.rows[0].date_of_birth) + ` Years (${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()})`,
                team_id: query.rows[0].team_id,
                team_name: query.rows[0].team_name,
                position: query.rows[0].position,
                playerLogo: (query.rows[0].profile_image) ? (query.rows[0].profile_image) : '',
                statistics: query.rows.map((item) => ({
                    header: item.key,
                    value: item.value
                }))
            }
            return obj;
        }
        else {
            let query = await db.query(`SELECT 
                s.id,
                ep.full_name,
                to_char(s.date_of_birth,'YYYY-MM-DD') AS date_of_birth,
                er.id as team_id,
                er.team_name,
                gp.position,
                sp.profile_image
                FROM subscriber as s
                INNER JOIN event_players as ep
                ON ep.subscriber_id = s.id
                INNER JOIN event_registration as er
                ON er.id = ep.registration_id
                INNER JOIN game_position as gp
                ON gp.id = ep.position_id
                LEFT JOIN subscriber_profile as sp
                ON sp.subscriber_id = s.id
                WHERE s.id=${req.body.subscriber_id} AND er.id = ${req.body.team_id};`)
            if (query.rowCount) {
                const d = new Date(query.rows[0].date_of_birth);
                let obj = {
                    subid: query.rows[0].id,
                    full_name: query.rows[0].full_name,
                    date_of_birth: helper.getAgeFromYYYYMMDD(query.rows[0].date_of_birth) + ` Years (${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()})`,
                    team_id: query.rows[0].team_id,
                    team_name: query.rows[0].team_name,
                    position: query.rows[0].position,
                    playerLogo: (query.rows[0].profile_image) ? (query.rows[0].profile_image) : '',
                    statistics: []
                }
                return obj;
            }
            else {
                return {
                    subid: '',
                    full_name: '',
                    date_of_birth: '',
                    team_id: '',
                    team_name: '',
                    position: '',
                    playerLogo: '',
                    statistics: []
                }
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

const eventUpload = async (req, res) => {
    try {
        let result;
        let data = req.body.data.length > 0 ? req.body.data : [];
        if (data.length > 0) {
            for (let item = 0; item < data.length; item++) {
                // console.log(data[item]);
                // Event Start Date
                if (data[item].EventStartDate) {
                    data[item].EventStartDate = data[item].EventStartDate.year + '-' + ("0" + data[item].EventStartDate.month).slice(-2) + '-' + ("0" + data[item].EventStartDate.day).slice(-2);
                } else {
                    data[item].EventStartDate = data[item].tournamentStartDate.year + '-' + ("0" + data[item].tournamentStartDate.month).slice(-2) + '-' + ("0" + data[item].tournamentStartDate.day).slice(-2);
                }

                // Event End Date
                if (data[item].EventEndDate) {
                    data[item].EventEndDate = data[item].EventEndDate.year + '-' + ("0" + data[item].EventEndDate.month).slice(-2) + '-' + ("0" + data[item].EventEndDate.day).slice(-2);
                } else {
                    data[item].EventEndDate = data[item].tournamentEndDate.year + '-' + ("0" + data[item].tournamentEndDate.month).slice(-2) + '-' + ("0" + data[item].tournamentEndDate.day).slice(-2);
                }

                // Registration Open Date
                if (data[item].RegistrationOpenDate) {
                    data[item].RegistrationOpenDate = data[item].RegistrationOpenDate.year + '-' + ("0" + data[item].RegistrationOpenDate.month).slice(-2) + '-' + ("0" + data[item].RegistrationOpenDate.day).slice(-2);
                } else {
                    data[item].RegistrationOpenDate = data[item].tourRegistrationOpenDate.year + '-' + ("0" + data[item].tourRegistrationOpenDate.month).slice(-2) + '-' + ("0" + data[item].tourRegistrationOpenDate.day).slice(-2);
                }

                // Registration Close Date
                if (data[item].RegistrationCloseDate) {
                    data[item].RegistrationCloseDate = data[item].RegistrationCloseDate.year + '-' + ("0" + data[item].RegistrationCloseDate.month).slice(-2) + '-' + ("0" + data[item].RegistrationCloseDate.day).slice(-2);
                } else {
                    data[item].RegistrationCloseDate = data[item].tourRegistrationCloseDate.year + '-' + ("0" + data[item].tourRegistrationCloseDate.month).slice(-2) + '-' + ("0" + data[item].tourRegistrationCloseDate.day).slice(-2);
                }

                let endBirdField = ''; strearlyBirdEndDate = '';
                if (data[item].Earlybirdenddate) {
                    endBirdField = ',early_bird_end_date'
                    strearlyBirdEndDate = data[item].Earlybirdenddate.year + '-' + ("0" + data[item].Earlybirdenddate.month).slice(-2) + '-' + ("0" + data[item].Earlybirdenddate.day).slice(-2);
                    strearlyBirdEndDate = `,'` + strearlyBirdEndDate + `'`;
                }

                if (typeof (data[item].Noofteams) == "undefined" || data[item].Noofteams == '') {
                    data[item].Noofteams = 0;
                }

                if (typeof (data[item].MinPlayer) == "undefined" || data[item].MinPlayer == '') {
                    data[item].MinPlayer = 0;
                }

                if (typeof (data[item].MaxPlayer) == "undefined" || data[item].MaxPlayer == '') {
                    data[item].MaxPlayer = 0;
                }

                if (typeof (data[item].EventRegistrationFee) == "undefined" || data[item].EventRegistrationFee == '') {
                    data[item].EventRegistrationFee = null;
                }
                if (typeof (data[item].EarlyBirdDiscount) == "undefined" || data[item].EarlyBirdDiscount == '') {
                    data[item].EarlyBirdDiscount = null;
                }
                data[item].Status = data[item].Status ? data[item].Status : 1;
                let isUpload = 1;
                /*let uploadQuery = "INSERT INTO " + process.env.SCHEMA + ".event (event_name,tournament_id,sports_id,description,no_of_team,min_member_per_team,max_member_per_team,amount,bird_discount,player_type_id,min_age_group_id,max_age_group_id,event_start_date,event_end_date,from_time_slot,to_time_slot,register_start_date,register_end_date,venue,venue_id,status,created_by,is_upload,event_type_id" + endBirdField + ") VALUES ('"
                    + data[item].EventName + "'," + data[item].Tournament + "," + data[item].EventSport + ",'" + ((data[item].EventDescription) ? data[item].EventDescription : '') + "'," + data[item].Noofteams
                    + "," + data[item].MinPlayer + "," + data[item].MaxPlayer + "," + data[item].EventRegistrationFee + "," + data[item].EarlyBirdDiscount + "," + data[item].Gender + "," + data[item].MinimumAgeGroup
                    + "," + data[item].MaximumAgeGroup + ",'" + data[item].EventStartDate + "','" + data[item].EventEndDate + "','" + data[item].EventStartTime + "','" + data[item].EventEndTime + "','" + data[item].RegistrationOpenDate
                    + "','" + data[item].RegistrationCloseDate + "'," + data[item].Venue + "," + data[item].Venue + "," + data[item].Status + "," + req.myID + "," + isUpload + "," + data[item].EventType + strearlyBirdEndDate + ")";*/

                let uploadQuery = "INSERT INTO " + process.env.SCHEMA + ".event (registration_fee, early_bird_last_date, early_bird_discount, discount_type, discount_value, event_name,tournament_id,sports_id,description,no_of_team,min_member_per_team,max_member_per_team,amount,bird_discount,player_type_id,min_age_group_id,max_age_group_id,event_start_date,event_end_date,from_time_slot,to_time_slot,register_start_date,register_end_date,venue,venue_id,status,created_by,is_upload,event_type_id" + endBirdField + ") VALUES ('"
                    + data[item].EventName + "'," + data[item].Tournament + "," + data[item].EventSport + ",'" + ((data[item].EventDescription) ? data[item].EventDescription : '') + "'," + data[item].Noofteams
                    + "," + data[item].MinPlayer + "," + data[item].MaxPlayer + "," + data[item].EventRegistrationFee + "," + data[item].EarlyBirdDiscount + "," + data[item].Gender + "," + data[item].MinimumAgeGroup
                    + "," + data[item].MaximumAgeGroup + ",'" + data[item].EventStartDate + "','" + data[item].EventEndDate + "','" + data[item].EventStartTime + "','" + data[item].EventEndTime + "','" + data[item].RegistrationOpenDate
                    + "','" + data[item].RegistrationCloseDate + "'," + data[item].Venue + "," + data[item].Venue + "," + data[item].Status + "," + req.myID + "," + isUpload + "," + data[item].EventType + strearlyBirdEndDate + ")";
                    
                await db.query(uploadQuery);
                let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".event','id'))";
                result = await db.query(strID);
            }
            if (result) {
                return result = result.rows[0].currval ? true : false;
            }
        } else {
            return result = false;
        }
    } catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const deletedata = async (req, res) => {
    try {
        console.log("123333");
        let statusStr = "UPDATE event SET status= 2 ,updated_at=now(),updated_by=" + req.myID + " WHERE id=" + req.body.id + "";

        console.log("statusStr....");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    } catch (err) {
        console.log(err)
        return false;  
    }
}

const editevent = async (req,res) =>{
    const result = {};
  try{

    
        var  eventdata = "SELECT e.*,to_char(e.register_end_date,'DD-MM-YYYY') as  register_end_date,to_char(e.register_start_date,'DD-MM-YYYY') as register_start_date,to_char(e.event_start_date,'DD-MM-YYYY') as event_start_date,to_char(e.event_end_date,'DD-MM-YYYY') as event_end_date,t.tournament_name,s.sports_name,v.venue_name FROM event as e LEFT JOIN  tournament as t on t.id = e.tournament_id LEFT JOIN venue as v on v.id = e.venue_id LEFT JOIN sports as s on s.id = sports_id where e.status = 1 and e.id = "+req.body.event_id+"";

        let eventinfo = await db.query(eventdata);

        console.log("editevent eventdata: ++++++++++++++++++++++++");
                console.log(eventdata);

        result['eventdata'] = eventinfo.rows;

            var awardsdata = "SELECT a.*, b.award_name as awards_type from event_awards a left join subscriber_play_awards_master b on a.awards_type::integer=b.id where a.event_id = "+req.body.event_id+"";

            console.log("editevent awardsdata: ++++++++++++++++++++++++");
            console.log(awardsdata);

                let awardsinfo = await db.query(awardsdata); 
                
                
                result['event_awards'] = awardsinfo.rows;

        

        let tournamentImages = await db.query(`SELECT type,attachment FROM ${process.env.SCHEMA}.event_attachment
             WHERE status = 1 and event_id = ${req.body.event_id}`)

            if (tournamentImages.rowCount) {
                const logo = tournamentImages.rows.filter(item => item.type == 'logo').map(item => item.attachment);
                const banner = tournamentImages.rows.filter(item => item.type == 'banner').map(item => item.attachment);
                result['event_logo'] = (logo.length) ? logo[0] : [];
                result['event_banner'] = banner
            }
            else {
                result['event_logo'] = [];
                result['event_banner'] = []
            }
          return result;
  }
  catch(err){
    console.log("editevent err: -----------")
     console.log(err);
  }
}


const updateevent = async(req,res) =>{

    const eventDate = "update event  set event_name = "+req.body.event_name+",sports_id = "+req.body.sports_id+", description ="+req.body.description+",no_of_team = "+req.body.no_of_team+",min_member_per_team = "+req.body.min_member_per_team+",max_member_per_team = "+req.body.max_member_per_team+",player_type_id = "+req.body.player_type_id+"   " 
}


const EventRegistrationlist = async(req,res)=>{
    const result = [];

    try{

        let teamdata = "SELECT r.*,e.event_name from registration as r left join event as e on e.id = r.event_id:: int WHERE r.status = 1 and event_id IS NOT NULL ORDER by r.id DESC";

        let teaminfo = await db.query(teamdata);
            teaminfo = teaminfo.rows;

            console.log(teaminfo);

            for (var i = 0; i < teaminfo.length; i++) {

                teaminfo[i].type = "Team";
                result.push(teaminfo[i]);
            }

            let partidata = "SELECT rs.* ,e.event_name from registration_single_player as rs left join event as e on e.id = rs.event_id:: int WHERE rs.status = 1 and event_id IS NOT NULL ORDER by rs.id DESC";

           let partinfo = await db.query(partidata);
            partinfo = partinfo.rows;

            console.log(partinfo);

            for (var j = 0; j < partinfo.length; j++) { 

                partinfo[j].type = "Participant";
                result.push(partinfo[j]);
            }




            return result;
    }
    catch(err){
        console.log(err);

    }
}



module.exports = {
    getSpecificPlayerStatistics, getEventDetails, createplayerStatistics, getplayerStatistics, getEventControllerDetail, eventControllerEdit,
    eventControllerAdd, nonActioEdit, nonActioView, nonActiolist, master, add, list, allowEdit, edit, validDate, eventControllerList, eventUpload,deletedata,editevent,EventRegistrationlist
}
