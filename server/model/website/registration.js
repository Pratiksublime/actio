const db = require('../../db');
const helper = require('../../helper/helper');


const insert = async (req, res) => {
	const result = {};
	try {


		if (typeof(req.body.turnament_id) !== "undefined" && req.body.turnament_id !== '') {
			turnament_id = null;
		}
		if (typeof(req.body.total_amount) !== "undefined" && req.body.total_amount !== '') {
			total_amount = null;
		}
		if (typeof(req.body.isd_code) !== "undefined" && req.body.isd_code !== '') {
			isd_code = null;
		}
		if (typeof(req.body.registerd_by) !== "undefined" && req.body.registerd_by !== '') {
			registerd_by = null;
		}
		if (typeof(req.body.register_mobile) !== "undefined" && req.body.register_mobile !== '') {
			register_mobile = null;
		}


		const moment = require('moment');

		const addsStr = `INSERT INTO registration (register_type,tournament_id,team_name,registerd_by,register_name,register_mobile,register_email,total_amount,isd_code,status,created_at) VALUES('${req.body.register_type}',${req.body.tournament_id},'${req.body.team_name}','${req.body.registerd_by}','${req.body.register_name}',${req.body.register_mobile},'${req.body.register_email}',${req.body.total_amount},'${req.body.isd_code}',1,now())RETURNING id`;
		console.log('addsStrooooooooooooooooooooooooooooo');
		console.log(addsStr);   

		const adddata = await db.query(addsStr);

		if (adddata.rowCount) {

			const register_id = adddata.rows[0].id;
			if (req.body.player_name && typeof req.body.player_name != 'undefined' && req.body.player_name.length > 0) {

				if (Array.isArray(req.body.player_name)) {
					var playerdata = req.body.player_name;


  
					for (var i = 0; i < playerdata.length; i++) {
						console.log('demo');

						var certificate = req.files.certificate;
						console.log('certificate file+++++++');
						//console.log(certificate);
						console.log(typeof certificate);

						var certificate_new = "";



						if (certificate && typeof certificate !== "undefined" && certificate.length > 0) {
							var element = certificate[i];
							console.log('element +++++++++');
							console.log(element);
							//var image_name= now.format("YYYYMMDDHHmmss")+element.name;
							var image_name = moment().format('MMDDYYYYHHmmss') + element.name;

							element.mv('./images/website/' + image_name);
							certificate_new = image_name;



						}
						var query = `INSERT INTO registration_player(register_id,player_name,gender,dob,age,certificate,created_at,status)VALUES(${
                            register_id},'${req.body.player_name[i]}',${req.body.gender[i]},'${req.body.dob[i]}',${req.body.age[i]},'${certificate_new}',now(),1)`;
						console.log('query');
						console.log(query);
						await db.query(query);

					}
				} else {
					var query = `INSERT INTO registration_player(register_id,player_name,gender,dob,age,certificate,created_at,status)VALUES(${
                            register_id},'${req.body.player_name[i]}',${req.body.gender[i]},'${req.body.dob[i]}',${req.body.age[i]},'${certificate_new}',now(),1)`;
                            console.log('query+++++++++++++++++++++++++++++++++++');
						console.log(query);
					await db.query(query);
				}
			}

			if (req.body.event_id && typeof req.body.event_id != 'undefined' && req.body.event_id.length > 0) {

				if (Array.isArray(req.body.event_id)) {
					var eventdata = req.body.event_id;

					for (var i = 0; i < eventdata.length; i++) {
						var query = `INSERT INTO registration_event(register_id,event_id,created_at,status)VALUES(${
                            register_id},${req.body.event_id[i]},now(),1)`;
                            console.log('query===================================');
						console.log(query);
						await db.query(query);

					}
				} else {
					var query = `INSERT INTO registration_event(register_id,event_id,created_at,status)VALUES(${
                            register_id},${req.body.event_id[i]},now(),1)`;
                            console.log('query)))))))))))))))))))))))))))))))))');
						console.log(query);
					await db.query(query);
				}
			}
		}

	} catch (err) {
		console.log('err////');
		console.log(err);
		result.id = false;
	}
	//return result;
	return result.message = true;
}


module.exports = {
	insert
}