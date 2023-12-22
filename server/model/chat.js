const db = require('../db');

const history = async (req, res) => {
    const result = {};
    try {
        let historyStr = "SELECT id,from_id,to_id,message,status,CASE WHEN from_id=" + req.myID + " then 1 else 2 end as position FROM " + process.env.SCHEMA + ".chat_messages AS c_m WHERE (c_m.from_id=" + req.myID + " AND c_m.to_id=" + req.body.friendID + ") OR (c_m.from_id=" + req.body.friendID + " AND c_m.to_id=" + req.myID + ")  ORDER BY id ";
        const history = await db.query(historyStr);
        result.history = history.rows;
    } catch (err) {
        result.history = [];
    }

    return result.history;
}

const friends = async (id, req, res) => {
    const result = {};
    try {
        let friendsStr = "SELECT  s.id AS subscriber_id , s.subscriber_id AS subscriber_display_id,s.full_name,s.username,s.email_id,s_p.profile_image FROM " + process.env.SCHEMA + ".subscriber s LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p ON  s.id=s_p.subscriber_id WHERE 1=1 AND s.id NOT IN (" + req.myID + ") AND s.id IN ( SELECT CASE WHEN from_id=" + id + " THEN to_id ELSE from_id END friends_id FROM " + process.env.SCHEMA + ".subscriber_friends AS s_f  WHERE (s_f.from_id=" + id + " OR s_f.to_id=" + id + ") AND status=" + process.env.FRND_ACCEPT + " )";
        const friends = await db.query(friendsStr);
        result.friends = friends.rows;
    } catch (err) {
        result.friends = [];
    }

    return result.friends;
}

const message = async (val, res) => {
    let message = Object.assign({}, val);
    delete message.fromID; delete message.toID; delete message.status; delete message.position;
    try {
        let messageStr = "INSERT INTO " + process.env.SCHEMA + ".chat_messages (from_id,to_id,message,status,created_by) VALUES (" + val.fromID + "," + val.toID + ",$$" + JSON.stringify(message) + "$$," + val.status + "," + val.fromID + ")";
        await db.query(messageStr);
        return true;
    } catch (err) {
        return false;
    }
}

const conversation = async (req, res) => {
    const result = {};
    try {
        let conversationStr = "SELECT  s.id AS subscriber_id , s.subscriber_id AS subscriber_display_id,s.full_name,s.username,s.email_id,s_p.profile_image ,chat.chat_id,c_m.message,COUNT(cm.id) AS unseen FROM  (SELECT MAX(id) chat_id, CASE WHEN from_id=" + req.myID + " THEN to_id ELSE from_id END friend_id FROM " + process.env.SCHEMA + ".chat_messages WHERE ( from_id = " + req.myID + " or to_id=" + req.myID + ")   GROUP BY CASE WHEN from_id=" + req.myID + " THEN to_id ELSE from_id END ) AS chat LEFT JOIN " + process.env.SCHEMA + ".chat_messages AS cm ON chat.friend_id=cm.from_id AND cm.to_id=" + req.myID + "  AND cm.status=1 INNER JOIN " + process.env.SCHEMA + ".chat_messages AS c_m ON chat.chat_id= c_m.id INNER JOIN " + process.env.SCHEMA + ".subscriber AS s ON chat.friend_id=s.id   LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p ON  s.id=s_p.subscriber_id  WHERE 1=1 AND s.id NOT IN (" + req.myID + ") AND s.id IN ( SELECT CASE WHEN from_id=" + req.myID + " THEN to_id ELSE from_id END friends_id FROM " + process.env.SCHEMA + ".subscriber_friends AS s_f  WHERE (s_f.from_id=" + req.myID + " OR s_f.to_id=" + req.myID + ") AND status=" + process.env.FRND_ACCEPT + " ) GROUP BY s.id , s.subscriber_id ,s.full_name,s.username,s.email_id,s_p.profile_image,chat.chat_id,c_m.message  ORDER BY chat.chat_id DESC";
        const conversation = await db.query(conversationStr);
        result.conversation = conversation.rows;
    } catch (err) {
        result.conversation = [];
    }

    return result.conversation;
}

const updatedSeen = async (req, res) => {
    try {
        let updatestr = "UPDATE " + process.env.SCHEMA + ".chat_messages SET status='2' WHERE from_id='" + req.toID + "' and to_id='" + req.fromID + "' and status=1";
        await db.query(updatestr);
        return true;
    } catch (err) {
        return false;
    }
}

const shareMessage = async (req, res) => {
    const result = {};
    try {
        let userStr = "SELECT s.id AS subscriber_id,s.full_name,ARRAY_TO_JSON(ARRAY(SELECT DISTINCT u_s.device_token FROM  " + process.env.SCHEMA + ".user_session u_s  WHERE u_s.subscriber_id=s.id AND u_s.status=1 AND u_s.mode=1 ))token FROM " + process.env.SCHEMA + ".subscriber AS s WHERE s.id IN (" + req.toString() + ")";
        const user = await db.query(userStr);
        result.user = user.rows;
    } catch (err) {
        result.user = [];
    }

    return result.user;
}

module.exports = { history, friends, message, conversation, updatedSeen, shareMessage }