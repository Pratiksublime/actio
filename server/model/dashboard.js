const db = require('../db');

const count = async (req, res) => {
    const result = {};
    try {
        let notifiStr = "SELECT COUNT(id) notifi FROM notification WHERE to_id=" + req.myID + " and seen_count_status=0";
        const notifi = await db.query(notifiStr);
        result.notifi = notifi.rows[0].notifi;
        let chatStr = "SELECT COUNT(id) chat FROM chat_messages WHERE to_id=" + req.myID + " AND status = 1";
        const chat = await db.query(chatStr);
        result.chat = chat.rows[0].chat;
        result.modules = await listModule();
    } catch (err) {
        console.log(err)
        result.notifi = 0;
        result.chat = 0;
        result.modules = []
    }
    return result;
}

const listModule = async () => {
    try {
        const query = await db.query(`SELECT id,name,image,icon FROM ${process.env.SCHEMA}.modules WHERE status=1 ORDER BY id ;`);
        return query.rows;
    }
    catch (err) {
        return [];
    }
}

module.exports = { count, listModule };