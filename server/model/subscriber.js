const db = require('../db');

const init = async (req, res) => {
    let result = {};
    try {
        let countryID = req.body.countryID ? req.body.countryID : process.env.COUNTRY_ID;
        let countrystr = "SELECT * FROM " + process.env.SCHEMA + ".country";
        let proofStr = "SELECT id,proof FROM " + process.env.SCHEMA + ".government_proof WHERE  country_id='" + countryID + "' ";
        let genderStr = "SELECT id,gender FROM  " + process.env.SCHEMA + ".gender ORDER BY id";
        let country = await db.query(countrystr);
        let proof = await db.query(proofStr);
        let gender = await db.query(genderStr);
        result.country = country.rows;
        result.proof = proof.rows;
        result.gender = gender.rows;
    } catch (err) {
        result.country = [];
        result.proof = [];
    } finally {
        return result;
    }
}

const register = async (req, res) => {
    let result = {};
    try {
        let newDOB = '';
        let newDOBKey = '';
        if (req.body.dob) {
            let strDOB = req.body.dob.split('-');
            newDOB = "'" + strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0] + "',";
            newDOBKey = 'date_of_birth,'
        }
        let gender = ""; let genderval = "";
        if (typeof req.body.gender != "undefined" && req.body.gender != "") {
            gender = ",gender";
            genderval = "," + req.body.gender;
        }
        let designation = ""; let designationval = "";
        if (typeof req.body.designation != "undefined" && req.body.designation != "") {
            designation = ",designation";
            designationval = ",'" + req.body.designation + "'";
        }
        let idType = ''; let idTypeVal = ''
        if (req.body.idType) {
            idType = ",proof_type";
            idTypeVal = `,${req.body.idType}`
        }
        let idNumber = ''; let idNumberVal = '', idNumber2 = '', idNumber2Val = '';
        if (req.body.idNumber) {
            idNumber = ",proof_number_sole";
            idNumberVal = `,'${req.body.idNumber.slice(0, 5)}'`;
            idNumber2 = ",proof_number_pair";
            idNumber2Val = `,'${req.body.idNumber.slice(5)}'`
        }
        let frontImageName = '', frontImageNameVal = ''
        if (req.body.frontImageName) {
            frontImageName = ',proof_copy_sole'
            frontImageNameVal = ",'" + req.body.frontImageName + "'"
        }
        let backImageName = '', backImageNameVal = ''
        if (req.body.backImageName) {
            backImageName = ',proof_copy_pair';
            backImageNameVal = ",'" + req.body.backImageName + "'"
        }

        let registerStr = "INSERT INTO " + process.env.SCHEMA
            + ".subscriber (full_name,user_type,isd_code,mobile_number,email_id,username,password," + newDOBKey + "status"
            + gender + `${idType}${idNumber}${idNumber2}${frontImageName}${backImageName}`
            + ") values ('"
            + req.body.fullName + `','${req.body.userType}','` + req.body.isdCode + "'," + req.body.mobileNumber + ",'"
            + req.body.emailID + "','" + req.body.userName.toLowerCase() + "',MD5('"
            + req.body.password + "')," + newDOB +
            +process.env.INITIALIZE + genderval + `${idTypeVal}${idNumberVal}${idNumber2Val}
        ${frontImageNameVal}${backImageNameVal}`
            +
            ")";
        let register = await db.query(registerStr);
        let strID = "SELECT currval(pg_get_serial_sequence('" + process.env.SCHEMA + ".subscriber','id'))";
        const subseqID = await db.query(strID);
        result.subscriberSeqID = subseqID.rows[0].currval;

        if (req.body.userType == 2 || req.body.userType == '2') {
            await db.query(`INSERT INTO company_profile(name,designation,subscriber_id,created_at) VALUES('${req.body.companyName}','${req.body.designation}',${result.subscriberSeqID},NOW()) `)
        }

        const subID = await subscriberid(result.subscriberSeqID);
        let subIDStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET subscriber_id=" + subID + " where id = " + result.subscriberSeqID;
        await db.query(subIDStr);
        result.subscriberID = subID;
        result.userStatus = process.env.INITIALIZE;

    } catch (err) {
        result.err = err;
    } finally {
        return result;
    }
}

const userNameOrEmailExist = async (username, email) => {
    let result = {};
    if (email) {
        email = `OR email_id='${email.toLowerCase()}'`;
    }
    else {
        email = '';
    }
    result.userExist = false;
    try {
        let usernameStr = `SELECT username FROM ${process.env.SCHEMA}.subscriber WHERE username='${username.toLowerCase()}' ${email};`
        let user = await db.query(usernameStr);
        result.success = true;
        if (user.rows.length) {
            result.userExist = true;
        }
    } catch (err) {
        console.log(err)
        result.success = false;
    } finally {
        return result;
    }
}

const subscriberid = async (seqid) => {
    let text = "000000000";
    let limit = text.length - seqid.toString().length;
    text = text.substring(0, limit) + seqid;
    let digits = text.split('');
    let i = 0;
    let digit = 0;
    digits.forEach(val => {
        i++;
        switch (i) {
            case 1:
            case 4:
            case 7:
                digit += (val * 1);
                break;
            case 2:
            case 5:
            case 8:
                digit += (val * 3);
                break;
            case 3:
            case 6:
            case 9:
                digit += (val * 7);
                break;
        }
    });

    while (digit > 9) {
        let n_text = "000";
        let n_limit = n_text.length - digit.toString().length;
        n_text = n_text.substring(0, n_limit) + digit.toString();
        digits = n_text.split('');
        digit = 0;
        digits.forEach(val => {
            digit += +val;
        });
    }
    return seqid.toString() + digit.toString();
}

const vaidatenewUser = async (req) => {
    const userStr = "SELECT s.id,s.isd_code,s.mobile_number,o.id as o_id,o.mobile_number as o_number,DATE_PART('year',AGE(s.date_of_birth)) age,c.min_age FROM " + process.env.SCHEMA + ".subscriber as s LEFT JOIN " + process.env.SCHEMA + ".subscriber as o ON s.isd_code=o.isd_code and s.mobile_number=o.mobile_number and s.id != o.id INNER JOIN " + process.env.SCHEMA + ".country as c ON s.isd_code=c.code where s.id=" + req.subscriberSeqID + " AND o.user_type=1 ORDER BY s.id limit 1";
    //  and s.status="+process.env.INITIALIZE+"
    let result = {};
    try {
        let user = await db.query(userStr);
        result.user = (user.rowCount) ? user.rows[0] : {};
    } catch (err) {
        result.err = err;
    }

    return result;
}

const sendOtp = async (req, res) => {
    let otpStr = "INSERT INTO " + process.env.SCHEMA + ".otp (subscriber_sid,isd_code,mobile_number,otp) values (" + req.subId + ",'" + req.isdcode + "','" + req.number + "'," + req.otpNumber + ")";
    const result = {};
    try {
        await db.query(otpStr);
    } catch (err) {
        result.err = err;
    }
    return result;
}

const updateUserStatus = async (sid, status, res) => {
    let updateStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET status = " + status + " , updated_at=NOW() WHERE id=" + sid + "";
    const result = {};
    try {
        await db.query(updateStr);
    } catch (err) {
        result.err = err;
    }
    return result;
}

const getUserbyID = async (id, res) => {
    let userStr = "SELECT *,to_char(date_of_birth,'DD-MM-YYYY') as dob FROM " + process.env.SCHEMA + ".subscriber WHERE id=" + id + "";
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.err = err;
    }
    return result;
}

const getUserbySubID = async (id, res) => {
    let userStr = "SELECT * FROM " + process.env.SCHEMA + ".subscriber WHERE subscriber_id=" + id + "";
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.err = err;
    }
    return result;
}

const getUserbyName = async (name, res) => {
    let userStr = "SELECT * FROM " + process.env.SCHEMA + `.subscriber WHERE username='${name}'`;
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.err = err;
    }
    return result;
}

const isParentByID = async (id, res) => {
    let userStr = "SELECT s.*,s_a.child_id , CASE WHEN  s_a.child_id > 0 THEN '0' ELSE '1' END AS allow FROM " + process.env.SCHEMA + ".subscriber AS s LEFT JOIN " + process.env.SCHEMA + ".subscriber_approvel AS s_a ON s.id=s_a.child_id WHERE s.subscriber_id=" + id + " AND s.status=1";
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.err = err;
    }
    return result;
}

const approvalRequest = async (req, res) => {
    let approvalStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_approvel(parent_id, child_id)VALUES ( " + req.parentId + "," + req.childId + ")";
    const result = {};
    try {
        await db.query(approvalStr);
    } catch (err) {
        result.err = err;
    }
    return result;
}

const isValidApproval = async (req, res) => {
    let isvalidStr = "SELECT * FROM " + process.env.SCHEMA + ".subscriber_approvel WHERE parent_id = " + req.myID + " AND child_id=" + req.body.childID + " ORDER BY id DESC LIMIT 1";
    const result = {};
    try {
        const request = await db.query(isvalidStr);
        result.request = request.rows[0];
    } catch (err) {
        result.request = false;
        result.err = err;
    }
    return result;
}

const updateRelationship = async (req, res) => {
    let updateStr = "UPDATE " + process.env.SCHEMA + ".subscriber_approvel SET relation_id=" + req.relationID + " , mobile_allow=" + req.mobile_allow + "  WHERE id = " + req.reqID + " ";
    const result = {};
    try {
        const request = await db.query(updateStr);
    } catch (err) {
        result.err = err;
    }
    return result;
}

const parentMobileUser = async (id, res) => {
    let userStr = "SELECT par.* FROM " + process.env.SCHEMA + ".subscriber s  INNER JOIN " + process.env.SCHEMA + ".subscriber par ON s.id != par.id AND s.id > par.id AND s.isd_code = par.isd_code AND s.mobile_number=par.mobile_number WHERE s.id =" + id + " ORDER BY par.id  LIMIT 1";
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.user = false;
        result.err = err;
    }
    return result;
}

const requestParentUser = async (id, res) => {
    let userStr = "SELECT s.* ,sa.id AS SID  from " + process.env.SCHEMA + ".subscriber_approvel sa INNER JOIN " + process.env.SCHEMA + ".subscriber s ON sa.parent_id = s.id WHERE sa.child_id=" + id + " ORDER BY SID DESC LIMIT 1 ";
    const result = {};
    try {
        const user = await db.query(userStr);
        result.user = user.rows[0];
    } catch (err) {
        result.user = false;
        result.err = err;
    }
    return result;
}

const list = async (req, res) => {
    const result = {};
    try {
    	console.log("gggggggggg"); 

    	console.log(req.body.fromDate);
        let and = "";
        if (typeof (req.body.fromDate) != "undefined" && req.body.fromDate != '' && typeof (req.body.toDate) != "undefined" && req.body.toDate != '') {
            let strFrom = req.body.fromDate.split('-');
            let strTo = req.body.toDate.split('-');
            let fdob = strFrom[2] + '-' + strFrom[1] + '-' + strFrom[0];
            let tdob = strTo[2] + '-' + strTo[1] + '-' + strTo[0];
            and += " AND s.created_at  BETWEEN '" + fdob + " 00:00:00' AND '" + tdob + " 23:59:59' ";
        }

        let andGroup = "";
        if (typeof (req.body.subscriberType) != "undefined" && req.body.subscriberType != '') {
            switch (req.body.subscriberType) {
                case 1:
                case "1":
                    andGroup = " GROUP BY s.id,s.subscriber_id ,s_a.child_id,s.created_at,s.full_name,s.isd_code,s.mobile_number,s.date_of_birth,s.gender,s.status ,s_s. status,ge.gender HAVING s.status NOT IN (" + process.env.PARENTAGEAWAIT + "," + process.env.PARENTMOBILEAWAIT + "," + process.env.REJECTAWAIT + ") AND s_a.child_id IS  null ";
                    break;
                case 2:
                case "2":
                    andGroup = " GROUP BY s.id,s.subscriber_id ,s_a.child_id,s.created_at,s.full_name,s.isd_code,s.mobile_number,s.date_of_birth,s.gender,s.status ,s_s. status,ge.gender HAVING s.status IN (" + process.env.PARENTAGEAWAIT + "," + process.env.PARENTMOBILEAWAIT + "," + process.env.REJECTAWAIT + ") OR s_a.child_id IS NOT null ";
                    break;
                default:
                    break;
            }
        }

        if (typeof (req.body.subscriberStatus) != "undefined" && req.body.subscriberStatus != '') {
            and += " AND s.status=" + req.body.subscriberStatus + "";
        }
        let subscriberStr = "SELECT DISTINCT s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id ,s.sub_status,s.full_name,s.isd_code,s.mobile_number,to_char(s.date_of_birth,'DD-MM-YYYY') AS dob,s.gender AS gender_id,ge.gender,s.status AS  status_id,s_s.status  ,CASE WHEN s.status = " + process.env.PARENTAGEAWAIT + " OR s.status = " + process.env.PARENTMOBILEAWAIT + " OR s.status = " + process.env.REJECTAWAIT + " THEN 'child' WHEN s_a.child_id>1 THEN 'child' ElSE 'parent' END AS usermode ,to_char(s.created_at,'DD-MM-YYYY') created FROM " + process.env.SCHEMA + ".subscriber  AS s LEFT JOIN " + process.env.SCHEMA + ".subscriber_approvel  AS s_a ON s.id=s_a.child_id LEFT JOIN " + process.env.SCHEMA + ".gender AS ge ON s.gender=ge.id INNER JOIN " + process.env.SCHEMA + ".subscriber_status AS s_s ON s.status= s_s.id WHERE s.status = 1 AND s.subscriber_id != 0 " + and + " " + andGroup + " ORDER BY s.id DESC";
        let subscriber = await db.query(subscriberStr);
        result.list = subscriber.rows;

        console.log("ffffffffffffffffffffffffffffffffffffff");
        console.log(result.list);
    } catch (err) {
        console.log("ffffffffffffffffffffffffffffffffffffff");
        console.log(subscriberStr);
    	console.log(err);
        result.list = [];
    }
    return result.list;
}

const listMaster = async (req, res) => {
    const result = {};
    try {
        let statusStr = "SELECT id,status FROM  " + process.env.SCHEMA + ".subscriber_status ORDER BY id";
        const status = await db.query(statusStr);
        result.subscriberStatus = status.rows;
        result.subscriberType = [{ "id": 1, "type": "Parent" }, { "id": 2, "type": "Child" }];
    } catch (err) {
        result.subscriberStatus = [];
        result.subscriberType = [];
    }
    return result;
}

const profile = async (id, res) => {
    const result = {};
    try {
        let subscriberStr = "SELECT s.*, s.id AS subscriber_id,s.subscriber_id AS subscriber_display_id,s.user_type,s.full_name,s.isd_code,s.mobile_number,s.email_id,s.username, to_char(s.date_of_birth,'DD-MM-YYYY') dob,s.proof_type,g_p.proof,s.proof_number_sole||s.proof_number_pair AS proof_id,s.proof_copy_sole AS front_image,s.proof_copy_pair AS back_image,u_r.role, s_s.status,ge.gender,s.gender AS gender_id FROM " + process.env.SCHEMA + ".subscriber AS s  INNER JOIN " + process.env.SCHEMA + ".subscriber_status AS s_s ON s.status = s_s.id LEFT JOIN " + process.env.SCHEMA + ".gender AS ge ON s.gender=ge.id LEFT JOIN " + process.env.SCHEMA + ".government_proof AS g_p ON s.proof_type=g_p.id INNER JOIN " + process.env.SCHEMA + ".user_role AS u_r ON s.role=u_r.id WHERE s.status = 1 and s.id=" + id + "";
        const subscriber = await db.query(subscriberStr);
        if (subscriber.rowCount > 0) {
            result.subscriber = subscriber.rows[0];
        } else {
            result.subscriber = {};
        }
    } catch (err) {
        result.subscriber = {};
    }
    return result.subscriber;
}

const editSubscriber = async (req, res) => {
    try {
        let and = "";
        if (typeof (req.body.frontImageName) != "undefined" && req.body.frontImageName != '') {
            and += ", proof_copy_sole=$$" + req.body.frontImageName + "$$";
        }

        if (typeof (req.body.backImageName) != "undefined" && req.body.backImageName != '') {
            and += ", proof_copy_pair=$$" + req.body.backImageName + "$$";
        }

        if (typeof (req.body.gender) != "undefined" && req.body.gender != '') {
            and += ", gender=" + req.body.gender + "";
        }

        if (typeof (req.body.password) != "undefined" && req.body.password != '') {
            and += ", password=MD5('" + req.body.password + "')";
        }

        let strDOB = req.body.dob.split('-');
        let newDOB = strDOB[2] + '-' + strDOB[1] + '-' + strDOB[0];
        let subscriberStr = "UPDATE " + process.env.SCHEMA + ".subscriber SET updated_at=now(),updated_by=" + req.myID + ",full_name=$$" + req.body.fullName + "$$,isd_code=$$" + req.body.isdCode + "$$,mobile_number=" + req.body.mobileNumber + ",email_id=$$" + req.body.emailID + "$$,date_of_birth=$$" + newDOB + "$$,proof_type=" + req.body.idType + ",proof_number_sole=$$" + req.body.idNumber.slice(0, 5) + "$$,proof_number_pair=$$" + req.body.idNumber.slice(5) + "$$" + and + " WHERE id=" + req.body.subscriberID + "";
        await db.query(subscriberStr);

        if (typeof req.body.displayPictureName != "undefined" && req.body.displayPictureName != '') {
            let profileStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_profile (subscriber_id,profile_image,created_by) VALUES (" + req.body.subscriberID + ",'" + req.body.displayPictureName + "'," + req.myID + ")ON CONFLICT (subscriber_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",profile_image='" + req.body.displayPictureName + "'";
            await db.query(profileStr);
        }
        return true;
    } catch (err) {
        return false;
    }
}

const checkCompanyMobileDuplicate = async (mobileNumber) => {
    let query = await db.query(`SELECT isd_code,mobile_number from subscriber
    WHERE mobile_number='${mobileNumber}' AND user_type = 2;`)
    if (query.rowCount) {
        if (query.rowCount > 1) {
            return {
                isExist: true,
                data: query.rows[0]
            }
        }
        else {
            return {
                isExist: false,
                data: query.rows[0]
            };
        }
    }
    else {
        return {
            isExist: false,
            data: {}
        }
    }
}

const getByIds = async (req) => {
    if (req.body.idArray) {
        let query = `SELECT * FROM subscriber WHERE subscriber_id IN(${req.body.idArray})`;
        query = await db.query(query);
        if (query.rowCount) {
            return {
                count: query.rowCount,
                data: query.rows
            }
        }
        else {
            return {}
        }
    }
    else {
        return {}
    }
}

const mobileCheck = async (mobileNumber) => {
    let result = {};
    try {
        let mobileno = `SELECT mobile_number,status FROM ${process.env.SCHEMA}.subscriber WHERE mobile_number=${mobileNumber};`
        let mobile = await db.query(mobileno);
        result.success = true;
        if (mobile.rows.length) {
            result.mobileCheck = true;
            result.user = mobile.rows[0]
        }
    } catch (err) {
        result.success = false;
    } finally {
        return result;
    }
}

module.exports = {
    mobileCheck, getByIds, getUserbyName, checkCompanyMobileDuplicate, init, register, userNameOrEmailExist,
    subscriberid, vaidatenewUser, sendOtp, updateUserStatus, getUserbyID, getUserbySubID, approvalRequest, isValidApproval,
    updateRelationship, parentMobileUser, requestParentUser, isParentByID, list, listMaster, profile, editSubscriber
}