const db = require('../../db');
const { Result } = require('express-validator');

const feed = async (req, res) => {
    try {
        let feedStr = "";
        if (typeof (req.body.isRemove) != "undefined" && req.body.isRemove) {
            feedStr = "UPDATE " + process.env.SCHEMA + ".feeds SET status=0,updated_at=NOW(),updated_by=" + req.myID + " WHERE id=" + req.body.feedID + " ";
        } else {
            let id = ""; let idval = "";
            if (typeof (req.body.feedID) != "undefined" && req.body.feedID != "") {
                id = "id,"; idval = req.body.feedID + ",";
            }
            let imageAnd = ""; let image = ""; let imageVal = "";
            if (typeof (req.body.imageName) != "undefined" && req.body.imageName != "") {
                image = "images,"; imageVal = "$$" + req.body.imageName + "$$,";
                imageAnd = ",images=$$" + req.body.imageName + "$$";
            }
            feedStr = "INSERT INTO " + process.env.SCHEMA + ".feeds (" + id + "title,description,status," + image + " created_by) VALUES (" + idval + "$$" + req.body.title + "$$,$$" + req.body.description + "$$,1," + imageVal + "" + req.myID + ") ON CONFLICT (id) DO UPDATE SET updated_at=NOW(),updated_by=" + req.myID + ",title=$$" + req.body.title + "$$,description=$$" + req.body.description + "$$,status=1" + imageAnd;
        }
        await db.query(feedStr);
        return true;
    } catch (err) {
        return false;
    }
}

const list = async (req, res) => {
    const result = {};
    try {
        let and = "";
        if (typeof (req.body.search) != "undefined" && req.body.search != "") {
            and = " AND (  LOWER(f.title) LIKE $$%" + req.body.search.toLowerCase() + "%$$  ) ";
        }
        if (typeof (req.body.feedID) != "undefined" && req.body.feedID != "") {
            and = " AND f.id=" + req.body.feedID + "";
        }
        let listStr = "SELECT f.id AS feed_id, f.title,f.description,f.images,s_p.profile_image,s.id AS subscriber_id,s.full_name, to_char(f.created_at , 'MON DD,YYYY') created_date,to_char(f.created_at , 'HH12:MI:SS AM') created_time, CASE WHEN f.created_by = " + req.myID + " THEN 1 ELSE 0 END AS my_feed FROM " + process.env.SCHEMA + ".feeds AS f LEFT JOIN " + process.env.SCHEMA + ".subscriber_profile AS s_p  ON f.created_by=s_p.subscriber_id INNER JOIN " + process.env.SCHEMA + ".subscriber AS s ON f.created_by = s.id WHERE 1=1 AND f.status=1 " + and + " ORDER BY f.id DESC";
        const list = await db.query(listStr);
        if (typeof (req.body.feedID) != "undefined" && req.body.feedID != "") {
            if (list.rowCount > 0) {
                result.list = list.rows[0];
            } else {
                result.list = {};
            }
        } else {
            result.list = list.rows;
        }

        let feedmasterStr = "SELECT id AS category_id,category FROM " + process.env.SCHEMA + ".feed_category WHERE STATUS=1";
        const feedmaster = await db.query(feedmasterStr);
        result.feedmaster = feedmaster.rows;
    } catch (err) {
        result.list = [];
        result.feedmaster = [];
    }

    return result;
}

module.exports = { feed, list }