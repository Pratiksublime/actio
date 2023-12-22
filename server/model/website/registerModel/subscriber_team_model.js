const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');
var model = require('../../../model/website/model.js');


const Insert = async (req, res) => {
    try {
		
		var insertQry = "INSERT INTO " + process.env.SCHEMA + ".subscriber_team(team_name, registration_date, registered_by, status, add_by, add_dt) VALUES ('"+ req.body.team_name +"', '"+ req.body.registration_date +"', "+ req.body.registered_by +", 1, 1, now())";  
		
		console.log("insertQry:");
		console.log(insertQry);
		
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
		
		var listQry = "SELECT id, team_name, registration_date, registered_by FROM "+ process.env.SCHEMA + ".subscriber_team WHERE status = 1";
		
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
		
		var infoQry = "SELECT * FROM "+ process.env.SCHEMA + ".subscriber_team WHERE status = 1 AND id = "+ req.body.id +"";
		
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
		var updateQry = "UPDATE "+ process.env.SCHEMA + ".subscriber_team SET team_name = '" + req.body.team_name + "', registration_date = '" + req.body.registration_date + "', registered_by = " + req.body.registered_by + ",status = 1, mdf_by = 1, mdf_dt = now() WHERE id = " + req.body.id + "";

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
		var deleteQry = "UPDATE "+ process.env.SCHEMA + ".subscriber_team SET status = 2, mdf_by = 1, mdf_dt = now() WHERE id = "+ req.body.id +"";
		
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