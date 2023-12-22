const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');
var model = require('../../../model/website/model.js');


const Insert = async (req, res) => {
    try {
		
		var insertQry = "INSERT INTO " + process.env.SCHEMA + ".team_info(team_name, registered_by, registered_by_name, registered_by_no, registered_by_email, status, add_by, add_dt) VALUES ('"+ req.body.teamName +"', '"+ req.body.registertype +"', "+ req.body.name +", "+ req.body.contactNumber +", "+ req.body.email +", 1, 1, now())";  
		
		var playerListObject = JSON.parse(req.body.playerlist);
		
		for(var i = 0; i < playerListObject.length; i++){
			var element = playerListObject[i];
			
			var playerInsert = "INSERT INTO " + process.env.SCHEMA + ".team_player (player_name, gender, birth_date, birth_certificate, status, add_by, add_dt) VALUES ('"+ element. +"')" 
		}
		
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