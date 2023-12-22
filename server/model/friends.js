const db = require('../db');

const find = async (req, res) => {
    const result = {};
    try {
        let findStr = "SELECT subscriber_id,subscriber_display_id,full_name,username,email_id,profile_image,case when status> 0 then status else 0 end AS friends_Status FROM (SELECT s.id AS subscriber_id , s.subscriber_id AS subscriber_display_id,s.full_name,s.username,s.email_id,s_p.profile_image , (SELECT CASE WHEN to_id=" + req.myID + " AND status=" + process.env.FRND_REQUEST + " THEN " + process.env.FRND_RECEIVE + "  ELSE  status END AS   status FROM " + process.env.SCHEMA + ".subscriber_friends WHERE CASE WHEN from_id=" + req.myID + " THEN to_id=s.id WHEN from_id=s.id THEN to_id=" + req.myID + " END AND status IN (" + process.env.FRND_REQUEST + "," + process.env.FRND_ACCEPT + ") ORDER BY status LIMIT 1) FROM  " + process.env.SCHEMA + ".subscriber AS s LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p ON  s.id=s_p.subscriber_id  WHERE 1=1 AND s.status=" + process.env.ACTIVE + " AND ( LOWER(s.full_name) LIKE '%" + req.body.search + "%' OR LOWER(s.username) LIKE '%" + req.body.search + "%' OR CAST(s.subscriber_id AS TEXT) LIKE '" + req.body.search + "%' )  AND s.id NOT IN (" + req.myID + ") ORDER BY s.full_name) subscriber ";
        const find = await db.query(findStr);
        result.find = find.rows;
    } catch (err) {
        result.find = [];
    }
    return result.find;
}

const action = async (req, res) => {
    try {
        let actionStr = "";
        switch (req.body.actionID) {
            case "1":
            case 1:
                // new request
                actionStr = "INSERT INTO " + process.env.SCHEMA + ".subscriber_friends (from_id,to_id,status,created_by) VALUES (" + req.myID + "," + req.body.friendID + "," + process.env.FRND_REQUEST + "," + req.myID + ") ON CONFLICT (from_id,to_id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",status=" + process.env.FRND_REQUEST + "";
                await db.query(actionStr);

                break;
            case "2":
            case 2:
                // accept
                actionStr = "UPDATE " + process.env.SCHEMA + ".subscriber_friends SET status=" + process.env.FRND_ACCEPT + ",updated_at=NOW(),updated_by=" + req.myID + " WHERE from_id=" + req.body.friendID + " AND to_id=" + req.myID + " AND status=" + process.env.FRND_REQUEST + "";
                await db.query(actionStr);
                break;
            case "4":
            case 4:
                // reject
                actionStr = "UPDATE " + process.env.SCHEMA + ".subscriber_friends SET status=" + process.env.FRND_REJECT + ",updated_at=NOW(),updated_by=" + req.myID + " WHERE status=" + process.env.FRND_REQUEST + " AND CASE WHEN from_id=" + req.myID + " THEN to_id=" + req.body.friendID + " WHEN from_id=" + req.body.friendID + " THEN to_id=" + req.myID + " END  ";
                await db.query(actionStr);
                break;
            case "5":
            case 5:
                // unfriend
                actionStr = "UPDATE " + process.env.SCHEMA + ".subscriber_friends SET status=" + process.env.FRND_UNFRND + ",updated_at=NOW(),updated_by=" + req.myID + " WHERE status=" + process.env.FRND_ACCEPT + " AND CASE WHEN from_id=" + req.myID + " THEN to_id=" + req.body.friendID + " WHEN from_id=" + req.body.friendID + " THEN to_id=" + req.myID + " END  ";
                await db.query(actionStr);
                break;
            default:
                break;
        }
        return true;
    } catch (err) {
        return false;
    }
}

const list = async (id, req, res) => {
    const result = {};
    try {
        let profileStr = `SELECT subscriber_id,subscriber_display_id,full_name,username,email_id,mobile_number,isd_code,
        CASE WHEN user_type IS NULL  THEN
        ''
        ELSE 
        user_type::varchar
        END as user_type,
        
        CASE WHEN id_type IS NULL  THEN
        ''
        ELSE 
        id_type::varchar
        END as id_type,

        CASE WHEN id_type IS NULL  THEN
        ''
        ELSE 
        proof_number_sole || proof_number_pair::varchar
        END as proof_id,

        CASE WHEN front_image IS NULL  THEN
        ''
        ELSE 
        front_image
        END as front_image,

        CASE WHEN back_image IS NULL  THEN
        ''
        ELSE 
        back_image
        END as back_image,
        
        CASE WHEN gender=0  THEN ''
        WHEN gender=1 THEN 'Male'
        WHEN gender=2 THEN 'Female'
        END as gender,

        to_char(date_of_birth,'DD-MM-YYYY') as dob,profile_image,
        case when status> 0 then status else 0 end AS friends_Status FROM (SELECT s.id AS subscriber_id , s.subscriber_id AS subscriber_display_id,s.isd_code,s.full_name,s.username,s.email_id,s.mobile_number,s.gender,s.user_type,s.proof_type as id_type,s.proof_number_sole,s.proof_number_pair,s.proof_copy_sole AS front_image,s.proof_copy_pair AS back_image,s.date_of_birth,s_p.profile_image , (SELECT CASE WHEN to_id=`+ req.myID + " AND status=" + process.env.FRND_REQUEST + " THEN " + process.env.FRND_RECEIVE + "  ELSE status END AS   status FROM " + process.env.SCHEMA + ".subscriber_friends WHERE CASE WHEN from_id=" + req.myID + " THEN to_id=s.id WHEN from_id=s.id THEN to_id=" + req.myID + " END AND status IN (" + process.env.FRND_REQUEST + "," + process.env.FRND_ACCEPT + ") ORDER BY status LIMIT 1) FROM  " + process.env.SCHEMA + ".subscriber AS s LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p ON  s.id=s_p.subscriber_id  WHERE 1=1   AND s.id=" + id + "  ORDER BY s.full_name) subscriber";
        const profile = await db.query(profileStr);
        if (profile.rowCount > 0) {
            result.profile = profile.rows[0];
        } else {
            result.profile = {};
        }

        let listStr = "SELECT  s.id AS subscriber_id , s.subscriber_id AS subscriber_display_id,s.full_name,s.username,s.email_id,s_p.profile_image FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p ON  s.id=s_p.subscriber_id WHERE 1=1 AND s.id NOT IN (" + req.myID + ") AND s.id IN ( SELECT CASE WHEN from_id=" + id + " THEN to_id ELSE from_id END friends_id FROM " + process.env.SCHEMA + ".subscriber_friends AS s_f  WHERE (s_f.from_id=" + id + " OR s_f.to_id=" + id + ") AND status=" + process.env.FRND_ACCEPT + " )";
        const list = await db.query(listStr);
        result.list = list.rows;
    } catch (err) {
        result.profile = {};
        result.list = [];
    }

    return result;
}

module.exports = { find, action, list }