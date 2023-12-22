const { Query } = require('pg');
const db = require('../../../../db');
const helper = require('../../../../helper/helper');
var model = require('../../../../model/website/model.js');


const Insert = async (req, res) => {
    try {
		
		var insertQry = "INSERT INTO " + process.env.SCHEMA + ".subscriber_other(other_name, other_no, other_email, subscriber_id, team_id, event_id, status, add_by, add_dt) VALUES ('"+ req.body.other_name +"', '"+ req.body.other_no +"', '"+ req.body.other_email +"', "+ req.body.subscriber_id +", "+ req.body.team_id +", "+ req.body.event_id +", 1, 1, now())";  
						
		await db.query(insertQry);

        return true;
    } catch (err) {
        console.log("err:");
        console.log(err);

        return false;
    }
}

const List = async(req, res) => {
	try{
		var result = {};
		
		var listQry = "SELECT id, other_name, other_no, other_email, subscriber_id, team_id, event_id FROM "+ process.env.SCHEMA + ".subscriber_other WHERE status = 1";
		
		result = await db.query(listQry);
		
		return result.rows;
	}
	catch(err){
		console.log("err:");
        console.log(err);

        return false;
	}
}

const Info = async(req, res) => {
	try{
		var result = {};
		
		var infoQry = "SELECT * FROM "+ process.env.SCHEMA + ".subscriber_other WHERE status = 1 AND id = "+ req.body.id +"";
		
		result = await db.query(infoQry);
		
		return result.rows;
	}
	catch(err){
		console.log("err:");
        console.log(err);

        return false;
	}
}

const Update = async(req, res) => {
	try{
		var updateQry = "UPDATE "+ process.env.SCHEMA + ".subscriber_other SET other_name = '" + req.body.other_name + "', other_no = '" + req.body.other_no + "', other_email = '" + req.body.other_email + "', subscriber_id = " + req.body.subscriber_id + ", team_id = " + req.body.team_id + ", event_id = " + req.body.event_id + ",status = 1, mdf_by = 1, mdf_dt = now() WHERE id = " + req.body.id + "";

		await db.query(updateQry);
		
		return true;
	}
	catch(err){
		console.log("err:");
        console.log(err);

        return false;
	}
}

const Delete = async(req, res) => {
	try{
		var deleteQry = "UPDATE "+ process.env.SCHEMA + ".subscriber_other SET status = 2, mdf_by = 1, mdf_dt = now() WHERE id = "+ req.body.id +"";
		
		await db.query(deleteQry);
		
		return true;
	}
	catch(err){
		console.log("err:");
        console.log(err);

        return false;
	}
}



module.exports = {Insert, List, Info, Update, Delete}