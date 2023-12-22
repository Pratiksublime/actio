const db = require('../../../db');
const helper = require('../../../helper/helper');
const moment = require("moment");

const logPush = async (req, res) => {
    const result = {};
    try {
        let message = "Test Message ";
        let uniqueid = new Date().getTime();
        let logStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_push(uniqueid,full_name, isd_code, mobile_number, message) VALUES ";
        req.body.forEach(e => {
            logStr += "( '" + uniqueid + "','" + e.fullName + "','" + e.isdCode + "','" + e.mobileNumber + "','" + message + "' ),";
        });
        logStr = logStr.replace(/(^,)|(,$)/g, "");
        logStr += ";";
        await db.query(logStr);
        result.success = true;
    } catch (err) {
        result.success = false;
    }
    return result;
}


const logBulk = async (req, res) => {
    const result = {};
    try {
        let uniqueid = new Date().getTime();

        console.log("uniqueid----------------------");
        console.log(uniqueid);
        let logStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_bulk(uniqueid,full_name, isd_code, mobile_number, email_id,username,password,date_of_birth,proof_type,proof_number_sole,proof_number_pair,status) VALUES ";

        req.body.forEach(e => {
            let strDOB = e.dob.split('/');
            let newDOB = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
            logStr += "( '" + uniqueid + "','" + e.fullName + "','" + e.isdCode + "','" + e.mobileNumber + "','" + e.emailID + "','" + e.userName + "',MD5('" + e.password + "'),'" + newDOB + "','" + e.idType + "','" + e.idNumber.toString().slice(0, 5) + "','" + e.idNumber.toString().slice(5) + "',0 ),";
        });
        logStr = logStr.replace(/(^,)|(,$)/g, "");
        logStr += ";";
         console.log('logStr...........');
        console.log(logStr);
        await db.query(logStr);
        result.success = true;
    } catch (err) {
        console.log(err);
        result.success = false;
    }
    return result;
}

const updateProfile = async (req, res) => {
    try {
        if (req.body.username) {
            let query = await db.query(`SELECT id FROM subscriber WHERE username='${req.body.username}' AND id != ${req.myID};`);
            if (query.rowCount) {
                return {
                    validationError: true,
                    error: 'Username already exists !'
                }
            }
        }

        var id = req.body.subscriber_id;

         
        let editForm = {
            // Screen 1 
            premium: (req.body.premium) ? `premium = '${req.body.premium}',` : '',
            full_name: (req.body.full_name) ? `full_name = '${req.body.full_name}',` : '', 
            username: (req.body.username) ? `username = '${req.body.username}',` : '',
            proof_type: (req.body.proof_type) ? `proof_type = ${req.body.proof_type},` : '',
            gender: (req.body.gender) ? `gender = ${req.body.gender},` : '',
            height: (req.body.height) ? `height = '${req.body.height}',` : `height = 0,`,
            weight: (req.body.weight) ? `weight = '${req.body.weight}',` : `weight = 0,`,
            birth_place: (req.body.birth_place) ? `birth_place = '${req.body.birth_place}',` : '',
            password: (req.body.password) ? `password = MD5('${req.body.password}'),` : '',
            country: (req.body.country) ? `country =${req.body.country},` : '',
            city: (req.body.city)? `city =${req.body.city},` : '',

            sub_status: (req.body.sub_status) ? `sub_status ='${req.body.sub_status}',` : '',
            state: (req.body.state) ? `state =${req.body.state},` : '',
            isd_code: (req.body.isd_code) ? `isd_code ='${req.body.isd_code}',` : '',
            age: (req.body.age) ? `age =${req.body.age},` : '',
            language: (req.body.language) ? `language ='${req.body.language}',` : '',
            //user_type: 1 ? `user_type = 1,` : '',
            
             
        }

        console.log('req.body.sub_status city_id city city 1123 ')
         console.log(editForm.city);


        // Screen 1 Image uploads

        // editForm_new['profile_image'] = '';
        // let insertProfImage = '';
        // if (req.body.profile_image) {
        //     let isImage = /^data:image/.test(req.body.profile_image);
        //     if (isImage) {
        //         let profilePath_new = 'images/profile/';
        //         let uploaded = helper.uploadBase64(req.body.profile_image, profilePath_new);
        //         editForm['profile_image'] = `profile_image ='${uploaded.path}',`;
        //         insertProfImage = uploaded.path
        //     }
        // }

         /*editForm['profile_image'] = '';
        let insertProfImage = '';
        if (req.body.profile_image) {
            let isImage = /^data:image/.test(req.body.profile_image);
            if (isImage) {
                let profilePath = 'images/profile/';
                let uploaded = helper.uploadBase64(req.body.profile_image, profilePath);
                editForm['profile_image'] = `profile_image ='${uploaded.path}',`;
                insertProfImage = uploaded.path
            }
        }
         console.log('insertProfImage_image---------------');
        console.log(editForm['profile_image']); */
        
        editForm['profile_image'] = '';
        let insertProfImage = null;
        if (req.body.profile_image) {
            let isImage = /^data:image/.test(req.body.profile_image);
            if (isImage) {
                let profilePath = 'images/profile/';
                let uploaded = helper.uploadBase64(req.body.profile_image, profilePath); 

                //console.log("uploaded: ");
                //console.log(uploaded);

                editForm['profile_image'] = `profile_image ='${uploaded.path}',`;
                insertProfImage = uploaded.path
			}
        }

 //console.log('req.body.gender');       
 //console.log(req.body.gender);
         if (typeof req.body.profile_image === "undefined" || req.body.profile_image === " ") {
          
            /* 20102022 8 pm start Sunil
             var profile_image = 'images/default/prof.png';
               
             insertProfImage = profile_image;
             20102022 8 pm start Sunil*/
         }

        // if (req.body.profile_image === " " || req.body.gender === 2) {  
          
        //     var profile_image = 'images/default/prof_1.png';
               
        //     insertProfImage = profile_image;
        // }

        // if (typeof req.body.cover_image === "undefined" || req.body.cover_image === " ") {
          
        //     var cover_image = 'images/default/cover_prof.png';
               
        //     insertcoverImage = cover_image;
        // }

                



        
        editForm['cover_image'] = '';
        let insertcoverImage = '';
        if (req.body.cover_image) {
            let isImage = /^data:image/.test(req.body.cover_image);
            if (isImage) {
                let profilePath = 'images/profile/';
                let uploaded = helper.uploadBase64(req.body.cover_image, profilePath);
                editForm['cover_image'] = `cover_image ='${uploaded.path}',`;
                insertcoverImage = uploaded.path
            }
        }

        editForm['proof_copy_sole'] = '';
        if (req.body.front_image) {
            let isImage = /^data:image/.test(req.body.front_image);
            if (isImage) {
                let proofPath = 'images/proof/';
                let uploaded = helper.uploadBase64(req.body.front_image, proofPath);
                editForm['proof_copy_sole'] = `proof_copy_sole ='${uploaded.path}',`;
            }
        }

        editForm['proof_copy_pair'] = '';
        if (req.body.back_image) {
            let isImage = /^data:image/.test(req.body.back_image);
            if (isImage) {
                let proofPath = 'images/proof/';
                let uploaded = helper.uploadBase64(req.body.back_image, proofPath);
                editForm['proof_copy_pair'] = `proof_copy_pair ='${uploaded.path}',`;
            }
        }

        if (Array.isArray(req.body.removeImageKeys) && req.body.removeImageKeys.length) {
            req.body.removeImageKeys.forEach((i) => {
                editForm[i] = i + '= null,'
            })
        }

        if (req.body.proof_number) {
            editForm['proof_number_sole'] = `proof_number_sole = ${req.body.proof_number.slice(0, 5)},`
            editForm['proof_number_pair'] = `proof_number_pair = ${req.body.proof_number.slice(5)},`
        }
        else {
            editForm['proof_number_sole'] = `proof_number_sole ='',`;
            editForm['proof_number_pair'] = `proof_number_pair ='',`;
            editForm['proof_type'] = `proof_type =null,`;
        }



        
        //console.log('insertcoverImage_image111111111111111111111111111111111111111111111111');
        //console.log(insertcoverImage); 
         //console.log('editForm')
         //console.log(editForm.sub_status)
        // Update subscriber table
        let updateSubscriberQuery = `UPDATE subscriber SET
        ${editForm.premium}
        ${editForm.full_name} 
        ${editForm.username}
        ${editForm.proof_type}
        ${editForm.proof_number_sole}
        ${editForm.proof_number_pair}
        ${editForm.gender}
        ${editForm.password}
        ${editForm.proof_copy_sole}
        ${editForm.proof_copy_pair}
        ${editForm.isd_code}
        ${editForm.sub_status}
        ${editForm.age}
        ${editForm.language}
        

        updated_by = ${req.myID},
        updated_at = now()
        WHERE id = ${id}`;
        //WHERE id = ${req.myID}`;


console.log("updateSubscriberQuery...........+++++++++++++++++++++++++++");
console.log(updateSubscriberQuery);


        // Update subscriber profile table
        /*let updateSubscriberProfileQuery = `
        INSERT INTO subscriber_profile (city,state,height,weight,profile_image,cover_image,subscriber_id,created_by,created_at)
        VALUES (${req.body.city},${req.body.state},${req.body.height ? req.body.height : 0},${req.body.weight ? req.body.weight : 0},'${insertProfImage}','${insertcoverImage}',${req.myID},${req.myID},now())
        ON CONFLICT ON CONSTRAINT subscriber_profile_pkey DO   
        UPDATE SET
        ${editForm.city}
        ${editForm.state}
        ${editForm.height}
        ${editForm.weight}
        ${editForm.profile_image}
        ${editForm.cover_image}
       ${editForm.birth_place}
        
        updated_by = ${req.myID},
        updated_at = now()
        WHERE subscriber_profile.subscriber_id = ${req.myID}`;*/

        //console.log('insertProfImage_image111111111111111111111111111111111111111111111111');
        //console.log(editForm); 

        if(editForm.city === "undefined" || editForm.city == ""){
            console.log('ppppppppppppppppppppppppp');
            editForm['city'] = `city = null ,`;
           // console.log(editForm['city']);
            //editForm.city = null;
        }
        if(req.body.state === "undefined" || req.body.state == ""){
            req.body.state = null;
        }


        let queryCheck = await db.query(`SELECT subscriber_id from subscriber_profile WHERE subscriber_id=${id}`);
        console.log(queryCheck);
        console.log("queryCheck..;....")
        if (queryCheck.rowCount) {
        var updateSubscriberProfileQuery = `UPDATE subscriber_profile SET  
        ${editForm.country}
        ${editForm.city}
        ${editForm.state}
        ${editForm.height}
        ${editForm.weight}
        ${editForm.cover_image}
        ${editForm.birth_place}
        ${editForm.profile_image}
       
        updated_by = ${req.myID},
        updated_at = now()
        WHERE subscriber_profile.subscriber_id = ${id}`;  
         //profile_image = '${insertProfImage}', 
        }else{
            var updateSubscriberProfileQuery = `
        INSERT INTO subscriber_profile (city,state,country,height,weight,profile_image,cover_image,subscriber_id,created_by,created_at)
        VALUES (${req.body.city},${req.body.state},${req.body.country},${req.body.height ? req.body.height : 0},${req.body.weight ? req.body.weight : 0},'${insertProfImage}','${insertcoverImage}',${id},${req.myID},now())`;    
        }
        



console.log("updateSubscriberQuery...........0000000000000000000000000");
console.log(updateSubscriberQuery);

console.log("updateSubscriberProfileQuery...........111111111111");
 console.log(updateSubscriberProfileQuery);

var updateSubscriberQueryResult = await db.query(updateSubscriberQuery);
var updateSubscriberProfileQueryResult = await db.query(updateSubscriberProfileQuery);

// console.log("updateSubscriberQueryResult ");
// console.log(updateSubscriberQueryResult);

// console.log("updateSubscriberProfileQueryResult ");
// console.log(updateSubscriberProfileQueryResult);

await db.query('COMMIT;')

/*if(updateSubscriberQuery){
        await db.query(updateSubscriberQuery);
         await db.query('COMMIT;')
    }
if(updateSubscriberProfileQuery){

        await db.query(updateSubscriberProfileQuery);
         await db.query('COMMIT;')
    }*/

}
    
    catch (err) {
        console.log("bhjhj +++++++++++++++++");
        console.log(err)
        return {
            serverError: true,    
            error: err.message
        }
    }
}

const updateSportsProfile = async (req, res) => {
    try {
        var id = req.body.subscriber_id;
        await db.query('BEGIN;')
        if (Array.isArray(req.body.sports)) {
            await db.query(`DELETE FROM subscriber_play WHERE subscriber_id = ${id}`);
            await db.query(`DELETE FROM subscriber_play_teams WHERE subscriber_id = ${id}`);
            await db.query(`DELETE FROM subscriber_play_awards WHERE subscriber_id = ${id}`);
            let sports = req.body.sports;
            if (!sports.length) {
                return;
            }

            // let sportsInsertValues = '';
            for (let sport of sports) {
                let sportsInsertValues = await db.query(`INSERT INTO subscriber_play(
                    subscriber_id, sports_id, status, created_at, created_by, profile_type)
                    VALUES (${id},${sport.sports_id},1,now(),${req.myID},'${sport.profile_type}') RETURNING id;`);
                if (sportsInsertValues.rowCount) {
                    let insertedSportID = sportsInsertValues.rows[0].id;
                    if (Array.isArray(sport.teams) && sport.teams.length) {
                        let teams = sport.teams;
                        for (let team of teams) {
                            let coach_mobile_number = null;
                            if (team.coach_mobile_number) {
                                coach_mobile_number = team.coach_mobile_number;
                            }
                            let teamInsertValues = await db.query(`INSERT INTO public.subscriber_play_teams(
                                team_name, player_type, joining_year, till_year, coach_name, coach_mobile_number, sport_play_id, created_at, status, team_view_public, subscriber_id)
                                VALUES ('${team.team_name.replace(/'/g, '\'\'')}', ${(team.player_type) ? team.player_type : null}, '${team.joining_year}', ${(team.till_year) ? "\'" + team.till_year + "\'" : null}, '${team.coach_name.replace(/'/g, '\'\'')}',${coach_mobile_number}, ${insertedSportID}, now(), 1, 1, ${id}) RETURNING id;`);
                            if (teamInsertValues.rowCount) {
                                let insertedTeamID = teamInsertValues.rows[0].id;
                                if (Array.isArray(team.awards) && team.awards.length) {
                                    let awardsInsert = ''
                                    let awards = team.awards;
                                    for (let award of awards) {
                                        let certificate = null;
                                        if (award.certificate) {
                                            let isImage = /^data:image/.test(award.certificate);
                                            if (isImage) {
                                                let profilePath = 'images/proof/';
                                                let uploaded = helper.uploadBase64(award.certificate, profilePath);
                                                certificate = `'${uploaded.path}'`;
                                            }
                                            else {
                                                certificate = `'${award.certificate}'`;
                                            }
                                        }
                                        awardsInsert += `INSERT INTO public.subscriber_play_awards(
                                            award_name,award_text,description,events, tournament, month_year, certificate, created_at,status, award_view_public, subscriber_play_team_id, subscriber_id)
                                            VALUES (${award.award_name},'${award.award_text.replace(/'/g, '\'\'')}','${award.description.replace(/'/g, '\'\'')}','${award.events.replace(/'/g, '\'\'')}', '${award.tournament.replace(/'/g, '\'\'')}', '${award.month_year}', ${certificate}, now(), 1, 1, ${insertedTeamID}, ${id});`
                                    }
                                    if (awardsInsert) {
                                        await db.query(awardsInsert);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // await db.query(sportsInsertValues)
            // let sportsInsert = `INSERT INTO subscriber_play(
            //     subscriber_id, sports_id, status, created_at, created_by, updated_at, updated_by, profile_type, player_type, sports_view_public)
            //     VALUES ${sportsInsertValues}`;
        }
        await db.query('COMMIT;')
    }
    catch (err) {
        await db.query('ROLLBACK;')
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getSportsProfile = async (req, res) => {
    try {
        let result = [];
        var id = req.body.subscriber_id;
        let query = await db.query(`SELECT 
        subscriber_play.id,subscriber_play.sports_view_public,
        sports.id as sports_id,sports.sports_name,
        player_type.id as player_type,player_type.type as player_type_name,
        profile_type.id as profile_type,profile_type.profile_type as profile_type_name,
        array_to_json(array(SELECT d FROM(SELECT id,sports_id,position AS sports FROM game_position WHERE sports_id = subscriber_play.sports_id )d  )) AS game_position,
        array_to_json(array(SELECT d FROM 
        (SELECT 
         *,
         array_to_json(array(SELECT d FROM 
        (SELECT * from subscriber_play_awards WHERE subscriber_play_team_id=subscriber_play_teams.id) d)) AS awards
         from subscriber_play_teams WHERE sport_play_id=subscriber_play.id ORDER BY joining_year DESC) d)) AS teams
        
        FROM subscriber_play
        LEFT JOIN sports
        ON sports.id = subscriber_play.sports_id
        LEFT JOIN player_type
        ON player_type.id = subscriber_play.player_type
        LEFT JOIN profile_type
        ON profile_type.id = subscriber_play.player_type
        WHERE subscriber_id=${id} ORDER BY subscriber_play.id; `);
        if (query.rowCount) {
            result = query.rows;
        }

        if(query.rowCount > 0){
            var sport_data = true;
            result.push({'sport_data':sport_data}) 
        }
        else{
            var sport_data = false;
            result.push({'sport_data':sport_data})
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

const updateProfessionProfile = async (req, res) => {
    try {
        await db.query('BEGIN;')
        if (Array.isArray(req.body.professions)) {
            await db.query(`DELETE FROM subscriber_profession WHERE subscriber_id = ${req.myID}`);
            await db.query(`DELETE FROM subscriber_profession_awards WHERE subscriber_id = ${req.myID}`);
            await db.query(`DELETE FROM subscriber_profession_teams WHERE subscriber_id = ${req.myID}`);
            await db.query(`DELETE FROM subscriber_profession_certificates WHERE subscriber_id = ${req.myID}`);
            let professions = req.body.professions;
            if (!professions.length) {
                return;
            }

            for (let profession of professions) {
                let professionInsertValues = await db.query(`INSERT INTO subscriber_profession(
                    category, profession, other_profession, sport_type, sports_id, created_at,  status, profession_view_public, subscriber_id)
                    VALUES (${profession.category}, ${profession.profession}, ${(profession.other_profession) ? "'" + profession.other_profession.replace(/'/g, '\'\'') + "'" : null}, ${profession.sport_type}, ${profession.sports_id}, now(), 1, 1, ${req.myID} ) RETURNING id;`);
                if (professionInsertValues.rowCount) {
                    let insertedProfessionID = professionInsertValues.rows[0].id;
                    if (Array.isArray(profession.teams) && profession.teams.length) {
                        let teams = profession.teams;
                        for (let team of teams) {
                            let coach_mobile_number = null;
                            if (team.coach_mobile_number) {
                                coach_mobile_number = team.coach_mobile_number;
                            }
                            let teamInsertValues = await db.query(`INSERT INTO public.subscriber_profession_teams(
                                subscriber_profession_id, team_name, coach_mobile_number, profile_type, joining_year, till_year, coach_name, status, created_at,  profession_team_view_public, subscriber_id)
                                VALUES (${insertedProfessionID}, '${team.team_name.replace(/'/g, '\'\'')}', ${coach_mobile_number},  ${(team.profile_type) ? team.profile_type : null}, '${team.joining_year}',  ${(team.till_year) ? "\'" + team.till_year + "\'" : null},'${team.coach_name.replace(/'/g, '\'\'')}', 1, now(), 1,${req.myID}) RETURNING id;`);
                            if (teamInsertValues.rowCount) {
                                let insertedTeamID = teamInsertValues.rows[0].id;
                                if (Array.isArray(team.awards) && team.awards.length) {
                                    let awardsInsert = ''
                                    let awards = team.awards;
                                    for (let award of awards) {
                                        let certificate = null;
                                        if (award.image) {
                                            let isImage = /^data:image/.test(award.image);
                                            if (isImage) {
                                                let profilePath = 'images/proof/';
                                                let uploaded = helper.uploadBase64(award.image, profilePath);
                                                certificate = `'${uploaded.path}'`;
                                            }
                                            else {
                                                certificate = `'${award.image}'`;
                                            }
                                        }
                                        awardsInsert += `INSERT INTO public.subscriber_profession_awards(
                                            award_name,award_text,description,events, tournament_name, month_year, image, created_at,  status, subscriber_profession_award_view_public, subscriber_profession_team_id, subscriber_id)
                                            VALUES (${award.award_name},'${award.award_text.replace(/'/g, '\'\'')}','${award.description.replace(/'/g, '\'\'')}','${award.events.replace(/'/g, '\'\'')}', '${award.tournament.replace(/'/g, '\'\'')}', '${award.month_year}', ${certificate}, now(), 1, 1, ${insertedTeamID}, ${req.myID});`
                                    }
                                    if (awardsInsert) {
                                        await db.query(awardsInsert);
                                    }
                                }
                            }
                        }
                    }
                    if (Array.isArray(profession.certificates) && profession.certificates.length) {
                        let certificateInsert = ''
                        let certificates = profession.certificates;
                        for (let certificate of certificates) {
                            let certificateImage = null;
                            if (certificate.certificate_image) {
                                let isImage = /^data:image/.test(certificate.certificate_image);
                                if (isImage) {
                                    let profilePath = 'images/proof/';
                                    let uploaded = helper.uploadBase64(certificate.certificate_image, profilePath);
                                    certificateImage = `'${uploaded.path}'`;
                                }
                                else {
                                    certificateImage = `'${certificate.certificate_image}'`;
                                }
                            }
                            certificateInsert += `INSERT INTO public.subscriber_profession_certificates(
                                certifying_title, certifying_year, valid_till, certificate_image, created_at,  status, subscriber_profession_certificates_view_public, subscriber_profession_id, subscriber_id,certifying_authority)
                                VALUES ('${certificate.certifying_title.replace(/'/g, '\'\'')}', '${certificate.certifying_year}', ${(certificate.valid_till) ? "'" + certificate.valid_till + "'" : null}, ${certificateImage}, now(), 1, 1, ${insertedProfessionID}, ${req.myID}, '${certificate.certifying_authority.replace(/'/g, '\'\'')}');`
                        }
                        if (certificateInsert) {
                            await db.query(certificateInsert);
                        }
                    }
                }
            }

        }
        await db.query('COMMIT;')
    }
    catch (err) {
        await db.query('ROLLBACK;')
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getProfessionProfile = async (req, res) => {
    try {
        let result = [];
        let query = await db.query(`SELECT 
        sp.id,sp.category,profile_type.profile_type as category_name,sp.other_profession,sp.profession_view_public,sp.sport_type,sp.profession,ps.service_name,
        sports.id as sports_id,sports.sports_name,
        array_to_json(array(SELECT d FROM(SELECT id,sports_id,position AS sports FROM game_position WHERE sports_id = sp.sports_id )d  )) AS game_position,
        array_to_json(array(SELECT d FROM 
        (SELECT 
         *,
         array_to_json(array(SELECT d FROM 
        (SELECT * from subscriber_profession_awards WHERE subscriber_profession_team_id=subscriber_profession_teams.id) d)) AS awards
         from subscriber_profession_teams WHERE subscriber_profession_id=sp.id ORDER BY joining_year DESC) d)) AS teams,
         array_to_json(array(SELECT d FROM (
         SELECT * from subscriber_profession_certificates WHERE subscriber_profession_id=sp.id
         ) d)) as certificates
         
        FROM subscriber_profession as sp
        LEFT JOIN sports
        ON sports.id = sp.sports_id
        LEFT JOIN profile_type
        ON profile_type.id = sp.category
        LEFT JOIN profile_services as ps
        ON ps.id = sp.profession
        WHERE subscriber_id=${req.myID} ORDER BY sp.id;`);
        if (query.rowCount) {
            result = query.rows;
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

const updateProfileViewPublic = async (req, res) => {
    try {
        await db.query(`INSERT INTO profile_view_public(subscriber_id) VALUES(${req.myID}) ON CONFLICT ON CONSTRAINT unique_subscriber DO NOTHING; `);
        let updateQuery = `UPDATE profile_view_public SET `
        if (typeof req.body.viewPublic == 'object') {
            Object.keys(req.body.viewPublic).forEach((item) => {
                updateQuery += `${item}=${req.body.viewPublic[item]},`
            })
        }
        updateQuery += `updated_at=now() WHERE subscriber_id=${req.myID}`;
        await db.query(updateQuery);
        return true;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const updateMyTeams = async (req, res) => {
    //console.log("updateMyTeams")
    try {

       
        await db.query(`BEGIN;`);
        //console.log('.......................')
        //console.log("req.body.myTeams:");
        console.log(req.body.myTeams);

        if (Array.isArray(req.body.myTeams)) {
            let existingMobileNumbers = await db.query(`SELECT player_mobile_number FROM subscriber_my_teams  WHERE subscriber_id=${req.myID}`);
            existingMobileNumbers = (existingMobileNumbers.rowCount) ? existingMobileNumbers.rows.map((i) => i.player_mobile_number.toString()) : [];
            var id = req.body.subscriber_id;
            await db.query(`DELETE FROM subscriber_my_teams WHERE subscriber_id=${id}`);
            let insertTeams = '';
            var profilePath = 'images/profile/';
            for (let item of req.body.myTeams) {


            	// if (typeof item.my_team_profile_img === "undefined" || item.my_team_profile_img === "") {


             //    	console.log("null44444444444444444444444");
                  
             //        var my_team_profile_img_image = 'images/default/prof.png'; 
                       
             //        item.my_team_profile_img = my_team_profile_img_image;
             //    }
     //            else{
     //            	console.log("null5555555555555555555555555555");
					// item.my_team_profile_img= null;
     //            }
                
                //console.log("item: ");
               // console.log(item);

				
				var result = item.my_team_profile_img.slice(0, 15);
				console.log("99999999999999999999999999999999999999");
				console.log(result);
				
                if (item.my_team_profile_img && result!== profilePath) {
                    console.log("if++----------------")
                    // let isImage = /^data:image/.test(item.my_team_profile_img);
                    // if (isImage) {
                        
                        let uploaded = helper.uploadBase64(item.my_team_profile_img, profilePath); 
                        item.my_team_profile_img = uploaded.path;
                    // }

                	console.log('item.my_team_profile_img');
                    console.log(item.my_team_profile_img);
                }

                else{  
                
               		if(result === profilePath){
                    console.log("demo...........................");
                    item.my_team_profile_img = item.my_team_profile_img;
                }
            }




                if(!item.city_id || typeof item.city_id === undefined || item.city_id ==="" || item.city_id ===""){
                    item.city_id = null;
                }

                if(!item.country_id || typeof item.country_id === undefined || item.country_id ==="" || item.country_id ===""){
                    item.country_id = null;
                }

                if(!item.state_id || typeof item.state_id === undefined || item.state_id ==="" || item.state_id ===""){
                    item.state_id = null;
                }

                if(!item.email_id || typeof item.email_id === undefined || item.email_id ==="" || item.email_id ===""){
                    item.email_id = null;
                } 


                if(!item.profession_text || typeof item.profession_text === undefined || item.profession_text ==="" || item.profession_text ===""){
                    item.profession_text = null;
                }
                if(!item.isd_code || typeof item.isd_code === undefined || item.isd_code ==="" || item.isd_code ===""){
                    item.isd_code = null;
                }
                               

                insertTeams += `INSERT INTO public.subscriber_my_teams(  
                    subscriber_id, profession,profession_text, sport, ${(item.player_subscriber_id) ? 'player_subscriber_id,' : ''} player_name,isd_code, player_mobile_number, status, my_team_profile_img,created_at, city_id,country_id,state_id,experience,email_id, my_team_view_public)
                    VALUES (${id}, ${item.profession}, '${item.profession_text}', ${item.sport}, ${(item.player_subscriber_id) ? (item.player_subscriber_id) + ',' : ''} '${item.player_name}','${item.isd_code}', '${item.player_mobile_number}', 1, '${item.my_team_profile_img}', now(), ${item.city_id}, ${item.country_id}, ${item.state_id},'${item.experience}', '${item.email_id}', 1);`;

                    console.log("insertTeams------------------");
                    console.log(insertTeams);

                if (!item.player_subscriber_id) {
                    if (!existingMobileNumbers.includes(item.player_mobile_number)) { 
                        let smsData = {
                            mobile: item.isd_code + item.player_mobile_number,
                            smsLink: 'https://play.google.com/store/apps/details?id=com.actio.user' 
                        }
                        console.log(smsData)
                        await helper.welcomeSMS(smsData)
                    }
                }
            }
            if (insertTeams) {
                console.log("insertTeams: team ");
                console.log(insertTeams);

                await db.query(insertTeams);
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {
         console.log("updateMyTeams catch:")
         
         //console.log("err ");
         console.log(err);

        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getMyTeams = async (req, res) => {
    try {
        let result = {};
        var id =  req.body.subscriber_id;
        let query = await db.query(`SELECT smt.*,s.sports_name,ps.service_name as profession_name,smt.player_subscriber_id as player_subscriber_id
        FROM subscriber_my_teams AS smt
        LEFT JOIN sports as s
        ON s.id = smt.sport
        LEFT JOIN profile_services AS ps
        ON ps.id = smt.profession
        WHERE smt.status = 1 and smt.subscriber_id=${id} order by id`); 

        ///console.log('query.rowCount'); 
        //console.log(query.rowCount); 
       if (query.rowCount) {
            result.data = query.rows
        }

        if(query.rowCount > 0){
            var team_data = true; 
            //result.push({'team_data':team_data});
            result.team_data = team_data;
        }

        else{
            var team_data = false
        	//result.push({'team_data':team_data}) ;
            result.team_data = team_data;
        }
        
        return result
    }
        catch (err) {
        console.log(err)
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getViewPublic = async (req, res) => {
    try {
        let result = {};
        let query = await db.query(`SELECT * FROM profile_view_public
        WHERE subscriber_id=${req.myID}`);
        if (query.rowCount) {
            result = query.rows[0];
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

const updateHighlightedVideos = async (req, res) => {
    try {
        console.log("demo");
        console.log(req.body.highlights);
        await db.query(`BEGIN;`);
        var id = req.body.subscriber_id;
       
        
        if (Array.isArray(req.body.highlights)) {
            await db.query(`DELETE FROM subscriber_highlighted_videos WHERE subscriber_id=${id}`);  
            let insertHighlights = '';
            for (let item of req.body.highlights) {
                // let cover_img = null;
                //     if (req.body.cover_img[0]) {
                //         let isImage = /^data:image/.test(req.body.cover_img[0]);
                //         if (isImage) {
                //             let profilePath = 'images/profile/';
                //             let uploaded = helper.uploadBase64(req.body.cover_img[0], profilePath);
                //             cover_img = uploaded.path;
                //         }
                                            
                //     }

        var cover_img = "";
       
       var tourPath = 'images/profile/';

        var img = item.cover_img;

        // if (typeof img === 'undefined' || img ==="" ) { 
        //     cover_img = null;
        // }
        var result = img.slice(0, 15);
        console.log("imggggggggg");
        console.log(img);
        if(img && result !== tourPath) {
            //let isImage = /^data:image/.test(img);
            // if(isImage) {
                
                let uploaded = helper.uploadBase64(img, tourPath);
                console.log('uploaded');
                console.log(uploaded);
                cover_img = uploaded.path;
            // }
        }
        else{  
                

                //img = item.cover_img ;
                console.log("jjjjjjjjjjjjjjjjjjjjjjimgdataimgdataimgdataimgdataimgdataimgdata"); 
                console.log(img);
                
                console.log("jjjjjjjjjjjjjjjjjjjjjj");
                console.log(result);
                if(result === tourPath){
                    console.log("demo...........................");
                    cover_img = img;
                }
            }

                insertHighlights += `INSERT INTO subscriber_highlighted_videos(
                    title,sport_id, date, url,cover_img,status, subscriber_id, created_at, highlighted_videos_view_public )
                    VALUES ('${item.title}', '${item.sport_id}','${item.date}','${item.url}','${cover_img}', 1,${id}, now(), 1);`; 


                console.log('insertHighlights................=====================');
                    console.log(insertHighlights);
            }
            if (insertHighlights) {
                await db.query(insertHighlights);
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getHighlightedVideos = async (req, res) => {
    try {
        let result = {};
        var id = req.body.subscriber_id;
        console.log(id);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        let query = await db.query(`SELECT sv.*,s.sports_name FROM subscriber_highlighted_videos as sv left join sports as s on s.id = sv.sport_id
           WHERE sv.status = 1 and sv.subscriber_id=${id}`);
        console.log("ssssss........................");
        console.log(query);
        
        if (query.rowCount) {
            result = query.rows;
        }

        if(query.rowCount > 0){
            var video_data = true;
            result.video_data =video_data;
        }
        else{
            var video_data = false;
            result.video_data = video_data;
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

const updateHighlightedgallery = async (req, res) => {
    try {
        await db.query(`BEGIN;`);
        if (Array.isArray(req.body.gallery))
         var id = req.body.subscriber_id;

        {
            await db.query(`DELETE FROM subscriber_highlighted_gallery WHERE subscriber_id=${id}`);
            let insertHighlights = '';
            for (let item of req.body.gallery) {
                let logo = null;
                    if (item.logo) {
                    let isImage = /^data:image/.test(item.logo);
                    if (isImage) {
                    let profilePath = 'images/profile/';
                    let uploaded = helper.uploadBase64(item.logo, profilePath);
                    item.logo = uploaded.path;
                    }
                                            
                }

                //                          if (item.logo) {
                //     let isImage = /^data:image/.test(item.logo);
                //     if (isImage) {
                //         let profilePath = 'images/profile/';
                //         let uploaded = helper.uploadBase64(item.logo, profilePath);
                //         item.logo = uploaded.path;
                //     }
                // }


                insertHighlights += `INSERT INTO subscriber_highlighted_gallery(
                    title,sport_id ,date, logo, status, subscriber_id, created_at, highlighted_gallery_view_public )
                    VALUES ('${item.title}', '${item.sport_id}','${item.date}', '${item.logo}', 1,${id}, now(), 1);`;
            }

            console.log("insertHighlights0000000"); 
             console.log(insertHighlights);

            if (insertHighlights) {
                await db.query(insertHighlights);
               // await db.query(`COMMIT;`);
            }
        } 
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err...");
        console.log(err);
        await db.query(`ROLLBACK;`); 
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getHighlightedgallery = async (req, res) => {
    try {
        let result = {};
        var id = req.body.subscriber_id;
        // let query = await db.query(`SELECT *,to_char(date,'YYYY-MM-DD') as date FROM subscriber_highlighted_gallery
        //WHERE subscriber_id=${id}`);
        //SELECT a.*, b.sports_name as sport_name_new FROM subscriber_highlighted_gallery as a left join sports as b  on a.sport_id=b.id WHERE a.status = 1 and a.subscriber_id=${id}
        //let query = await db.query(`SELECT * FROM subscriber_highlighted_gallery
        //WHERE status = 1 and subscriber_id=${id}`);
       let query = await db.query(`SELECT a.*, b.sports_name as sport_name_new FROM subscriber_highlighted_gallery as a left join sports as b  on a.sport_id=b.id WHERE a.status = 1 and a.subscriber_id=${id}`);
         if (query.rowCount) {
            result.data = query.rows;
        }

        if(query.rowCount > 0){
            var gallery_data = true;
            result.gallery_data =gallery_data;
        }
        else{
            var gallery_data = false;
            result.gallery_data = gallery_data;
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

const updateMySponsor = async (req, res) => {
    try {
        await db.query(`BEGIN;`);
        var id = req.body.subscriber_id;
        if (Array.isArray(req.body.sponsor)) {
            await db.query(`DELETE FROM subscriber_my_sponsor WHERE subscriber_id=${id}`);
            let insertSponsor = '';
            for (let item of req.body.sponsor) {
                if (item.logo) {
                    let isImage = /^data:image/.test(item.logo);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.logo, profilePath);
                        item.logo = uploaded.path;
                    }
                }

                if (typeof item.logo === "undefined" || item.logo === " ") {
                  
                    var logo_image = 'images/default/sponsor.jpg';
                       
                    item.logo = logo_image;
                }
                insertSponsor += `INSERT INTO subscriber_my_sponsor(
                    url, logo,sponsor_name , subscriber_id, created_at, subscriber_my_sponsor_view_public, status )
                    VALUES (${(item.url) ? "'" + item.url.replace(/'/g, '\'\'') + "'" : null}, ${(item.logo) ? "'" + item.logo.replace(/'/g, '\'\'') + "'" : null}, '${item.sponsor_name.replace(/'/g, '\'\'')}', ${id}, now(), 1, 1);`;
            }
            if (insertSponsor) {
                await db.query(insertSponsor);
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getMySponsor = async (req, res) => {
    try {
        let result = {};
        var id = req.body.subscriber_id;
        let query = await db.query(`SELECT * FROM subscriber_my_sponsor 
        WHERE status = 1 and subscriber_id=${id}`);

        /*result.data = query.rows;
          
        if((query.rows).length > 0){

        var sponsor_data = true; 
          
         //result.push({'sponsor_data':sponsor_data}); 
         result.sponsor_data;
         
          
        }
        else{
        	
        	var sponsor_data = false;
        	//result.push({'sponsor_data':sponsor_data});
            result.sponsor_data;

        }
       return result;*/

       if (query.rowCount) {
            result.data = query.rows
        }

        if(query.rowCount > 0){
            var sponsor_data = true; 
            //result.push({'team_data':team_data});
            result.sponsor_data = sponsor_data;
        }

        else{
            var sponsor_data = false
            //result.push({'team_data':team_data}) ;
            result.sponsor_data = sponsor_data;
        }
        
        return result
        
           
    }
    catch(err){
    	
        return {
            serverError: true,
            error: err.message
        }
    }
}

const updateEducationProfile = async (req, res) => {
    try {
        await db.query(`BEGIN;`);
        var id = req.body.subscriber_id;

        console.log('id................');
        console.log(id);
        await db.query(`DELETE FROM subscriber_education WHERE subscriber_id = ${id}`)
        // if(!req.body.sponsor_remarks) {
        //     req.body.sponsor_remarks = null
        // }
        // else {
        //     req.body.sponsor_remarks = `'${req.body.sponsor_remarks}'`
        // }

        // if(!req.body.organizer_remarks) {
        //     req.body.organizer_remarks = null
        // }
        // else {
        //     req.body.organizer_remarks = `'${req.body.organizer_remarks}'`
        // }

        // let profileQuery = `INSERT INTO subscriber_profile(
        //     subscriber_id, is_student, is_coach, is_sponsor, is_organizer, sponsor_remarks, organizer_remarks,
        //      created_at, created_by)
        //     VALUES (${req.myID}, ${req.body.is_student}, ${req.body.is_coach}, ${req.body.is_sponsor},
        //     ${req.body.is_organizer},${req.body.sponsor_remarks}, ${req.body.organizer_remarks},  now(), ${req.myID}) 
        //     ON CONFLICT(subscriber_id)
        //     DO UPDATE SET 
        //     is_student = ${req.body.is_student},
        //     is_coach = ${req.body.is_coach},
        //     is_sponsor = ${req.body.is_sponsor},
        //     is_organizer = ${req.body.is_organizer},
        //     sponsor_remarks = ${req.body.sponsor_remarks},
        //     organizer_remarks = ${req.body.organizer_remarks},
        //     updated_at = now(),
        //     updated_by = ${req.myID};`;
        //     await db.query(profileQuery);

        let education = req.body.education;
        let result = [];
        let educationStr = '';
        if (Array.isArray(education)) {
            for (let edu of education) {
                if (edu.classID != 3) {
                    edu.classText = null 
                }
                //educationStr += "INSERT INTO " + process.env.SCHEMA + ".subscriber_education (subscriber_id,institute_text,academic_from_year,academic_to_year,class_id,class_text,specialization,city_id,state_id,country_id,grade,created_by) VALUES (" + req.myID + "," + `${(edu.instituteText) ? "'" + edu.instituteText.replace(/'/g, '') + "'" : null}`+ "," + edu.fromYear + "," + edu.toYear + "," + edu.classID + "," + `${(edu.classText) ? "'" + edu.classText.replace(/'/g, '') + "'" : null}` + "," + `${(edu.specialization) ? "'" + edu.specialization.replace(/'/g, '') + "'" : null}` + "," + edu.cityID + "," + edu.stateID + "," + edu.countryID + ","+ edu.grade + "," + req.myID + "); ";

                
              

                educationStr += `INSERT INTO subscriber_education (subscriber_id,institute_text,stream_id,academic_from_year,academic_to_year,class_id,class_text,specialization,city_id,state_id,country_id,grade,created_by) VALUES (${req.body.subscriber_id},'${edu.instituteText}',${edu.classID},${ edu.fromYear},${ edu.toYear} , ${edu.classID }, '${edu.classText}','${edu.specialization}' , ${edu.cityID} , ${edu.stateID},${edu.countryID },'${ edu.grade}' ,${req.myID});`;

                // ON CONFLICT ON CONSTRAINT subscriber_class_unique DO UPDATE SET updated_at=NOW(),updated_by="+req.myID+",institute_id="+edu.instituteID+",academic_from_year="+edu.fromYear+" ,academic_to_year="+edu.toYear+",class_id="+edu.classID+",stream_id="+edu.streamID+",division_id="+edu.divisionID+",city_id="+edu.cityID+",state_id="+edu.stateID+",country_id="+edu.countryID+";"
                console.log("educationStr======");   
                console.log(educationStr);
            }
            if (educationStr) {
            await db.query(educationStr); 
                
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err===================");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getEducationProfile = async (req, res) => {
    try {
        let result = {
        	profile_data:[],
        	education_data:[],
            profile: {},
            education: []
        };

        var id =  req.body.subscriber_id;
        let query1 = await db.query(`SELECT * FROM subscriber_profile
        WHERE subscriber_id=${id}`);
        let query2 = await db.query(`SELECT
	id as "education_id",
        grade as "grade", 
        institute_text as "instituteText",
        academic_from_year as "fromYear",
        academic_to_year as "toYear",
        class_id as "classID",
        class_text as "classText",
        specialization as "specialization",
        city_id as "cityID",
        state_id as "stateID",
        country_id as "countryID"
        FROM subscriber_education
        WHERE subscriber_id=${id} ORDER BY academic_from_year DESC`);

        if(query1.rowCount > 0 ){
         result['profile_data'] = true;
        }
        else{
        	result['profile_data'] = false;
        }

        if( query2.rowCount > 0){
         result['education_data'] = true;	
        }
        else{
        	result['education_data'] = false;
        }

        if (query1.rowCount) {
            result['profile'] = query1.rows[0];
        }

        if (query2.rowCount) {
            result['education'] = query2.rows;
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

const updateProfileTraffic = async (req, res) => {
    try {
        await db.query(`INSERT INTO public.subscriber_profile_traffic(
            subscriber_id, subscriber_profile_traffic_view_public, count)
            VALUES (${req.myID}, 1, 1) 
            ON CONFLICT(subscriber_id)
            DO UPDATE SET count = subscriber_profile_traffic.count + 1
            ;`);
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}


const getProfileTraffic = async (req, res) => {
    try {
        let result = {};
        let query = await db.query(`SELECT * FROM subscriber_profile_traffic
        WHERE subscriber_id=${req.myID}`);
        if (query.rowCount) {
            result = query.rows[0];
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

const updateCompanyProfile = async (req, res) => {
    try {
        if (req.body.logo) {
            let isImage = /^data:image/.test(req.body.logo);
            if (isImage) {
                let profilePath = 'images/profile/';
                let uploaded = helper.uploadBase64(req.body.logo, profilePath);
                req.body.logo = uploaded.path;
            }
        }

        if (req.body.company_upload_certificate) {
            let isImage = /^data:image/.test(req.body.company_upload_certificate);
            if (isImage) {
                let profilePath = 'images/profile/';
                let uploaded = helper.uploadBase64(req.body.company_upload_certificate, profilePath);
                req.body.company_upload_certificate = uploaded.path;
            }
        }

        // Update subscriber table
        let editForm = {
            // Screen 1 
            username: (req.body.username) ? `username = '${req.body.username.replace(/'/g, '\'\'')}',` : '',
            full_name: (req.body.full_name) ? `full_name = '${req.body.full_name.replace(/'/g, '\'\'')}',` : '',
            password: (req.body.password) ? `password = MD5('${req.body.password.replace(/'/g, '\'\'')}'),` : '',
        }
        req.body.website = (!(req.body.website == '')) ? "'" + req.body.website + "'" : null;
        // if(Array.isArray(req.body.removeImageKeys) && req.body.removeImageKeys.length) {
        //     req.body.removeImageKeys.forEach((i)=> {
        //         req.body[i]= 'i+'= 'null,'
        //     })
        // }

        let updateSubscriberQuery = `UPDATE subscriber SET
        ${editForm.username}
        ${editForm.full_name}
        ${editForm.password}
        updated_by = ${req.myID},
        updated_at = now()
        WHERE id = ${req.myID}`;
        console.log("updateSubscriberQuery=================================");
        console.log(updateSubscriberQuery);
        await db.query(updateSubscriberQuery);

        let queryString = `INSERT INTO public.company_profile(
            subscriber_id, company_business_type, website, company_year_inc, company_upload_certificate, logo, company_description, created_at, created_by)
            VALUES (${req.myID}, ${(req.body.company_business_type) ? req.body.company_business_type : null}, ${req.body.website}, ${(req.body.company_year_inc) ? "'" + req.body.company_year_inc.replace(/'/g, '\'\'') + "'" : null}, ${(req.body.company_upload_certificate) ? '\'' + req.body.company_upload_certificate.replace(/'/g, '\'\'') + '\'' : null}, ${(req.body.logo) ? '\'' + req.body.logo.replace(/'/g, '\'\'') + '\'' : null}, '${req.body.company_description.replace(/'/g, '\'\'')}', now(), ${req.myID})
            ON CONFLICT (subscriber_id) 
            DO UPDATE SET 
            company_business_type = ${(req.body.company_business_type) ? req.body.company_business_type : null},
            website = ${req.body.website},
            company_year_inc = ${(req.body.company_year_inc) ? "'" + req.body.company_year_inc.replace(/'/g, '\'\'') + "'" : null},
            company_upload_certificate = ${(req.body.company_upload_certificate) ? '\'' + req.body.company_upload_certificate.replace(/'/g, '\'\'') + '\'' : null},
            logo = ${(req.body.logo) ? '\'' + req.body.logo.replace(/'/g, '\'\'') + '\'' : null},
            company_description = '${req.body.company_description.replace(/'/g, '\'\'')}',
            updated_at = now(),
            updated_by = ${req.myID}
            ;`
        await db.query(queryString)

        if (Array.isArray(req.body.sports)) {
            let sportInsert = '';
            await db.query(`DELETE FROM company_sport WHERE company_subscriber_id=${req.myID}`)
            for (let sport of req.body.sports) {
                sportInsert += `INSERT INTO company_sport(
                    sports_id, company_subscriber_id, status, created_at)
                    VALUES (${sport}, ${req.myID}, 1, NOW());`;
            }
            if (sportInsert) {
                await db.query(sportInsert);
            }
        }

        if (Array.isArray(req.body.activity)) {
            let sportActivityInsert = '';
            await db.query(`DELETE FROM company_profile_activities WHERE subscriber_id=${req.myID}`)
            for (let act of req.body.activity) {
                sportActivityInsert += `INSERT INTO company_profile_activities(
                    company_activity, subscriber_id, status, created_at)
                    VALUES (${act}, ${req.myID}, 1, NOW());`;
            }
            if (sportActivityInsert) {
                await db.query(sportActivityInsert);
            }
        }
    }
    catch (err) {
        console.log(err)
        return {
            serverError: true,
            error: err.message
        }
    }
}

const getCompanyProfile = async (req, res) => {
    try {
        let result = {};
        var id = req.body.subscriber_id;
        let query = await db.query(`SELECT *,
        (select array_to_json(array_agg(sports_id)) from company_sport WHERE subscriber_id =${id}) as sports,
        (select array_to_json(array_agg(company_activity)) from company_profile_activities WHERE subscriber_id =${id}) as activity,
        to_char(company_year_inc,'YYYY-MM-DD') as company_year_inc FROM company_profile where subscriber_id =${id}`);
        if (query.rowCount) {
            result = query.rows[0];
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

const updateMySports = async (req, res) => {
    console.log("updateMySports: ");

    try {
       var id = req.body.subscriber_id;
        
        await db.query(`BEGIN;`);
        if (Array.isArray(req.body.sport)) {
            console.log("is array if");
            await db.query(`DELETE FROM subscriber_sports WHERE subscriber_id=${id}`);
            let insertSponsor = '';
            for (let item of req.body.sport) {
                console.log("for item+");
                console.log(item)
                if (item.sport_logo) {
                    let isImage = /^data:image/.test(item.sport_logo);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.sport_logo, profilePath);
                        item.sport_logo = uploaded.path;
                    }
                }
                if (item.sport_icon) {
                    let isImage = /^data:image/.test(item.sport_icon);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.sport_icon, profilePath);
                        item.sport_icon = uploaded.path;
                    }
                }
                insertSponsor += `INSERT INTO subscriber_sports(
                    sport_icon, sport_logo,sport_name , subscriber_id, created_at, status )
                    VALUES (${(item.sport_icon) ? "'" + item.sport_icon.replace(/'/g, '\'\'') + "'" : null}, ${(item.sport_logo) ? "'" + item.sport_logo.replace(/'/g, '\'\'') + "'" : null}, ${item.sport_name}, ${id}, now(), 1);`;
            }

            console.log("insertSponsor");
            console.log(insertSponsor);
            
            if (insertSponsor) {
                await db.query(insertSponsor);
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err: ");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }

    //try {

        /*var bannerPath = 'images/banner_website/';

        var image_path = req.body.image_path;

        var image_path_new = "";

        if (image_path && typeof image_path !=="undefined" && image_path.length) {
            var image_path = helper.uploadBase64(image_path[0], bannerPath);
            image_path_new = image_path.path;
        }

        var statusStr = "INSERT into " + process.env.SCHEMA + ".banner_website (title, description, image_path, status, created_by, created_at ) values ('"+req.body.title+"', '"+req.body.description+"', '"+image_path_new+"', 1, 1, now()) ";

        console.log("statusStr ");
        console.log(statusStr);

        await db.query(statusStr);

        return true;*/


        //console.log('1234')
        //await db.query(`BEGIN;`);

        /*console.log('req.body.sport_logo......')
        console.log(req.body.sport_logo)*/

        /*if (Array.isArray(req.body.sports)) {
            await db.query(`DELETE FROM subscriber_sports WHERE subscriber_id=${req.myID}`);
            let insertSorts = '';
            for (let item of req.body.sports) {


                if (item.sport_logo ) {
                    let isImage = /^data:image/.test(item.sport_logo);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.sport_logo, profilePath);
                        item.sport_logo = uploaded.path;
                    }
                }

                if (item.sport_icon ) {
                    let isImage = /^data:image/.test(item.sport_icon);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.sport_icon, profilePath);
                        item.sport_icon = uploaded.path;
                    }
                }
                insertSorts += `INSERT INTO subscriber_sports(
                     sport_logo,sport_icon,sport_name , subscriber_id, created_at, status )
                    VALUES (${(item.sport_logo) ? "'" + item.sport_logo.replace(/'/g, '\'\'') + "'" : null}, ${(item.sport_icon) ? "'" + item.sport_icon.replace(/'/g, '\'\'') + "'" : null}, '${item.sport_name.replace(/'/g, '\'\'')}', ${req.myID}, now(), 1, 1);`;
            }

           
            if (insertSorts) {

                await db.query(insertSorts);
                console.log('insertSorts.......')
                console.log(insertSorts)
            }
        }
        await db.query(`COMMIT;`);
    }
    catch (err) {

        console.log('12')
    
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }*/
}

const getMySports = async (req, res) => {
    try {
        console.log('req.myID')
        console.log(req.myID)
        let result = [];
        var id =  req.body.subscriber_id
        let query = await db.query(`SELECT a.*, b.sports_name as sport_name_new FROM subscriber_sports as a left join sports as b on a.sport_name=b.id WHERE subscriber_id=${id}`);
        if (query.rowCount) {
            result = query.rows;
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


const MySportslist = async (req, res) => {
    try {
        
        let result = {};

        var id = req.body.subscriber_id;
        console.log("id//////////////////");
        console.log(id);
        let query = await db.query(`SELECT a.sport_name, b.sports_name as my_sport FROM subscriber_sports as a left join sports as b on a.sport_name=b.id WHERE a.subscriber_id = ${id}`);

        console.log('req.myID....')
        console.log(query)
        if (query.rowCount) {
            result = query.rows;
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

const Mytournamentlist = async (req, res) => {
    try {
        console.log('req.myID')
        console.log(req.myID)
        let result = [];
        let query = await db.query(`SELECT  tournament_name ,id FROM tournament WHERE sports::integer =  ${req.body.sport_id}`);

        console.log('req.myID....')
        console.log(query)
        if (query.rowCount) {
            result = query.rows;
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

const Myeventlist_byid = async (req, res) => {
    try {
        console.log('req.myID')
        console.log(req.myID)
        let result = [];
        let query = await db.query(`SELECT  event_name ,id FROM event where tournament_id =${req.body.id}`);

        console.log('req.myID....')
        console.log(query)
        if (query.rowCount) {
            result = query.rows;
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


const deletesubscriberdata = async(req,res)=>{
try{


    if(req.body.id && req.body.id !== 'undefined' && req.body.id !== ""){

        var deletesubscriber = "update subscriber SET status = 2 where id = "+req.body.id+"";
        await db.query(deletesubscriber);

        var deletesponser = "update subscriber_my_sponsor SET status = 2 where subscriber_id = "+req.body.id+"";
        await db.query(deletesponser);

        var deletegallery = "update subscriber_highlighted_gallery SET status = 2 where subscriber_id = "+req.body.id+"";
        await db.query(deletegallery);

        var deletevideos = "update subscriber_highlighted_videos SET status = 2 where subscriber_id = "+req.body.id+"";
        await db.query(deletevideos);

        var deleteteam = "update subscriber_my_teams SET status = 2 where subscriber_id = "+req.body.id+""; 
        await db.query(deleteteam);

	var deleteawards = "update subscriber_play_awards SET status = 2 where subscriber_id = "+req.body.id+""; 
        await db.query(deleteawards);
        
	var deleteeducation = "update subscriber_education SET status = 2 where subscriber_id = "+req.body.id+""; 
        await db.query(deleteeducation);

	var deletecareer = "update subscriber_play_teams SET status = 2 where subscriber_id = "+req.body.id+""; 
        await db.query(deletecareer);
        
        
	}

    }
    catch(err){
        return{
            serverError:true,
            error: err.message
        }
    }
}
const EducationProfileInsert = async (req, res) => {
    try {
        // Extracting fields directly from req.body
        const { instituteText, fromYear, toYear, classID, classText, specialization, cityID, stateID, countryID, grade } = req.body;

        let adjustedClassText = classID !== 3 ? null : (classText ? classText.replace(/'/g, "''") : null);
        let adjustedInstituteText = instituteText ? instituteText.replace(/'/g, "''") : null;
        let adjustedSpecialization = specialization ? specialization.replace(/'/g, "''") : null;

        console.log(req.myID) 
        console.log('req.myID....')   
        const values = [
            req.myID, // subscriber_id
            instituteText, 
            fromYear,
            toYear,
            classID,
            classText,  
            specialization, 
            cityID,   
            stateID,
            countryID,
            grade,
            req.myID// created_by
        ];

        await db.query('BEGIN'); // Start transaction

        const queryText = `INSERT INTO subscriber_education 
            (subscriber_id, institute_text, academic_from_year, academic_to_year, class_id, class_text, specialization, city_id, state_id, country_id, grade, created_by) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;


            console.log(queryText)
            console.log('queryText...................')

        await db.query(queryText, values); // Execute query with parameterized values

        await db.query('COMMIT'); // Commit transaction

      
    } catch (err) {
        console.error(err); // Log the error
        await db.query('ROLLBACK'); // Rollback in case of error
        return{
            serverError:true,
            error: err.message  
        }
       // res.status(500).json({ serverError: true, error: err.message }); // Send error response
    }


};

const EducationProfileUpdate = async (req, res) => {
    try {
        // Extracting fields and the identifier from req.body
        const { instituteText, fromYear, toYear, classID, classText, specialization, cityID, stateID, countryID, grade, id } = req.body;

        let adjustedClassText = classID !== 3 ? null : (classText ? classText.replace(/'/g, "''") : null);
        let adjustedInstituteText = instituteText ? instituteText.replace(/'/g, "''") : null;
        let adjustedSpecialization = specialization ? specialization.replace(/'/g, "''") : null;

        const values = [
            adjustedInstituteText, 
            fromYear,
            toYear,
            classID,
            adjustedClassText,
            adjustedSpecialization, 
            cityID, 
            stateID,
            countryID,
            grade,
            1,//req.myID, // Assuming updated_by
            id // The unique identifier for the record to be updated
        ];

        await db.query('BEGIN'); // Start transaction

        const queryText = `UPDATE subscriber_education 
            SET institute_text = $1, academic_from_year = $2, academic_to_year = $3, class_id = $4, class_text = $5, specialization = $6, city_id = $7, state_id = $8, country_id = $9, grade = $10, updated_by = $11
            WHERE id = $12`;

        await db.query(queryText, values); // Execute query with parameterized values

        await db.query('COMMIT'); // Commit transaction

    } catch (err) {
        console.error(err); // Log the error
        await db.query('ROLLBACK'); // Rollback in case of error
        return {
            serverError: true,
            error: err.message  
        };
    }
}; 

const addMySports = async (req, res) => {
    console.log("updateMySports: ");
  
    try {
        var insertSponsor ="";
       id = req.myID
       console.log('yyyyyyyyyyyyyyyyy')
            
       insertSponsor += `INSERT INTO subscriber_sports (sport_name, subscriber_id, created_at, status) VALUES ( ${req.body.sport_name}, ${id}, now(), 1 );`;

    console.log(insertSponsor); 
    console.log('insertSponsor........................') 
    
        if (insertSponsor) {
                await db.query(insertSponsor);
            } 
        }
        catch (err) {
        console.log("err: ");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
  };

  const updateSport = async (req, res) => {
    try {
        const sqlQuery = `
            UPDATE subscriber_sports SET sport_name = ${req.body.sport_name}, updated_at = now(), status = 1 WHERE id = ${req.body.id};`;
            
            console.log(sqlQuery); 
            console.log('insertSponsor........................') 
    

        await db.query(sqlQuery);
    } catch (err) {
        console.log("Error updating sport: ");
        console.log(err);
        throw err; // Rethrow the error to be handled by the caller
    }
};

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const addMyteam = async (req, res) => {
     const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }

        try {
            var insertTeams = "";
            id = req.myID;  // Assuming myID comes from the fields
            const { profession, profession_text, sport, player_subscriber_id, player_name, isd_code, player_mobile_number, city_id, country_id, state_id, experience, email_id } = req.body;
            var my_team_profile_img = '';

            //  console.log(files)
            // console.log('files.....................')

            if (req.files.my_team_profile_img) {
                let now = moment();
                var element = req.files.my_team_profile_img;
                var image_name = now.format("YYYYMMDDHHmmss") + element.name;
                element.mv("images/profile/" + image_name);
                my_team_profile_img = image_name;
              }
            insertTeams += `INSERT INTO subscriber_my_teams(
                subscriber_id, profession, profession_text, sport, ${player_subscriber_id ? 'player_subscriber_id,' : ''} player_name, isd_code, player_mobile_number, status, my_team_profile_img, created_at, city_id, country_id, state_id, experience, email_id, my_team_view_public)
                VALUES (${id}, ${profession}, '${profession_text}', ${sport}, ${player_subscriber_id ? player_subscriber_id + ',' : ''} '${player_name}', '${isd_code}', '${player_mobile_number}', 1, '${my_team_profile_img}', now(), ${city_id}, ${country_id}, ${state_id}, '${experience}', '${email_id}', 1);`;

            console.log(insertTeams);
            console.log('insertTeams.........')
                if (insertTeams) {
                await db.query(insertTeams);
            }  

 

        } catch (err) {
            console.log("err: ");  
            console.log(err);
            await db.query(`ROLLBACK;`);  
           throw err  
        }
    });
}
const addMySponsor = async (req, res) => {
    try {
       
            let insertSponsor = '';
            const {url,sponsor_name} = req.body;
            let id = req.myID;
            let logo =""; 
            
           
            if (req.files.logo) {
                let now = moment();
                var element = req.files.logo;
                var image_name = 'images/profile/'+now.format("YYYYMMDDHHmmss") + element.name;
                element.mv(image_name);
                logo = image_name;
              }
                insertSponsor += `INSERT INTO subscriber_my_sponsor(
                    url, logo,sponsor_name , subscriber_id, created_at, subscriber_my_sponsor_view_public, status )
                    VALUES (${(url) ? "'" + url.replace(/'/g, '\'\'') + "'" : null}, ${(logo) ? "'" + logo.replace(/'/g, '\'\'') + "'" : null}, '${sponsor_name.replace(/'/g, '\'\'')}', ${id}, now(), 1, 1);`;
                    console.log(insertSponsor)
                    console.log('insertSponsor..............................') 
            
            
                    if (insertSponsor) { 
                await db.query(insertSponsor);  
            }
        }
       catch (err) { 
        await db.query(`ROLLBACK;`);  
        return { 
            serverError: true,
            error: err.message
        }
    }
}

const updateMySponsorweb = async (req, res) => {
    try {
        const { url, sponsor_name, id } = req.body;
        let sid = req.myID; // unused variable 'sid', consider if it's needed
        let logo = ""; 

        if (req.files?.logo) { // Check if logo is present
            let now = moment();
            var element = req.files.logo;
            var image_name = 'images/profile/' + now.format("YYYYMMDDHHmmss") + element.name;
            element.mv(image_name);
            logo = image_name;
        }

        let updateSponsor = `UPDATE subscriber_my_sponsor SET `;
        updateSponsor += `url = ${(url) ? "'" + url.replace(/'/g, '\'\'') + "'" : 'NULL'}, `;
        updateSponsor += `sponsor_name = '${sponsor_name.replace(/'/g, '\'\'')}'`;

        if (logo) {
            updateSponsor += `, logo = '${logo.replace(/'/g, '\'\'')}'`;
        } 

        updateSponsor += ` WHERE id = ${id};`;

        console.log(updateSponsor);

        console.log("updateSponsor.....................");

        // Consider using parameterized queries to prevent SQL injection
        // await db.query(updateSponsor, [parameters]);

        if (updateSponsor) {
            await db.query(updateSponsor);    
        }
    }
    catch (err) {
        console.error(err); // It's good practice to log the error
        await db.query(`ROLLBACK;`);  
        return { 
            serverError: true,
            error: err.message   
        }
    }
}


const insertGallery = async (req, res) => {
    try {
        await db.query(`BEGIN;`);
        
         var id = req.myID;
         const {title,sport_id ,date} = req.body

        {
           
            let insertHighlights = '';
           
            if (req.files.logo) {
                let now = moment();
                var element = req.files.logo;
                var image_name = 'images/profile/'+ now.format("YYYYMMDDHHmmss") + element.name;
                element.mv(image_name);
                logo = image_name;
              }
                    insertHighlights += `INSERT INTO subscriber_highlighted_gallery(title,sport_id ,date, logo, status, subscriber_id, created_at, highlighted_gallery_view_public )
                    VALUES ('${title}', '${sport_id}','${date}', '${logo}', 1,${id}, now(), 1);`;
            

            console.log("insertHighlights0000000"); 
             console.log(insertHighlights);

            if (insertHighlights) {
                await db.query(insertHighlights);
               // await db.query(`COMMIT;`);
            }
        } 
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log("err...");
        console.log(err);
        await db.query(`ROLLBACK;`); 
        return {
            serverError: true,
            error: err.message
        }
    }
}
const updateGallery = async (req, res) => {
    try {
        let sid = req.myID; // subscriber ID
       // let galleryId = req.body.id; // assuming gallery ID is passed as a URL parameter

        const { title, sport_id, date,id } = req.body;

        let updates = [];
        if (title) updates.push(`title = '${title}'`);
        if (sport_id) updates.push(`sport_id = '${sport_id}'`);
        if (date) updates.push(`date = '${date}'`);

        let logo = "";
        if (req.files && req.files.logo) {
            let now = moment();
            var element = req.files.logo;
            var image_name = 'images/profile/'+ now.format("YYYYMMDDHHmmss") + element.name;
            element.mv(image_name);
            logo = image_name;
            updates.push(`logo = '${logo}'`);
        }

        if (updates.length === 0) {
            console.log("No updates to perform.");
            return true; // Or handle as you see fit
        }

        await db.query(`BEGIN;`);

        let updateQuery = `UPDATE subscriber_highlighted_gallery SET ${updates.join(', ')} WHERE id = ${id} AND subscriber_id = ${sid};`;

        console.log("Preparing to update...");
        console.log(updateQuery);

        await db.query(updateQuery);

        await db.query(`COMMIT;`);
        return true;
    } catch (err) {
        console.log("Error in update:");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        };
    }
}

const insertVideos = async (req, res) => {
    try {
        
        var id = req.myID;
       let insertHighlights = '';
        var cover_img = "";
       const {title,sport_id, date, url} =req.body
       
        if (req.files.cover_img) {
            let now = moment();
            var element = req.files.cover_img;
            var image_name = 'images/profile/' + now.format("YYYYMMDDHHmmss") + element.name;
            element.mv(image_name);
            cover_img = image_name;
          }

        insertHighlights += `INSERT INTO subscriber_highlighted_videos(
                    title,sport_id, date, url,cover_img,status, subscriber_id, created_at, highlighted_videos_view_public )
                    VALUES ('${title}', '${sport_id}','${date}','${url}','${cover_img}', 1,${id}, now(), 1);`; 


                console.log('insertHighlights................=====================');
                    console.log(insertHighlights);
            
            if (insertHighlights) {
                await db.query(insertHighlights);
            }
        
        await db.query(`COMMIT;`);
    }
    catch (err) {
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        }
    }
}

const updateVideos = async (req, res) => {
    try {
        let id = req.myID; // Subscriber ID
        let videoId = req.body.id; // Assuming video ID is passed as a URL parameter

        const { title, sport_id, date, url } = req.body;

        let updates = [];
        if (title) updates.push(`title = '${title}'`);
        if (sport_id) updates.push(`sport_id = '${sport_id}'`);
        if (date) updates.push(`date = '${date}'`);
        if (url) updates.push(`url = '${url}'`);

        let cover_img = "";
        if (req.files && req.files.cover_img) {
            let now = moment();
            var element = req.files.cover_img;
            var image_name = 'images/profile/'+now.format("YYYYMMDDHHmmss") + element.name;
            element.mv(image_name);
            cover_img = image_name;
            updates.push(`cover_img = '${cover_img}'`);
        }

        if (updates.length === 0) {
            console.log("No updates to perform.");
            return true; // Or handle as you see fit  
        } 

        await db.query(`BEGIN;`);

        let updateQuery = `UPDATE subscriber_highlighted_videos SET ${updates.join(', ')} WHERE id = ${videoId} AND subscriber_id = ${id};`;

        console.log("Preparing to update...");
        console.log(updateQuery);

        await db.query(updateQuery);

        await db.query(`COMMIT;`);
        return true;
    } catch (err) {
        console.log("Error in update:");
        console.log(err);
        await db.query(`ROLLBACK;`);
        return {
            serverError: true,
            error: err.message
        };
    }
}

const deleteAll = async(req,res)=>{
    try{
    
    	if(req.body.educationId && req.body.educationId !== 'undefined' && req.body.educationId !== ""){
            var deleteeducation = "update subscriber_education SET status = 2 where id = "+req.body.educationId+""; 
            await db.query(deleteeducation);
        }
	    if(req.body.teamsId && req.body.teamsId !== 'undefined' && req.body.teamsId !== ""){ 
            var deletecareer = "update subscriber_my_teams SET status = 2 where id = "+req.body.teamsId+""; 
            console.log(deletecareer);
            await db.query(deletecareer);    
        }
        if(req.body.sponsorId && req.body.sponsorId !== 'undefined' && req.body.sponsorId !== ""){ 
            var deletesponser = "update subscriber_my_sponsor SET status = 2 where id = "+req.body.sponsorId+"";
            await db.query(deletesponser);
        }
        if(req.body.meetingId && req.body.meetingId !== 'undefined' && req.body.meetingId !== ""){ 
    
           
            var deletesponser = "update meeting SET status = 2 where id = "+req.body.meetingId+"";  
            await db.query(deletesponser);
        }
        if(req.body.galleryId && req.body.galleryId !== 'undefined' && req.body.galleryId !== ""){
    
            var deletegallery = "update subscriber_highlighted_gallery SET status = 2 where id = "+req.body.galleryId+"";
            await db.query(deletegallery);
        }
    
        if(req.body.videosId && req.body.videosId !== 'undefined' && req.body.videosId !== ""){
        var deletevideos = "update subscriber_highlighted_videos SET status = 2 where id = "+req.body.videosId+"";
            await db.query(deletevideos);
        }
           
        if(req.body.awardsId && req.body.awardsId !== 'undefined' && req.body.awardsId !== ""){
            var deleteawards = "update subscriber_play_awards SET status = 2 where id = "+req.body.awardsId+""; 
            await db.query(deleteawards);
        }
    }
    catch(err){
        return{
            serverError:true,
            error: err.message
        }
    }
}










   



module.exports = {
    MySportslist,getMySports,updateMySports, getCompanyProfile, updateCompanyProfile, getProfileTraffic, updateProfileTraffic, getEducationProfile,updateEducationProfile, updateMySponsor, getMySponsor, getHighlightedVideos, updateHighlightedVideos,updateHighlightedgallery,getHighlightedgallery, getViewPublic, getMyTeams, updateMyTeams, updateProfileViewPublic, logPush, logBulk, updateProfile,
    updateSportsProfile, getSportsProfile, updateProfessionProfile, getProfessionProfile,Mytournamentlist,Myeventlist_byid,deletesubscriberdata,EducationProfileInsert
    ,EducationProfileUpdate,addMySports,updateSport,addMyteam,addMySponsor,updateMySponsorweb,insertGallery,updateGallery,insertVideos,updateVideos,deleteAll
}