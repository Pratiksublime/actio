 const db = require('../../../db');
const helper = require('../../../helper/helper');
const UploadFileLink = process.env.HOST + process.env.PORT + '';
const UploadFileLinkev = process.env.HOST + process.env.PORT + '/';
const moment = require('moment');




const actionlist = async (req, res) => {

try {
  let querystr = "select *, (CASE WHEN img IS NOT NULL THEN Concat('"+UploadFileLink+"',img) WHEN img = '' THEN '' ELSE '' END) as img from match_action where status = 1 ";
  let result = await db.query(querystr);
  result = result.rows;

  let actiondata = "select action_id from player_score where player_id = " + req.query.player_id + "";
  console.log('info.length.........');
  console.log(actiondata);

  let info = await db.query(actiondata);
  info = info.rows;

  console.log('info.length');
  console.log(info.length);

  // Loop through the result array and add the sumdata property
  for (let i = 0; i < result.length; i++) {
    let found = false; // To track if the action_id is found in the info array
    for (let j = 0; j < info.length; j++) {
      if (result[i].id === info[j].action_id) {
        let scorecount = "select sum(score) from player_score where player_id = " + req.query.player_id + " and action_id = " + info[j].action_id + "";
        console.log(scorecount);
        let data = await db.query(scorecount);

        let sumData = data.rows.length > 0 ? data.rows[0].sum : 0; // Access the sum value from data.rows array (if it exists)

        // Add the sumdata property to the current object in the result array
        result[i].sumdata = sumData;
        found = true;
        break; // Exit the inner loop once a match is found
      }
    }

    if (!found) {
      // If action_id is not found in info, set sumdata to 0
      result[i].sumdata = 0;
    }
  }

  return result;

} catch (err) {
  console.log(err);
  return false;
}




}









const kpilist = async (req, res) => {

	try {

		var result = {};

		let querystr = "select ksm.*,kc.category_name from kpi_sport_mapping as ksm left join kpi_category as kc on kc .id = ksm.kpi_category_id  WHERE  sports_id = " + req.query.id + "";

		console.log(querystr);

		result = await db.query(querystr);

		result = result.rows
		return result;

	} catch (err) {
		console.log(err);
		return false;
	}
}










module.exports = {
	actionlist,
	kpilist

} 