const sql = require('./../../../../src/config/conn');
const Logger = require('../../../../src/helper/loggerService');
const logger = new Logger('country');
var model  = require('./../../../../src/models/v1/model');
var validator  = require('./../../../../src/helper/validate');
const { check, validationResult } = require('express-validator');
const ACTIVE_STATUS=process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS=process.env.IN_ACTIVE_STATUS;

const moment = require('moment');

module.exports = {
	List: async(req, res) => {
		try{
			let query ="SELECT country_id,country_name FROM country WHERE status=?";
			let data =[ACTIVE_STATUS];
			let result = await model.QueryListData(query,data,res);
			if (result){
			res.send({
				api_version: 'v1',
				success: true,
				message: 'Successfull',
				data: result
			});
		}else
		res.send({
			api_version: 'v1',
			success: false,
			message: 'Failed',
			data: []
		});
		
		
	}catch(error){
		res.send({
			api_version: 'v1',
			success: false,
			message: 'Something Went Wrong...',
			data: error
		});
	}
	
},


Add : async(req,res) =>{
	const validationRule = {
		'country_name': 'required'
	}
	validator(req.body, validationRule, {}, async(err, status) => {
		console.log(status);
		if (!status) {
			res.send({
				api_version: 'v1',
				success: false,
				message: 'Validation failed',
				data: err
			});
		}
		else 
		{
			try{
				let now = moment();
				let todays_dt= now.format("YYYY-MM-DD HH:mm:ss");
				let check  = await model.CheckUnique(`country_name`,`country`,req.body.country_name.trim(),res);
				if(check)
				{
					let query ="INSERT INTO `country`(`country_name`,`status`,`add_by`,`add_dt`,`mdf_by`,`mdf_dt`) VALUES (?,?,?,?,?,?)";
					let data=[req.body.country_name.trim(),ACTIVE_STATUS,req.logged_in_id,todays_dt,req.logged_in_id,todays_dt];
					let result = await model.QueryPostData(query,data,res);
					if (result)
						res.send({
							api_version: 'v1',
							success: true,
							message: 'Country added successfully..!',
							data: []
						});
					else
						res.send({
							api_version: 'v1',
							success: false,
							message: 'Country added unsuccessfull..!',
							data: []
						});
				}else
				{
					res.send({
						api_version: 'v1',
						success: false,
						message: 'Country must be unique..!',
						data: []
					});
				}
			}catch(error){
				res.send({
					api_version: 'v1',
					success: false,
					message: 'Something Went Wrong...',
					data: error
				});
			}

		}
	});
	
},


Edit : async(req,res)=>{
	const validationRule = {
		'country_id': 'required'
	}
	validator(req.body, validationRule, {}, async(err, status) => {
		console.log(status);
		if (!status) {
			res.send({
				api_version: 'v1',
				success: false,
				message: 'Validation failed',
				data: err
			});
		}
		else 
		{
			try{
				let query ="SELECT country_id,country_name FROM country WHERE country_id = ? AND status=?";
				let data=[req.body.country_id,ACTIVE_STATUS];
				let result = await model.QueryListData(query,data,res);
				if (result)
					res.send({
						api_version: 'v1',
						success: true,
						message: '',
						data: result
					});
				else
					res.send({
						api_version: 'v1',
						success: false,
						message: '',
						data: []
					});
			}catch(error){
				res.send({
					api_version: 'v1',
					success: false,
					message: 'Something Went Wrong...',
					data: error
				});
			}
		}
	});
},


Update : async(req,res)=>{
	const validationRule = {
		'country_id': 'required',
		'country_name':'required'
	}
	validator(req.body, validationRule, {}, async(err, status) => {
		console.log(status);
		if (!status) {
			res.send({
				api_version: 'v1',
				success: false,
				message: 'Validation failed',
				data: err
			});
		}
		else 
		{
			try{
				let now = moment();
				let todays_dt= now.format("YYYY-MM-DD HH:mm:ss");
				let check  = await model.CheckUnique(`country_name`,`country`,req.body.country_name.trim(),res,`country_id`,req.body.country_id);
				if(check)
				{
					let query ="UPDATE `country` SET `country_name`=?,`mdf_by`=?,`mdf_dt`=? WHERE country_id=? AND status=?";
					let data=[req.body.country_name.trim(),req.logged_in_id,todays_dt,req.body.country_id,ACTIVE_STATUS];
					let result = await model.QueryPostData(query,data,res);
					if (result)
					{	
						res.send({
							api_version: 'v1',
							success: true,
							message: 'Country updated successfully..!',
							data: []
						});
					}else{
						res.send({
							api_version: 'v1',
							success: false,
							message: 'Country updated unsuccessfull..!',
							data: []
						});
					}
				}
				else
				{
					res.send({
						api_version: 'v1',
						success: false,
						message: 'Country must be unique',
						data: []
					});
				}
			}catch(error){
				res.send({
					api_version: 'v1',
					success: false,
					message: 'Something Went Wrong...',
					data: error
				});
			}
		}
	});
	
},


Delete:async(req,res)=>{
	const validationRule = {
		'country_id': 'required'
	}
	validator(req.body, validationRule, {}, async(err, status) => {
		console.log(status);
		if (!status) {
			res.send({
				api_version: 'v1',
				success: false,
				message: 'Validation failed',
				data: err
			});
		}
		else 
		{
			try{
				let now = moment();
				let todays_dt= now.format("YYYY-MM-DD HH:mm:ss");
				/*let where_con='country_id=? and status=?';
				let where_data=[req.body.id,ACTIVE_STATUS]
				let check = await model.CheckForDelete('employee',where_con,where_data);
				if(check)
				{*/
					let query="UPDATE `country` SET `status` =?,`mdf_by`=?,`mdf_dt`=? WHERE `country_id` = ?";
					let data = [IN_ACTIVE_STATUS,req.logged_in_id,todays_dt,req.body.country_id];
					
					let result = await model.QueryPostData(query,data,res);
					if (result)
					{
						
						return res.send({
							api_version: 'v1',
							success: true,
							message: 'Country Deleted successfully..!',
							data: []
						});
					} else{
						return res.send({
							api_version: 'v1',
							success: false,
							message: 'Country Deleted unsuccessfull..!',
							data: []
						});
					}
					
				/*}
				else
				{
					res.send({
						success: true,
						message: 'Cant Delete..In Used!',
						data: []
					});
				}*/
			}catch(error){
				res.send({
					api_version: 'v1',
					success: false,
					message: 'Something Went Wrong...',
					data: error
				});
			}
		}
	});
}
}