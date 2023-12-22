const db = require('../db');
const helper = require('../helper/helper');
const commonController = require('../controller/common');

const master = async (req, res) => {
    const result = {};
    try {
        const countryStr = "SELECT id,code,name AS country,alias FROM " + process.env.SCHEMA + ".country";
        const country = await db.query(countryStr);
        result.country = country.rows;

        const languageStr = "SELECT id,language_name FROM " + process.env.SCHEMA + ".institute_language";
        const Language = await db.query(languageStr);
        result.Language = Language.rows;

        let years = [];
        for (i = 1900; i <= 2022; i++) {
            years.push(i);
        }
        result.years = years;

        const idTypeStr = "SELECT id,proof,country_id FROM " + process.env.SCHEMA + ".government_proof";
        const idTypes = await db.query(idTypeStr);
        result.idTypes = idTypes.rows;

        const genderStr = "SELECT id,gender FROM " + process.env.SCHEMA + ".gender";
        const gender = await db.query(genderStr);
        result.gender = gender.rows;

        const playAwardsStr = "SELECT * FROM " + process.env.SCHEMA + ".subscriber_play_awards_master";
        const playAwards = await db.query(playAwardsStr);
        result.playAwards = playAwards.rows;

        const profileServicesStr = "SELECT * FROM public.profile_services";
        const profileServices = await db.query(profileServicesStr);
        result.profileServices = profileServices.rows;

        let profileType = "SELECT id,profile_type FROM " + process.env.SCHEMA + ".profile_type";
        profileType = await db.query(profileType);
        result.profileType = profileType.rows;

        let professionService = "SELECT id,service_name FROM " + process.env.SCHEMA + ".profile_services";
        professionService = await db.query(professionService);
        result.professionService = professionService.rows;

        let nonIndividualActivity = "SELECT id,name FROM " + process.env.SCHEMA + ".non_individual_activity";
        nonIndividualActivity = await db.query(nonIndividualActivity);
        result.nonIndividualActivity = nonIndividualActivity.rows;

        let profileService = "SELECT id,service_name FROM " + process.env.SCHEMA + ".profile_services";
        profileService = await db.query(profileService);
        result.profileService = profileService.rows;

        let stateand = '';
        if (typeof (req.body.countryID) != "undefined" && req.body.countryID != '') {
            stateand = " AND ( CAST(s.country_id AS TEXT) ='" + req.body.countryID + "' OR c.code='" + req.body.countryID + "' )";
        } else {
            stateand = " AND s.country_id=" + process.env.COUNTRY_ID;
        }
        const stateStr = "SELECT s.id,s.state_name AS state,s.country_id,c.code FROM " + process.env.SCHEMA + ".state AS s INNER JOIN " + process.env.SCHEMA + ".country AS c ON s.country_id = c.id WHERE 1=1 " + stateand + " ORDER BY s.id";
        console.log("hhrrrrr");
        console.log(stateStr);
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

        const sportStr = "SELECT id,sports_name AS sports FROM " + process.env.SCHEMA + ".sports where status = 1  ORDER BY id";
        const sports = await db.query(sportStr);
        result.sports = sports.rows;
        if (req.body.sportsId) {
            let gamePosition = "SELECT id,sports_id,position AS sports FROM " + process.env.SCHEMA + ".game_position WHERE sports_id =" + req.body.sportsId + " ORDER BY id";
            gamePosition = await db.query(gamePosition);
            result.gamePosition = gamePosition.rows;
        }
        else {
            result.gamePosition = []
        }

        const instituteStr = "SELECT id,institute_name,address1,address2 FROM " + process.env.SCHEMA + ".institute WHERE status=1 ORDER BY id";
        const institute = await db.query(instituteStr);
        result.institute = institute.rows;

        const classStr = "SELECT id,class,institute_id FROM " + process.env.SCHEMA + ".institute_class WHERE status=1 ORDER BY id";
        const instituteClass = await db.query(classStr);
        result.instituteClass = instituteClass.rows;

       

        if (typeof (req.body.classID) != "undefined" && req.body.classID != "") {
            const instituteStreamStr = "SELECT id,stream,class_id FROM " + process.env.SCHEMA + ".institute_stream WHERE status=1 AND class_id=" + req.body.classID + " ORDER BY id";
            const instituteStream = await db.query(instituteStreamStr);
            result.instituteStream = instituteStream.rows;
        } else {
            result.instituteStream = [];
        }

        if (typeof (req.body.streamID) != "undefined" && req.body.streamID != "") {
            const institutedivisionStr = "SELECT id,division,stream_id FROM " + process.env.SCHEMA + ".institute_division WHERE status=1 AND stream_id=" + req.body.streamID + " ORDER BY id";
            const institutedivision = await db.query(institutedivisionStr);
            result.institutedivision = institutedivision.rows;
        } else {
            result.institutedivision = [];
        }

        if (typeof (req.body.stateCity) != "undefined" && req.body.stateCity) {
            const stateCityStr = "SELECT id AS state_id,state_name , array_to_json(ARRAY(SELECT d FROM (SELECT id AS city_id,city_name,state_id FROM " + process.env.SCHEMA + ".city WHERE state_id=s.id ORDER BY id)d))as city FROM " + process.env.SCHEMA + ".state AS s ORDER BY id";
            const stateCity = await db.query(stateCityStr);
            result.stateCity = stateCity.rows;
        }
    } catch (err) {
        console.log(err)
        result.country = [];
        result.Language = [];
        result.state = [];
        result.city = [];
        result.sports = [];
        result.institute = [];
        result.instituteClass = [];
        //result.instituteLanguageStr = [];
        result.instituteStream = [];
        result.institutedivision = [];
        result.stateCity = [];
    }
    return result;
}

const uploadProfile = async (req, res) => {
    try {
        let profileStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_profile (subscriber_id,profile_image,created_by) VALUES (" + req.myID + ",'" + req.body.displayPictureName + "'," + req.myID + ")ON CONFLICT (subscriber_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",profile_image='" + req.body.displayPictureName + "'";
        await db.query(profileStr);
        return true;
    } catch (err) {
        return false;
    }
}

const profile = async (req, res) => {
    try {
        let aboutSponsorship = ""; let aboutOrganize = "";
        if (req.body.isSponsor && typeof (req.body.aboutSponsorship) != "undefined") { aboutSponsorship = req.body.aboutSponsorship; }
        if (req.body.isOrganizer && typeof (req.body.aboutOrganize) != "undefined") { aboutOrganize = req.body.aboutOrganize; }
        let profileStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_profile (subscriber_id,is_student,is_coach,is_sponsor,is_organizer,sponsor_remarks,organizer_remarks,created_by) VALUES  (" + req.myID + "," + req.body.isStudent + "," + req.body.isCoach + "," + req.body.isSponsor + "," + req.body.isOrganizer + ",$$" + aboutSponsorship + "$$,$$" + aboutOrganize + "$$," + req.myID + ") ON CONFLICT (subscriber_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ", is_student=" + req.body.isStudent + ",is_coach=" + req.body.isCoach + ",is_sponsor=" + req.body.isSponsor + ",is_organizer=" + req.body.isOrganizer + ",sponsor_remarks=$$" + aboutSponsorship + "$$, organizer_remarks=$$" + aboutOrganize + "$$";
        await db.query(profileStr);

        if (req.body.isStudent) {
            let educationStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_education (subscriber_id,institute_id,academic_from_year,academic_to_year,class_id,stream_id,division_id,city_id,pincode,created_by) VALUES (" + req.myID + "," + req.body.instituteID + "," + req.body.fromYear + "," + req.body.toYear + "," + req.body.classID + "," + req.body.streamID + "," + req.body.divisionID + "," + req.body.cityID + "," + req.body.pincode + "," + req.myID + ") ON CONFLICT (subscriber_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",institute_id=" + req.body.instituteID + ",academic_from_year=" + req.body.fromYear + " ,academic_to_year=" + req.body.toYear + ",class_id=" + req.body.classID + ",stream_id=" + req.body.streamID + ",division_id=" + req.body.divisionID + ",city_id=" + req.body.cityID + ",pincode=" + req.body.pincode + "";
            await db.query(educationStr);
        }

        let resetplayStr = "UPDATE " + process.env.SCHEMA + ".subscriber_play SET status=0,updated_at=NOW(),updated_by=" + req.myID + " WHERE subscriber_id = " + req.myID + " ";
        await db.query(resetplayStr);

        let sportplayStr = "";
        req.body.sportsPlay.forEach(e => {
            sportplayStr += "INSERT INTO " + process.env.SCHEMA + ".subscriber_play (subscriber_id,sports_id,playing_since,weekly_hours,status,created_by) VALUES (" + req.myID + "," + e.sportsID + "," + e.since + "," + e.hours + ",1," + req.myID + ") ON CONFLICT (subscriber_id,sports_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",playing_since=" + e.since + ",weekly_hours=" + e.hours + ",status=1;";
        });
        if (sportplayStr != "") {
            await db.query(sportplayStr);
        }

        let resetCoachStr = "UPDATE " + process.env.SCHEMA + ".subscriber_coaching SET status=0,updated_at=NOW(),updated_by=" + req.myID + " WHERE subscriber_id=" + req.myID + ""
        await db.query(resetCoachStr);
        if (req.body.isCoach) {
            let coachingStr = "";
            req.body.coaching.forEach(e => {
                coachingStr += "INSERT INTO " + process.env.SCHEMA + ".subscriber_coaching (subscriber_id,sports_id,city_id,locality,remarks,created_by,status) VALUES (" + req.myID + "," + e.sportsID + "," + e.cityID + ",$$" + e.locality + "$$,$$" + e.about + "$$," + req.myID + ",1) ON CONFLICT (subscriber_id,sports_id,city_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",sports_id=" + e.sportsID + ",locality=$$" + e.locality + "$$,remarks=$$" + e.about + "$$,status=1 ;";
            });
            await db.query(coachingStr);
        }
        return true;
    } catch (err) {
        return false;
    }
}

const getprofile = async (req, res) => {
    const result = {};
    try {
    //subscriber_id

//console.log('req.body.subscriber_id');
//console.log(req.body.subscriber_id);
var id = req.body.subscriber_id;

console.log("id: ++++++++++++++");
console.log(id);

//    var wherstr = "";
       //  if(req.body.sub_id && typeof req.body.sub_id !== undefined && req.body.sub_id !== ""){
       //        wherstr = req.body.sub_id;
       //  }
       // var wherstrr = " ";
       //  if(req.body.profile_id && req.body.profile_id !== undefined && req.body.profile_id !== ""){
       //     wherstrr = req.body.profile_id
       //  }


        let profileStr = `SELECT s.*,
        s.user_type,s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id,
        s.username,s.email_id,s.full_name,s.isd_code,
        s.mobile_number,to_char(s.date_of_birth,'YYYY-MM-DD') AS date_of_birth,
        coun.id as country_id,coun.name as country_name,
        s.gender,s.proof_type,s.proof_number_sole || s.proof_number_pair as proof_number,
        s.proof_copy_sole as front_image,s.proof_copy_pair as back_image,
        sprof.height,sprof.weight,sprof.birth_place,sprof.city,sprof.state,sprof.country,sprof.is_student,
        s.subscriber_id as actio_subscription_id,substa.status as subscriber_status,
        user_role.role,
        s.full_name,
        CASE
        WHEN s.user_type=1  THEN 'Company'
        WHEN s.user_type=2 THEN 'User'
        END as subscriber_type,
        s.isd_code,
        s.mobile_number,
        s.email_id,
        s.username,
        gp.proof as subscriber_proof_type,
        s.proof_number_sole,
        s.proof_number_pair,
        s.proof_copy_sole,
        s.proof_copy_pair,
        sprof.profile_image,
        sprof.cover_image,
        sprof.height AS subscriber_height,
        sprof.weight AS subscriber_weight,
        c0.city_name AS subscriber_city_name,
        st.state_name AS subscriber_state_name,
        coun.name AS subscriber_country_name,
        sprof.is_student,
        sprof.is_coach,
        sprof.is_sponsor,
        sprof.is_organizer,
        sprof.sponsor_remarks,
        sprof.organizer_remarks,
        sp1.sports_name as coaching_sport_name,
        c1.city_name as coaching_city_name,
        scoach.locality as coaching_locality,
        scoach.remarks as coaching_remarks
           
        FROM subscriber as s
        LEFT JOIN subscriber_status AS substa
        ON substa.id = s.status
        LEFT JOIN gender AS gen
        ON gen.id = s.gender
        LEFT JOIN government_proof AS gp
        ON gp.id = s.proof_type
        LEFT JOIN user_role
        ON user_role.id = s.role
        LEFT JOIN subscriber_profile as sprof 
        ON sprof.subscriber_id = s.id
        LEFT JOIN city as c0
        ON c0.id = sprof.city
        LEFT JOIN state as st
        ON st.id = sprof.state
        LEFT JOIN country as coun
        ON coun.code = s.isd_code
        LEFT JOIN subscriber_coaching as scoach
        ON scoach.subscriber_id = s.id
        LEFT JOIN sports as sp1
        ON sp1.id = scoach.sports_id
        LEFT JOIN city as c1
        ON c1.id = scoach.city_id
        WHERE s.id = ${id}
        ORDER BY actio_subscription_id asc`; 
        
        console.log('profileStr======================='); 
        console.log(profileStr);
        
        const profile = await db.query(profileStr);
        if (profile.rowCount > 0) {
            if (profile.rows[0].date_of_birth) {
                profile.rows[0].age = helper.getAgeFromYYYYMMDD(profile.rows[0].date_of_birth)
            }
            let parentDetails = await checkParent(null, id);
            profile.rows[0]['parentDetails'] = parentDetails
            result.profile = profile.rows[0];
        } else {
            result.profile = {};
        }
    } catch (err) {
        
        console.log("err: ")
        console.log(err);

        result.profile = {};
    }

    return result.profile;
}

const eventAssociated = async (id, res) => {
    try {
        let eventAssociated = `SELECT DISTINCT ON (e.id) e.id,e.event_name,ea.attachment as event_logo,
        to_char(e.event_start_date,'DD') as event_start_date,
        TRIM(to_char(e.event_start_date,'Month')) as event_start_month,
        TRIM(to_char(e.event_start_date,'YYYY')) as event_start_year,
        CONCAT(v.venue_name,', ', c.city_name) as event_address,
        0 AS status
        FROM  event_players as ep
        INNER JOIN event_registration as er
        ON ep.registration_id = er.id
        INNER JOIN event as e
        ON e.id = event_id
        INNER JOIN venue as v 
        ON v.id = e.venue_id
        INNER JOIN city as c
        ON c.id = v.city_id
        INNER JOIN event_attachment as ea
        ON ea.event_id = e.id AND ea.type='banner'
        WHERE ep.subscriber_id = ${id}
        AND e.event_end_date < now();`;
        eventAssociated = await db.query(eventAssociated);
        if (eventAssociated.rowCount) {
            return eventAssociated.rows
        }
        return [];
    } catch (err) {
        return [{
            err: 'Server error'
        }];
    }
}

const checkParent = async (mobileNumber, id) => {
    let parent = await db.query(`SELECT s.*,r.bond FROM subscriber_approvel as sa INNER JOIN subscriber as s ON s.id = sa.parent_id  LEFT JOIN relationship as r ON r.id = sa.relation_id where sa.child_id=${id} ORDER BY id LIMIT 1`);
    if (parent.rowCount) {
        let row = parent.rows[0];
        // if(row.id == id) {
        //     return {
        //         isParent : true,
        //         parentData : row
        //     }
        // }
        return row;
        // isParent : false,
    }
    else {
        return {};
    }
}

// const sendOTP 
const changeEmailorPhone = async (req, res) => {
    try {
        if (!req.body.otp) {
            // if(req.body.mobile) {
            //     let mobileFound = await db.query(`SELECT id FROM subscriber WHERE mobile_number=${req.body.mobile}`);
            //     if(mobileFound.rowCount) {
            //         return {
            //             status : 422,
            //             msg : 'Mobile number already exists !'
            //         }
            //     }
            // }
            if (req.body.email) {
                let emailFound = await db.query(`SELECT id FROM subscriber WHERE email_id='${req.body.email}'`);
                if (emailFound.rowCount) {
                    return {
                        status: 422,
                        msg: 'Email already already exists !'
                    }
                }
                let otpNumber = Math.floor(1000 + Math.random() * 9000);
                let otpStr = "INSERT INTO " + process.env.SCHEMA + ".otp (subscriber_sid,isd_code,mobile_number,otp) values (" + req.myID + ",'+91','9999999999'," + otpNumber + ")";
                await db.query(otpStr);
                const maildata = {};
                maildata.To = req.body.email;
                maildata.Content = 'Your email change request OTP is : ' + otpNumber;
                maildata.Subject = 'Email Change Request';
                await helper.sendMail(maildata);
                return {
                    status: 200,
                    msg: `OTP has been sent to your mail !`
                }
            }
            else {
                let requestOTP = {
                    myID: req.myID,
                    body: {
                        basicOTP: true,
                        onlyOTP: true,
                        newISD: (req.body.newISD) ? req.body.newISD : null,
                        newMobile: (req.body.mobile) ? req.body.mobile : null,
                    }
                }
                await commonController.sendOTP(requestOTP, res);
                return 'resSent';
            }
        }
        else {
            let otp = await db.query(`select otp,EXTRACT(EPOCH FROM (now() - created_at))::int as seconds_elapsed from otp where subscriber_sid=${req.myID} and EXTRACT(EPOCH FROM (now() - created_at))::int <300  order by id desc limit 1;`);
            if (!otp.rowCount) {
                return {
                    status: 422,
                    msg: 'Entered OTP might be expired or invalid.'
                }
            }
            if (otp.rows[0].otp != req.body.otp) {
                return {
                    status: 422,
                    msg: 'Please Enter valid OTP'
                }
            }
            if (req.body.mobile) {
                let isd = (req.body.newISD) ? `,isd_code ='${req.body.newISD}'` : '';
                await db.query(`UPDATE subscriber set mobile_number=${req.body.mobile} ${isd} where id =${req.myID}`)
            }
            else if (req.body.email) {
                await db.query(`UPDATE subscriber set email_id='${req.body.email}' where id =${req.myID}`)
            }
            await db.query(`DELETE FROM otp where subscriber_sid=${req.myID}`)
            return {
                status: 200,
                msg: `${(req.body.mobile) ? 'Mobile number' : 'Email id'} updated successfully !`
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

module.exports = { checkParent, master, uploadProfile, profile, getprofile, eventAssociated, changeEmailorPhone }
