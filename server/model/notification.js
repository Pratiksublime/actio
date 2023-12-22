const db = require('../db');
const { Result } = require('express-validator');

const getNotify = async (req, res) => {
    const result = {};
    try {
        let listStr = "SELECT s.full_name,n.id AS notification_id,n.message,n.seen_status,n.from_id,n.to_id,to_char(n.created_at,'YYYY-MM-DD HH24:MI:SS') AS date_time FROM " + process.env.SCHEMA + ".notification AS n INNER JOIN " + process.env.SCHEMA + ".subscriber AS s ON n.from_id=s.id  WHERE 1=1 AND n.to_id=" + req.myID + " ORDER BY n.id DESC LIMIT 100 ";
        const list = await db.query(listStr);
        result.list = list.rows;
    } catch (err) {
        result.list = [];
    }
    return result.list;
}

const create = async (val, req, res) => {
    try {
        let notifyStr = "INSERT INTO " + process.env.SCHEMA + ".notification (from_id,to_id,message,status,created_by,created_at) VALUES (" + val.from + "," + val.to + ",$$" + JSON.stringify(val.message) + "$$,0," + req.myID + ",NOW())";
        await db.query(notifyStr);
        console.log('Notification created');
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
}

const seen = async (req, res) => {
    try {
        let seenStr = "UPDATE " + process.env.SCHEMA + ".notification SET seen_status=1,updated_at=NOW(),updated_by=" + req.myID + " WHERE id=" + req.body.notifyID + " ";
        await db.query(seenStr);
        return true;
    } catch (err) {
        return false;
    }
}

const totalSeen = async (req, res) => {
    try {
        let seenStr = "UPDATE " + process.env.SCHEMA + ".notification SET seen_count_status=1,updated_at=NOW(),updated_by=" + req.myID + " WHERE to_id=" + req.myID + " ";
        await db.query(seenStr);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = { getNotify, create, seen, totalSeen }