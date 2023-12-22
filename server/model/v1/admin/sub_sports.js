const db = require('../../../db');


const list = async (req, res) => {
    let result = {};
    try {

        var where_str = " ";
        if(req.body.sports_id){
            where_str = " and a.sports_id="+req.body.sports_id
        }

        console.log("where_str: ++");
        console.log(where_str);

        let listStr = "SELECT a.*, b.sports_name FROM " + process.env.SCHEMA + ".sub_sports a left join " + process.env.SCHEMA + ".sports b on a.sports_id = b.id where a.status = 1 and a.sports_id = "+req.body.sports_id+" ORDER BY a.sub_sports_id DESC"; 

        console.log("listStr:");
        console.log(listStr);

        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        
        console.log("err: ");
        console.log(err);

        result = {};
    }
    return result;
}

const info = async (req, res) => {
    let result = {};
    try {
        console.log("req.query.sub_sports_id: ");
        console.log(req.query.sub_sports_id);

        //let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sub_sports where status = 1 and sub_sports_id = "+req.query.sub_sports_id+" ORDER BY sub_sports_name";
        let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sub_sports where status = 1 and sub_sports_id = "+req.body.sub_sports_id+" ORDER BY sub_sports_name";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err:");
        console.log(err);

        result = {};
    }
    return result;
}

const sub_sports_list = async (req, res) => {
    let result = {};
    try {
        //console.log("req.query.sub_sports_id: ");
       // console.log(req.query.sub_sports_id);

       
        let listStr = "SELECT * ,s.sports_name FROM sub_sports as sp left join sports as s on sp.sports_id = s.id where sp.status = 1 ORDER BY sp.sub_sports_id DESC";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err:");
        console.log(err);

        result = {};
    }
    return result;
}

const insert = async (req, res) => {
    try {


        if(req.body.sub_sports_name){
            let sub_sport = req.body.sub_sports_name
            let result = sub_sport.toLowerCase();

            let query = (`SELECT LOWER(sub_sports_name) FROM sub_sports WHERE status = 1 and sub_sports_name ILIKE '%${result}%'`);
            
            var querydata =  await db.query(query);
            
            
            if (querydata.rowCount) {
                return {

                    validationError: true,
                    error: 'Sub Sports already exists !'
                }
            }

        }
        let statusStr = "INSERT into " + process.env.SCHEMA + ".sub_sports (sports_id, sub_sports_name, created_at, status) values ("+req.body.sports_id+", '"+req.body.sub_sports_name+"', now(), 1) ";

        console.log("statusStr: ");
        console.log(statusStr);


        await db.query(statusStr);
        return true;
    } catch (err) {

        console.log("err:");
        console.log(err);
        return false;
    }
}

const update = async (req, res) => {
    try {

            if(req.body.sub_sports_name){
               let sub_sport = req.body.sub_sports_name
                    let result = sub_sport.toLowerCase();

                    let query = (`SELECT LOWER(sub_sports_name) FROM sub_sports WHERE status = 1 and sub_sports_name ILIKE '%${result}%'`);
                    var querydata =  await db.query(query);
                    if (querydata.rowCount) {
                        return {

                            validationError: true,
                            error: 'Sub Sports already exists !'
                        }
                    } 
            }
        let statusStr = "UPDATE " + process.env.SCHEMA + ".sub_sports SET sports_id='" + req.body.sports_id + "', sub_sports_name='" + req.body.sub_sports_name + "',updated_at=now() WHERE sub_sports_id=" + req.body.sub_sports_id + "";

        console.log("update statusStr:");
        console.log(statusStr);

        await db.query(statusStr);
        return true;
    } catch (err) {
        
        console.log("update err:");
        console.log(err);

        return false;
    }
}

const listBySportId = async (req, res) => {
    let result = {};
    try {
        console.log("req.query.sub_sports_id: ");
        console.log(req.query.sub_sports_id);

        //let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sub_sports where status = 1 and sports_id = "+req.query.sports_id+" ORDER BY sub_sports_name";
        let listStr = "SELECT * FROM " + process.env.SCHEMA + ".sub_sports where status = 1 and sports_id = "+req.body.sports_id+" ORDER BY sub_sports_name";
        let dataResult = await db.query(listStr);
        result = dataResult.rows;
    } catch (err) {
        console.log("err:");
        console.log(err);

        result = {};
    }
    return result;
}

const deletedata = async (req, res) => {
    try {
        console.log("123333");
        let statusStr = "UPDATE sub_sports SET status= 2 ,updated_at=now() WHERE sub_sports_id=" + req.body.id + "";

        console.log("statusStr....");
        console.log(statusStr);
        await db.query(statusStr);
        return true;
    } catch (err) {
        console.log(err)
        return false;  
    }
}

module.exports = { list, info, insert, update, listBySportId,sub_sports_list ,deletedata}