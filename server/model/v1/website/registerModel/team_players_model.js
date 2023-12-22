var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const { Query } = require('pg');
const db = require('../../../../db');

var model = require('../../../../model/website/model.js');
var comman_helper  = require('../../../../helper/comman_helper');
const helper = require('../../../../helper/helper');

const BirthCertificateLink =process.env.HOST+process.env.PORT+'/';

const Insert = async (req, res) => {
    try {
		var player_name = req.body.player_name;
		
		if(!Array.isArray(player_name)){
			player_name = comman_helper.strtoarry(player_name);
		}		
	
		var gender = req.body.gender;
		
		if(!Array.isArray(gender)){
			gender = comman_helper.strtoarry(gender);
		}
		
		var birth_date = req.body.birth_date;
		
		if(!Array.isArray(birth_date)){
			birth_date = comman_helper.strtoarry(birth_date);
		}
		
		var age = req.body.age;
		
		if(!Array.isArray(age)){
			age = comman_helper.strtoarry(age);
		}
		
		var birth_certificate = req.body.birth_certificate;
		
		if(!Array.isArray(birth_certificate)){
			birth_certificate = comman_helper.strtoarry(birth_certificate);
		}
		
		console.log("player_name: ");
		console.log(player_name);
		
		console.log("gender: ");
		console.log(gender);
		
		console.log("birth_date: ");
		console.log(birth_date);
		
		console.log("age: ");
		console.log(age);
		
		console.log("birth_certificate: ");
		console.log(birth_certificate);
		
		var insert_str = "";
		if(player_name && typeof player_name !=="undefined" && player_name.length>0){
					
			for(var i=0; i < player_name.length; i++){
				
				var birth_cert_new = "";
				var playerPath = 'images/website/team_player/'
				if(birth_certificate[i] && typeof birth_certificate[i] !== "undefined" && birth_certificate[i] !==""){
					var birth_certificate_path = helper.uploadBase64(birth_certificate[i], playerPath, res);	
					birth_cert_new = birth_certificate_path.path;
				}
				
				insert_str += " INSERT INTO " + process.env.SCHEMA + ".team_player(subscriber_id, event_id, player_name, gender, birth_date, age, birth_certificate, status, add_by, add_dt) VALUES ("+ req.body.subscriber_id +", "+ req.body.event_id +", '"+ player_name[i] +"', '"+ gender[i] +"', '"+ birth_date[i] +"', '"+ age[i] +"', '"+ birth_cert_new +"', 1, 1, now()); ";
			}
		}
		
		console.log("insert_str: ");
		console.log(insert_str);
		
		
		if(insert_str && typeof insert_str !=="undefined" && insert_str !==""){
			var query = await db.query(insert_str);
			return true;
		}else{
			return false;
		}
		
    } catch (err) {
        console.log("err: +++");
        console.log(err);

        return false;
    }
}

const List = async(req, res) => {
	try{
		var result = {};
		
		var listQry = "SELECT id, subscriber_id, event_id, player_name, gender, birth_date, age, CASE WHEN birth_certificate != '' THEN CONCAT ('"+ BirthCertificateLink +"', birth_certificate) END AS birth_certificate FROM "+ process.env.SCHEMA + ".team_player WHERE status = 1";
		
		console.log(listQry);
		
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
		
		var infoQry = "SELECT *, CASE WHEN birth_certificate != '' THEN CONCAT ('"+ BirthCertificateLink +"', birth_certificate) END AS birth_certificate FROM "+ process.env.SCHEMA + ".team_player WHERE status = 1 AND id = "+ req.body.id +"";
		
		console.log(infoQry);
		
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
		var playerPath = 'images/website/team_player/'
		var birth_cert = req.body.birth_certificate;
		var birth_cert_new = "";
		if(birth_cert && typeof birth_cert !== "undefined" && birth_cert.length > 0){
			var birth_cert = helper.uploadBase64(birth_cert, playerPath);	
			birth_cert_new = birth_cert.path;
		}
		console.log("path:");
		console.log(birth_cert_new);

		var updateQry = "UPDATE "+ process.env.SCHEMA + ".team_player SET subscriber_id = " + req.body.subscriber_id + ", event_id = " + req.body.event_id + ", player_name = '" + req.body.player_name + "', gender = '" + req.body.gender + "', birth_date = '" + req.body.birth_date + "', age = '" + req.body.age + "', birth_certificate = '" + birth_cert_new + "',status = 1, mdf_by = 1, mdf_dt = now() WHERE id = " + req.body.id + "";

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
		var deleteQry = "UPDATE "+ process.env.SCHEMA + ".team_player SET status = 2, mdf_by = 1, mdf_dt = now() WHERE id = "+ req.body.id +"";
		
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