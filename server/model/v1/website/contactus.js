const {
    Query
} = require('pg');
const db = require('../../../db');
const moment = require('moment');
const helper = require('../../../helper/helper');
// const {queryMongo,mongoose} = require('/var/www/code/play_actio_api/mongoserver/mongodb');
const { queryMongo, mongoose } = require('../../../../mongoserver/mongodb');
// const { Schema } = require('/var/www/code/play_actio_api/mongoserver/model/schema');
const { Schema } = require('../../../../mongoserver/model/schema');


const Insert = async (req, res) => {
    try {

        if (typeof req.body.name == 'undefined' || req.body.name == "") {
            req.body.name = null;
        }
        if (typeof req.body.email_id == 'undefined' || req.body.email_id == "") {
            req.body.email_id = null;
        }

        if (typeof req.body.mobile_no == 'undefined' || req.body.mobile_no == "") {
            req.body.mobile_no = null;
        }

        if (typeof req.body.reason == 'undefined' || req.body.reason == "") {
            req.body.reason = null;
        }

        if (typeof req.body.message == 'undefined' || req.body.message == "") {
            req.body.message = null;
        }

        if (typeof req.body.condition == 'undefined' || req.body.condition == "") {
            req.body.condition = null;
        }



        var insertQry = "INSERT INTO contactus(name, email_id, mobile_no,reason, message, status,condition,recaptcha,add_dt) VALUES ('" + req.body.name + "', '" + req.body.email_id + "', " + req.body.mobile_no + ", '" + req.body.reason + "', '" + req.body.message + "', 1,'" + req.body.condition + "','" + req.body.recaptcha + "',now())RETURNING email_id";

        console.log("insertQry:");
        console.log(insertQry);

        let Wesbite = await db.query(insertQry);

        return Wesbite;
    } catch (err) {
        console.log("err:");
        console.log(err);

        return false;
    }
}

const login = async (req, res) => {
    /*let userStr = "SELECT id,subscriber_id,status,full_name,username,isd_code,mobile_number FROM subscriber where username='"+req.body.username.toLowerCase()+"' and password=MD5('"+req.body.password+"')";
    and r.role='"+req.body.role.toLowerCase()+"'
    */

    //let userStr ="SELECT "

    console.log("555555555555");
    let userStr = "SELECT s.id,s.id,s.subscriber_id,sp.profile_image,s.status,s.full_name,s.username,s.isd_code,mobile_number,s.role,s.email_id FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".user_role r ON s.role=r.id LEFT JOIN subscriber_profile as sp on sp.subscriber_id = s.id WHERE s.email_id='" + req.body.email_id + "' and s.password=MD5('" + req.body.password + "') ";

    console.log('userStr//////////');
    console.log(userStr);

    const result = {};
    try {
        const user = await db.query(userStr);
        if (user.rows[0]) {
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        console.log(err);
        result.user = false;
    }
    return result;
}

const mobilelogin = async (req, res) => {
    try {

        const result = {};

        if (req.body.mobile_number && req.body.email_id) {


            let otpStr = `SELECT email_id from subscriber where email_id ILIKE '%${req.body.email_id}%' and mobile_number:: varchar ILIKE '%${req.body.mobile_number}'`;

            let querydata = await db.query(otpStr);

            if (querydata.rows <= 0) {

                console.log('querydata.rows');
                console.log(querydata.rows);
                return {
                    valid: true,
                    message: 'not exist....'
                }
            } else {

                let otpStr = `SELECT mobile_number,email_id,isd_code,id from subscriber where mobile_number:: varchar ILIKE '%${req.body.mobile_number}%' and email_id ILIKE '%${req.body.email_id}%'`;



                var data = await db.query(otpStr);
                data = data.rows;
            }



            console.log(" result..........................");
            console.log(data);


            return data
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const sendOtp = async (req, res) => {
    const result = {};
    try {

        let checkexistmobile = "SELECT mobile_number,email_id from otp where mobile_number =" + req.number + " and email_id = '" + req.email_id + "'";

        let existdata = await db.query(checkexistmobile);
        console.log('existdata.rows.length---');
        console.log(existdata.rows.length);

        if (existdata.rows.length <= 0) {

            console.log(req.subId);

            var otpStr = "INSERT INTO otp(otp,mobile_number,email_id,subscriber_sid,isd_code) VALUES('" + req.otpNumber + "'," + req.number + ",'" + req.email_id + "'," + req.subId + ",'" + req.isdcode + "')";
            console.log('otpStr0000000000000000000000000');
            console.log(otpStr);
            await db.query(otpStr);

        } else {
            var otpStr = "update otp set otp = " + req.otpNumber + " where mobile_number = " + req.number + " and email_id = '" + req.email_id + "'";

            console.log(otpStr);
            await db.query(otpStr);
        }




    } catch (err) {
        console.log('f');
        console.log(err);
        result.err = err;
    }
    return result;
}

const sendwithMobileOtp = async (req, res) => {
    const result = {};
    try {


        console.log(req.number);
        console.log("number-----------")
        let checkexistmobile = "SELECT mobile_number,email_id from otp where mobile_number =" + req.number + "";

        let existdata = await db.query(checkexistmobile);
        console.log('existdata.rows.length---');
        console.log(existdata.rows.length);

        if (existdata.rows.length <= 0) {

            console.log(req.subId);

            var otpStr = "INSERT INTO otp(otp,mobile_number,email_id,subscriber_sid,isd_code) VALUES('" + req.otpNumber + "'," + req.number + ",'" + req.email_id + "'," + req.subId + ",'" + req.isdcode + "')";
            console.log('otpStr0000000000000000000000000');
            console.log(otpStr);
            await db.query(otpStr);

        } else {
            var otpStr = "update otp set otp = " + req.otpNumber + " where mobile_number = " + req.number + "";

            console.log(otpStr);
            await db.query(otpStr);
        }




    } catch (err) {
        console.log('f');
        console.log(err);
        result.err = err;
    }
    return result;
}

const sendwithemailOtp = async (req, res) => {
    const result = {};
    try {


        console.log(req.number);
        console.log("number-----------")
        let checkexistmobile = "SELECT mobile_number,email_id from otp where email_id ='" + req.email_id + "'";

        let existdata = await db.query(checkexistmobile);
        console.log('existdata.rows.length---');
        console.log(existdata.rows.length);

        if (existdata.rows.length <= 0) {

            console.log(req.subId);

            var otpStr = "INSERT INTO otp(otp,mobile_number,email_id,subscriber_sid,isd_code) VALUES('" + req.otpNumber + "'," + req.number + ",'" + req.email_id + "'," + req.subId + ",'" + req.isdcode + "')";
            console.log('otpStr0000000000000000000000000');
            console.log(otpStr);
            await db.query(otpStr);

        } else {
            var otpStr = "update otp set otp = " + req.otpNumber + " where email_id = '" + req.email_id + "'";

            console.log(otpStr);
            await db.query(otpStr);
        }




    } catch (err) {
        console.log('f');
        console.log(err);
        result.err = err;
    }
    return result;
}

const getUserForgotPassword = async (req) => {
    let result;
    try {

        console.log("1111111111");
        let username = isNaN(req.body.username) ? `username = '${req.body.username}'` : `subscriber_id = ${req.body.username}`;
        const query = `SELECT * FROM ${process.env.SCHEMA}.subscriber WHERE ${username};`
        result = await db.query(query);
        console.log('result.rows');
        console.log(result.rows);
    } catch (error) {
        return [];
    }
    return result.rows;
};


const validateUserForgotPassword = async (req, res) => {
    const result = {};
    console.log('tttttttttttttttttttttt');



    let userStr = `SELECT o.email_id,o.mobile_number,o.isd_code,o.id,o.otp ,s.full_name,o.subscriber_sid FROM 
        subscriber AS s
        INNER JOIN otp as o 
        on s.id = o.subscriber_sid
        WHERE o.otp='${req.body.otp}'
        and o.mobile_number = '${req.body.mobile_number}'
        and o.email_id = '${req.body.email_id}'
        
        ORDER BY o.id DESC LIMIT 1 ;`;

    // else(req.body.email_id){
    //     let userStr = `SELECT o.mobile_number,o.isd_code,o.id,o.otp ,s.full_name,o.subscriber_sid FROM 
    //     subscriber AS s
    //     INNER JOIN otp as o 
    //     on s.id = o.subscriber_sid
    //     WHERE o.otp='${req.body.otp}'
    //     and o.email_id = '${req.body.email_id}'
    //     ORDER BY o.id DESC LIMIT 1 ;`; 
    // }

    //var data = await db.query(userStr); 
    //data = data.rows;

    // 'SELECT o.mobile_number,o.isdcode,o.id,o.otp from subscriber as s ' 

    console.log('userStr-------------');
    console.log(userStr);

    try {
        const user = await db.query(userStr);
        if (user.rows[0]) {
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        console.log(err);
        result.user = false;
    }
    return result;

}

const validmobileotp = async (req, res) => {
    const result = {};


    console.log('tttttttttttttttttttttt');



    let userStr = `SELECT o.email_id,o.mobile_number,o.isd_code,o.id,o.otp ,s.role,s.full_name,s.age,s.gender,s.date_of_birth,o.subscriber_sid FROM 
        subscriber AS s
        INNER JOIN otp as o 
        on s.id = o.subscriber_sid
        WHERE o.otp='${req.body.otp}'
        and o.mobile_number = '${req.body.mobile_number}'
        
        
        ORDER BY o.id DESC LIMIT 1 ;`;





    console.log('userStr-------------');
    console.log(userStr);

    try {
        const user = await db.query(userStr);
        if (user.rows[0]) {

            let verifyotp = `update otp set mobileverify ='true' WHERE mobile_number = '${req.body.mobile_number}'`;
            console.log(verifyotp);
            await db.query(verifyotp);
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        console.log(err);
        result.user = false;
    }
    return result;

}

const validemailotp = async (req, res) => {
    const result = {};


    console.log('tttttttttttttttttttttt');



    let userStr = `SELECT o.email_id,sw.parent_name,sw.last_name,sw.parent_number,o.mobile_number,o.isd_code,o.id,o.otp ,s.role,s.full_name,s.age,s.gender,s.date_of_birth,o.subscriber_sid FROM 
        subscriber AS s
        INNER JOIN otp as o 
        on s.id = o.subscriber_sid
        left join subscriber_web as sw on s.id = sw.subscriber_id
        WHERE o.otp='${req.body.otp}'
        and o.email_id = '${req.body.email_id}'
        
        
        ORDER BY o.id DESC LIMIT 1 ;`;



    console.log('userStr-------------');
    console.log(userStr);

    try {
        const user = await db.query(userStr);
        if (user.rows[0]) {
            let verifyotp = `update otp set emailverify ='true' WHERE email_id = '${req.body.email_id}'`;
            console.log(verifyotp);
            await db.query(verifyotp);
            result.user = user.rows[0];
        } else {
            result.user = false;
        }
    } catch (err) {
        console.log(err);
        result.user = false;
    }
    return result;

}


const createaccountInsert = async (req, res) => {
    try {

        const result = [];
        var username = Math.floor(1000 + Math.random() * 9000);

        console.log('0000000000000000000000000000000000000000000000000');
        console.log(req.body.email_id)

        let otpStr = `SELECT email_id from subscriber where email_id ILIKE '%${req.body.email_id}%'`;

        console.log(otpStr);

        if (typeof req.body.mobile_number == 'undefined') {
            req.body.mobile_number = null
        }


        let querydata = await db.query(otpStr);

        if (querydata.rows.length > 0) {

            var message = 'already exist....';
            return message;


        } else {

            var mobile_data = "Insert INTO subscriber (mobile_number,isd_code,full_name,email_id,username,password,sub_status,status)VALUES(" + req.body.mobile_number + ",'" + req.body.isd_code + "','null','" + req.body.email_id + "','" + username + "','null','" + req.body.sub_status + "',1)RETURNING id,mobile_number,isd_code,email_id";




            let insertedSportID = await db.query(mobile_data);

            var mobiledata = "Insert INTO subscriber_profile(subscriber_id,created_by,status)VALUES(" + insertedSportID.rows[0].id + "," + insertedSportID.rows[0].id + ",1)";
            console.log("mobiledata-----------------");
            console.log(mobiledata)

            let insertID = await db.query(mobiledata);


            let insertedSportIDstr = insertedSportID.rows[0].id;

            let insertedSportIDstr1 = insertedSportID.rows[0].mobile_number;

            let insertedSportIDstr2 = insertedSportID.rows[0].isd_code;

            let insertedSportIDstr3 = insertedSportID.rows[0].email_id;

            result.push({
                "id": insertedSportIDstr,
                "mobile_number": insertedSportIDstr1,
                "isd_code": insertedSportIDstr2,
                "email_id": insertedSportIDstr3
            });


            //let otpStr =`SELECT mobile_number,isd_code,id from subscriber where mobile_number:: varchar ILIKE '%${req.body.mobile_number}%'`;

            //let otpStr ="SELECT o.id,o.otp FROM subscriber AS s INNER JOIN otp as o on s.id = o.subscriber_sid WHERE o.otp="+req.body.otp+" ORDER BY o.id DESC LIMIT 1";

            //var data = await db.query(otpStr);
            //data = data.rows;
        }




        //console.log(" result..........................");
        //console.log(result);


        return result

    } catch (err) {
        console.log(err);
        return false;
    }
}

const createprofile = async (req, res) => {
    try {
        const result = [];
        //let stringdata = "insert into subscriber (full_name,gender,date_of_birth,age,isd_code)VALUES('"+req.body.first_name+"',"+req.body.gender+",'"+req.body.date_of_birth+"',"+req.body.age+",'null') RETURNING id";

        if (req.body.role == undefined && req.body.role == null) {
            req.body.role = null;
        }

        if (req.body.mobile_number == undefined && req.body.mobile_number == null) {
            req.body.mobile_number = null;
        }
        if (req.body.isd_code == undefined && req.body.isd_code == null) {
            req.body.isd_code = null;
        }



        let stringdata = "update subscriber set full_name = '" + req.body.first_name + "',isd_code = '" + req.body.isd_code + "',mobile_number = " + req.body.mobile_number + ", gender = " + req.body.gender + ",date_of_birth = '" + req.body.date_of_birth + "',age =" + req.body.age + " where email_id ='" + req.body.email_id + "' RETURNING id,mobile_number,isd_code,email_id,full_name,date_of_birth";

        console.log(stringdata);
        console.log('22222222222222222222');

        let profiledata = await db.query(stringdata);

        console.log(profiledata.rows)
        /////////////////////////////////////////update staff level tabel in mongo db/////////////////////////////////////////////////
        // let subscriberdata = mongoose.model('staffdatas', Schema.staffdatas);
        // let subscriberdatalevel = mongoose.model('leveldata', Schema.leveldata);

        // await subscriberdata.update( 
        //     { contact_no: req.body.mobile_number },
        //     { $set: { subscriberID: profiledata.rows[0].id } }
        //     );

        // await subscriberdatalevel.update( 
        //     { contact_no: req.body.mobile_number },
        //     { $set: { subscriberID: profiledata.rows[0].id } }
        //     )

        // await subscriberdata.update( 
        //                     { email_id: req.body.email_id },
        //                     { $set: { subscriberID: profiledata.rows[0].id } }
        //                     );

        // await subscriberdatalevel.update( 
        //                     { email_id: req.body.email_id },
        //                     { $set: { subscriberID: profiledata.rows[0].id } } 
        //                     )

        let insertedSportIDstr = profiledata.rows[0].id;

        let insertedSportIDstr1 = profiledata.rows[0].mobile_number;

        let insertedSportIDstr2 = profiledata.rows[0].isd_code;

        let insertedSportIDstr3 = profiledata.rows[0].email_id;
        let insertedSportIDstr4 = profiledata.rows[0].full_name;
        let insertedSportIDstr5 = profiledata.rows[0].date_of_birth;
        let insertedSportIDstr6 = profiledata.rows[0].gender;

        result.push({
            "id": insertedSportIDstr,
            "mobile_number": insertedSportIDstr1,
            "isd_code": insertedSportIDstr2,
            "email_id": insertedSportIDstr3,
            "full_name": insertedSportIDstr4,
            "date_of_birth": insertedSportIDstr5,
            "gender": insertedSportIDstr6


        });

        let id = profiledata.rows[0].id

        console.log('iddddd......trtryryry');
        console.log(id);


        // if (profiledata) {





        // if (req.files && typeof req.files !== "undefined" && req.files.length > 0 || req.files !== null) {  
        //         var element = req.files.adhar_card;
        //         let tourPath = 'images/profile/';
        //         var image_name = tourPath + moment().format('MMDDYYYYHHmmss') + element.name;
        //         element.mv(image_name);
        //         var adhar_str = image_name;



        //     } else {
        //         var adhar_str = null;
        //     }


        // console.log("adhar_str11111111111111111111111111111")
        // console.log(adhar_str)


        // console.log("profile222222222222222222222222222222222222222")
        // console.log(req.files.profile_img)

        // if (req.files && typeof req.files !== "undefined" && req.files.length > 0 || req.files !== null) {
        //     var element = req.files.profile_img;
        //     let tourPath = 'images/profile/';
        //     var image_name = tourPath + moment().format('MMDDYYYYHHmmss') + element.name;
        //     element.mv(image_name);
        //     var profile_str = image_name;

        // } else {
        //     var profile_str = null;
        // }






        let checkdata = " SELECT id from subscriber_web where subscriber_id = " + id + "";
        let rowdata = await db.query(checkdata);

        if (rowdata.rows.length > 0) {

            if (req.body.last_name == undefined) {
                req.body.last_name = null
            }

            if (req.body.parent_name == undefined || req.body.parent_name == "") {
                req.body.parent_name = null
            }

            if (req.body.parent_number == undefined || req.body.parent_number == "") {
                req.body.parent_number = null
            }

            if (req.body.isdcode == undefined || req.body.isdcode == "") {
                req.body.isdcode = null
            }

            let updatedata = "update subscriber_web set last_name = '" + req.body.last_name + "' ,parent_name = '" + req.body.parent_name + "', parent_number = " + req.body.parent_number + ",isd_code = " + req.body.isdcode + "  where subscriber_id = " + id + "";

            console.log('up[date data ....');
            console.log(updatedata);

            await db.query(updatedata);
        } else {

            if (req.body.last_name == undefined) {
                req.body.last_name = null
            }

            if (req.body.parent_name == undefined || req.body.parent_name == "") {
                req.body.parent_name = null
            }

            if (req.body.parent_number == undefined || req.body.parent_number == "") {
                req.body.parent_number = null
            }


            let stringprofile = "Insert into subscriber_web (last_name,parent_name,parent_number,isd_code,subscriber_id,add_dt)VALUES('" + req.body.last_name + "','" + req.body.parent_name + "'," + req.body.parent_number + "," + req.body.isdcode + "," + id + ",now())";

            console.log('iddddd...000000000...');
            console.log(stringprofile);
            await db.query(stringprofile);
        }
        //}
        return result
    } catch (err) {
        console.log(err);
        return false;
        console.log(err);
    }
}


const shearlinkToken = async (req, token) => {
    try {

        //let token = req.token;


        let datastr = "insert into sheartoken (subscriber_id,token,add_at,updated_at,status,link)VALUES(" + req.body.subscriber_id + ",'" + token + "',now(),now(),1,'" + req.body.link + "')RETURNING id,status";

        console.log(datastr);

        await db.query(datastr);

        return true;
    }
    catch (err) {

        console.log(err);

        return false;

    }
}




const Sendmobileotp = async (req, res) => {
    try {

        const result = {};

        if (req.body.mobile_number) {
            console.log('dddddddddddddddddddddddddd...');
            console.log(req.body.mobile_number)

            let otpStr = `SELECT mobile_number from subscriber where mobile_number:: varchar ILIKE '%${req.body.mobile_number}'`;

            let querydata = await db.query(otpStr);

            if (querydata.rows <= 0) {

                console.log('querydata.rows');
                console.log(querydata.rows);
                return {
                    valid: true,
                    message: 'not exist....'
                }
            } else {

                let otpStr = `SELECT mobile_number,email_id,isd_code,id from subscriber where mobile_number:: varchar ILIKE '%${req.body.mobile_number}%'`;



                var data = await db.query(otpStr);
                data = data.rows;
            }



            console.log(" result..........................");
            console.log(data);


            return data
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}

const Sendemailotp = async (req, res) => {
    try {

        const result = {};
        console.log('email_id.............');
        console.log(req.body.email_id)
        if (req.body.email_id) {



            let otpStr = `SELECT email_id from subscriber where email_id:: varchar ILIKE '%${req.body.email_id}'`;
            console.log('er.............');
            console.log(otpStr);

            let querydata = await db.query(otpStr);

            if (querydata.rows <= 0) {

                console.log('querydata.rows');
                console.log(querydata.rows);
                return {
                    valid: true,
                    message: 'not exist....'
                }
            } else {

                let otpStr = `SELECT mobile_number,email_id,isd_code,id from subscriber where email_id:: varchar ILIKE '%${req.body.email_id}%'`;
                console.log('errrrrrrrrrrrrrrrrrrr.............');
                console.log(otpStr);


                var data = await db.query(otpStr);
                data = data.rows;
            }



            console.log(" result..........................");
            console.log(data);


            return data
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}




module.exports = {
    Insert,
    login,
    getUserForgotPassword,
    mobilelogin,
    Sendmobileotp,
    validateUserForgotPassword,
    validmobileotp,

    validemailotp,
    sendOtp,
    sendwithMobileOtp,
    sendwithemailOtp,
    createaccountInsert,
    createprofile,
    Sendemailotp,
    shearlinkToken
};