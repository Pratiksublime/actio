const db = require('../../../db');
var model = require('../../../model/v1/website/model.js');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');


modeule.exports = {
	Add: async(req, res) =>{
		try{
			let now = new Date();
            let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
            
			var master_data = {};
			
            master_data.sub_sports_id = req.body.sub_sports_id;
			master_data.sports_id = req.body.sports_id;
			master_data.sub_sports_name = req.body.sub_sports_name;
			master_data.status = 1;
			master_data.add_by = req.logged_in_id;
			master_data.add_dt = todays_dt;
			
            let query = "INSERT INTO `sub_sports` SET ?";
            let data = [master_data];
            let result = await model.QueryPostData(query, data, res);

            if(result && typeof result !== "undefined" && result.affectedRows > 0){
                res.send({
                    success: true,
                    message: 'Data Added successfully..!',
                    data: []
                });
            }
            else{
                res.send({
                    success: false,
                    message: 'Data Not Added successfully..!',
                    data: []
                });
            }
		}
		catch{
			res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
            });
		}
	},

    List: async(req, res) => {
        try {
            let query = "SELECT `sub_sports_id`, `sports_id`, `sub_sports_name` FROM `sub_sports` WHERE status = ?";
            let data = [1];
            let result = await model.QueryListData(query, data, res);
            if(result){
                res.send({
                    success: true,
                    message: 'Successfull',
                    data: result
                });
            }
            else{
                res.send({
                    success: false,
                    message: 'Unsuccessful',
                    data: []
                })
            }
        } catch (error) {
            res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
            });
        }
    },

    Update: async(req, res) => {
        try{
			let now = new Date();
            let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");
            
			var master_data = {};
			
            master_data.sub_sports_id = req.body.sub_sports_id;
			master_data.sports_id = req.body.sports_id;
			master_data.sub_sports_name = req.body.sub_sports_name;
			master_data.status = 1;
			master_data.mdf_by = req.logged_in_id;
			master_data.mdf_dt = todays_dt;
			
            let query = "UPDATE `sub_sports` SET ? WHERE `sub_sports_id` = ?";
            let data = [master_data, req.body,sub_sports_id];
            let result = await model.QueryPostData(query, data, res);

            if(result && typeof result !== "undefined" && result.affectedRows > 0){
                res.send({
                    success: true,
                    message: 'Data Added successfully..!',
                    data: []
                });
            }
            else{
                res.send({
                    success: false,
                    message: 'Data Not Added successfully..!',
                    data: []
                });
            }
		}
		catch{
			res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
            });
		}
    },

    Edit: async(req, res) => {
        try {
            let query = "SELECT * FROM `sub_sports` WHERE status = ? AND sub_sports_id = ?";
            let data = [1, req.body.sub_sports_id];
            let result = await model.QueryListData(query, data, res);
            if(result){
                res.send({
                    success: true,
                    message: 'Successfull',
                    data: result
                });
            }
            else{
                res.send({
                    success: false,
                    message: 'Unsuccessful',
                    data: []
                })
            }
        } catch (error) {
            res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
            });
        }
    }, 

    Delete: async(req, res) => {
        try {
            let now = new Date();
            let todays_dt = now.format("YYYY-MM-DD HH:mm:ss");

            let query = "UPDATE `sub_sports` SET `status` = ?, `mdf_by` = ?, `mdf_dt` = ? WHERE sub_sports_id = ?";
            let data = [2, req.logged_in_id, todays_dt, req.body.sub_sports_id];
            let result = await model.QueryPostData(query, data, res);

            if(result && result.affectedRows > 0){
                res.send({
                    success: true,
                    message: 'Data deleted successfull',
                    data: result
                });
            }
            else{
                res.send({
                    success: false,
                    message: 'Data deleted unsuccessfull',
                    data: []
                });
            }
        } catch (error) {
            res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
            });
        }
    }
}