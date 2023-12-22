const db = require('../../../db');
const helper = require('../../../helper/helper');
//const subscriberModel = require('./admin/subscriber');


const login = async (req, res) => {
    /*let userStr = "SELECT id,subscriber_id,status,full_name,username,isd_code,mobile_number FROM subscriber where username='"+req.body.username.toLowerCase()+"' and password=MD5('"+req.body.password+"')";
    and r.role='"+req.body.role.toLowerCase()+"'
    */
    console.log("hhhhhhhhhhhhhhhh");
    let userStr = "SELECT s.id,s.id,s.subscriber_id,sp.profile_image,s.status,s.full_name,s.username,s.isd_code,mobile_number,s.role,s.email_id FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".user_role r ON s.role=r.id LEFT JOIN subscriber_profile as sp on sp.subscriber_id = s.id WHERE s.username='" + req.body.username.toLowerCase() + "' and s.password=MD5('" + req.body.password + "') ";

    console.log('userStr');
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
        result.user = false;
    }
    return result;
}

const logout = async (req, res) => {
    const result = {};
    try {
        let logoutStr = "UPDATE " + process.env.SCHEMA + ".user_session SET device_token='' , status=0 , updated_at=NOW() WHERE subscriber_id=" + req.myID + " "
        if (req.body.Mode == 1) {
            logoutStr += "AND device_token='" + req.body.deviceToken + "'";
        }
        await db.query(logoutStr);
        result.logout = true;
    } catch (err) {
        result.logout = false;
    }
    return result;
}



const validateOTP = async (req, res) => {
    let otpStr = "SELECT o.id,o.otp ,s.id,s.subscriber_id,s.full_name,s.email_id,s.username FROM " + process.env.SCHEMA + ".subscriber s INNER JOIN " + process.env.SCHEMA + ".otp o ON s.isd_code=o.isd_code AND s.mobile_number=o.mobile_number WHERE s.id=" + req.myID + "  ORDER BY o.id DESC LIMIT 1";
    const result = {};
    try {
        const otp = await db.query(otpStr);
        if (otp.rows[0]) {
            result.otp = otp.rows[0];
        } else {
            result.otp = false;
        }
    } catch (err) {
        result.otp = false;
    }
    return result;
}










const getUserForgotPassword = async (req) => {
    let result;
    try {
        let username = isNaN(req.body.username) ? `username = '${req.body.username}'` : `subscriber_id = ${req.body.username}`;
        const query = `SELECT * FROM ${process.env.SCHEMA}.subscriber WHERE ${username};`
        result = await db.query(query);
    }
    catch (error) {
        return [];
    }
    return result.rows;
};

const validateUserForgotPassword = async (req, res) => {
    let result;
    try {
        result = await db.query(`SELECT o.id,o.otp FROM 
        ${process.env.SCHEMA}.subscriber AS s
        INNER JOIN otp as o 
        on s.id = o.subscriber_sid
        AND s.isd_code=o.isd_code 
        AND s.mobile_number = o.mobile_number 
        WHERE s.username='${req.body.username}'
        ORDER BY o.id DESC LIMIT 1;`);
        const invalid = {
            status: process.env.STATUS_TEMP_422,
            isValid: false,
            msg: 'Invalid OTP !'
        }
        const valid = {
            status: process.env.STATUS_200,
            isValid: true
        }
        if (!result.rows.length) {
            return res.send(invalid);
        }
        if (result.rows[0].otp != req.body.otp) {
            return res.send(invalid);
        }
        return res.send(valid);
    }
    catch (error) {
        return res.send({
            status: process.env.STATUS_TEMP_422,
            error: 'Server error'
        });
    }
}

const updatePassword = async (req, res) => {
    if (req.body.password1 != req.body.password2) {
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_TEMP_422,
            msg: 'Passwords donot match'
        })
    };
    let result;
    try {
        if (req.body.oldpassword) {
            let userStr = await db.query("SELECT s.subscriber_id FROM " + process.env.SCHEMA + ".subscriber as s WHERE s.username='" + req.body.username.toLowerCase() + "' and s.password=MD5('" + req.body.oldpassword + "') ");
            if (!userStr.rowCount) {
                return res.status(process.env.STATUS_200).send({
                    status: process.env.STATUS_TEMP_422,
                    msg: 'Old Password is incorrect'
                })
            }
        }
        result = await db.query(`UPDATE subscriber SET password=MD5('${req.body.password1}') WHERE username='${req.body.username}';`);
        if (!result.rowCount) {
            return res.status(process.env.STATUS_200).send({
                status: process.env.STATUS_TEMP_422,
                msg: 'Update not successful'
            })
        }
        return res.status(process.env.STATUS_200).send({
            status: process.env.STATUS_200,
            msg: 'Password successfully updated !'
        });
    }
    catch (err) {
        return res.status(process.env.STATUS_TEMP_422).send({
            status: process.env.STATUS_TEMP_422,
            msg: 'Update Query not successful !'
        })
    }
}

const getUserForgotUsername = async (req) => {
    let result;
    try {
        result = `SELECT username,subscriber_id FROM ${process.env.SCHEMA}.subscriber WHERE mobile_number='${req.body.mobileNumber}' AND email_id='${req.body.emailID}' LIMIT 1;`
        result = await db.query(result);
    }
    catch (error) {
        return {};
    }
    if (result.rowCount) {
        return result.rows[0];
    }
    return {};
}



const getRequestValidationToken = async (ip) => {
    try {
        await db.query(`INSERT INTO client_request(ip,created_at) VALUES('${ip}',now())`);
    }
    catch (err) {
        console.log(err)
    }
}












module.exports = {
    getRequestValidationToken, 
    getUserForgotUsername, login, validateOTP, logout,
    getUserForgotPassword, validateUserForgotPassword, updatePassword 
}
