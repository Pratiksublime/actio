 const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');



const list = async (req, res) => {
    try {
        
        var result = {}; 

        
        let Querydata = "select * from subscriber where id = "+req.query.id+"";

         result = await db.Query(Querydata);

        return result.rows;
    } catch (err) {
        console.log("err:");
        console.log(err); 

        return false;
    }
}

module.exports = { list };