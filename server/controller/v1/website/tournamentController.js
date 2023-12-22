const db = require('../../../db');
var model = require('../../../model/v1/website/model.js');
const ACTIVE_STATUS = process.env.ACTIVE_STATUS;
const IN_ACTIVE_STATUS = process.env.IN_ACTIVE_STATUS;

const moment = require('moment');

const UpcomingList = async (req, res) => {
    try {
        console.log("upcominglist");
        let query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM ${process.env.SCHEMA}.tournament AS t  LEFT JOIN ${process.env.SCHEMA}.venue AS v ON v.id = t.tournament_venue LEFT JOIN ${process.env.SCHEMA}.city AS ct ON ct.id = t.tournament_city LEFT JOIN ${process.env.SCHEMA}.country AS c ON c.id = t.tournament_country LEFT JOIN ${process.env.SCHEMA}.sports AS s ON s.id = t.sports WHERE limit = ?";
        let data = [req.query.page_record];
        let result = await model.QueryListData(query, data, res);
        if (result) {
            for(i=0; i<result.length; i++){

                let querySub = "SELECT attachment FROM ${process.env.SCHEMA}.tournament_attachment where tournament_id = ? AND status = ? ";
                let dataSub = [result[i].tournament_id, ACTIVE_STATUS];
                let resultSub = await model.QueryListData(querySub, dataSub, res);
                result[i].pics = resultSub;
            }
                    
                res.send({
                    success: true,
                    message: 'Successfull',
                    data: result
                });
            } else
                res.send({
                    success: false,
                    message: 'Failed',
                    data: []
            });
        } catch (error) {
            res.send({
                success: false,
                message: 'Something Went Wrong...',
                data: error.message
        });
    }
}


const PastList = async (req, res) => {
    try {
        console.log("pastlist");
        let query = "SELECT t.tournament_name, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM ${process.env.SCHEMA}.tournament AS t  LEFT JOIN ${process.env.SCHEMA}.venue AS v ON v.id = t.tournament_venue LEFT JOIN ${process.env.SCHEMA}.city AS ct ON ct.id = t.tournament_city LEFT JOIN ${process.env.SCHEMA}.country AS c ON c.id = t.tournament_country LEFT JOIN ${process.env.SCHEMA}.sports AS s ON s.id = t.sports WHERE limit = ?";
        let data = [req.query.page_record];
        let result = await model.QueryListData(query, data, res);

        if (result) {
            for(i=0; i<result.length; i++){

                let querySub = "SELECT attachment FROM + process.env.public + tournament_attachment where tournament_id = ?";
                let dataSub = [result[i].tournament_id];
                let resultSub = await model.QueryListData(querySub, dataSub, res);
                result[i].pics = resultSub;
            }
            res.send({
                success: true,
                message: 'Successfull',
                data: result
            });
        } else
            res.send({
                success: false,
                message: 'Failed',
                data: []
            });
    } catch (error) {
        res.send({
            success: false,
            message: 'Something Went Wrong...',
            data: error.message
        });
    }
}


const WithoutPastList = async (req, res) => { 
    try {
        console.log("withoutpastlist");
        let query = "SELECT t.tournament_name,o.olympic_name,o.olympic_description,o.olympic_venue,o.olympic_country,o.olympic_city,o.olympic_state,o.olympic_start_date,o.olympic_end_date, t.tournament_start_date, t.tournament_start_time, t.tournament_end_date, t.tournament_end_time, t.tournament_venue, v.venue_name t.tournament_city, ct.city_name, t.tournament_country, c.name, t.sports, s.sports_name  FROM ${process.env.SCHEMA}.tournament AS t LEFT JOIN olympic as o on o.id = t.olympics_sports LEFT JOIN ${process.env.SCHEMA}.venue AS v ON v.id = t.tournament_venue LEFT JOIN ${process.env.SCHEMA}.city AS ct ON ct.id = t.tournament_city LEFT JOIN ${process.env.SCHEMA}.country AS c ON c.id = t.tournament_country LEFT JOIN ${process.env.SCHEMA}.sports AS s ON s.id = t.sports";
        console.log("query//////////////");
        console.log(query);


        let data = [];
        let result = await model.QueryListData(query, data, res);

        if (result) {
            for(i=0; i<result.length; i++){

                let querySub = "SELECT attachment FROM + process.env.public + tournament_attachment where tournament_id = ? AND status = ? ";
                let dataSub = [result[i].tournament_id];
                let resultSub = await model.QueryListData(querySub, dataSub, res);
                result[i].pics = resultSub;
            }
            res.send({
                success: true,
                message: 'Successfull',
                data: result
                });
        } else
            res.send({
               success: false,
                message: 'Failed',
                data: []
            });
    } catch (error) {
        res.send({
            success: false,
            message: 'Something Went Wrong...',
            data: error.message
        });
    }
}


const DetailsList = async (req, res) => {
    try {

        console.log('12..............')
        console.log("detailslist");
        let query = "SELECT id FROM ${process.env.SCHEMA}.tournament";
        let data = [];
        let result = await model.QueryListData(query, data, res);

        console.log('result..............')
        console.log(result)

        if (result) {
            for(i=0; i<result.length; i++){

                let query1 = "SELECT id FROM ${process.env.SCHEMA}.tournament_affliations where tournament_id = ?";
                let data1 = [result[i].tournament_id];
                let result1 = await model.QueryListData(query1, data1, res);
                result[i].affliations = result1;

                let query2 = "SELECT id FROM ${process.env.SCHEMA}.tournament_attachment where tournament_id = ?";
                let data2 = [result[i].tournament_id];
                let result2 = await model.QueryListData(query2, data2, res);
                result[i].attachment = result2;

                let query3 = "SELECT id FROM ${process.env.SCHEMA}.tournament_awards where tournament_id = ?";
                let data3 = [result[i].tournament_id];
                let result3 = await model.QueryListData(query3, data3, res);
                result[i].awards = result3;

                let query4 = "SELECT id FROM ${process.env.SCHEMA}.tournament_directors where tournament_id = ?";
                let data4 = [result[i].tournament_id];
                let result4 = await model.QueryListData(query4, data4, res);
                result[i].directors = result4;

                let query5 = "SELECT id FROM ${process.env.SCHEMA}.tournament_fee where tournament_id = ?";
                let data5 = [result[i].tournament_id];
                let result5 = await model.QueryListData(query5, data5, res);
                result[i].fee = result5;

                let query6 = "SELECT id FROM ${process.env.SCHEMA}.tournament_fee where tournament_id = ?";
                let data6 = [result[i].tournament_id];
                let result6 = await model.QueryListData(query6, data6, res);
                result[i].fee = result6;

                let query7 = "SELECT id FROM ${process.env.SCHEMA}.tournament_organizers where tournament_id = ?";
                let data7 = [result[i].tournament_id];
                let result7 = await model.QueryListData(query7, data7, res);
                result[i].organizers = result7;

                let query8 = "SELECT id FROM ${process.env.SCHEMA}.tournament_reviews where tournament_id = ?";
                let data8 = [result[i].tournament_id];
                let result8 = await model.QueryListData(query8, data8, res);
                result[i].reviews = result8;

                let query9 = "SELECT id FROM ${process.env.SCHEMA}.tournament_sponsers where tournament_id = ?";
                let data9 = [result[i].tournament_id];
                let result9 = await model.QueryListData(query9, data9, res);
                result[i].sponsers = result9;
            }
                res.send({
                    success: true,
                    message: 'Successfull',
                    data: result
                });
        } else
            res.send({
                success: false,
                message: 'Failed',
                data: []
            });
    } catch (error) {
        res.send({
            success: false,
            message: 'Something Went Wrong...',
            data: error.message
        });
    }
}


module.exports = { UpcomingList, PastList, WithoutPastList, DetailsList }