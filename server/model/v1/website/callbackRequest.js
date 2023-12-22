const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');



const list = async (req, res) => {
    try {
             console.log('req.body.number=======')
             console.log(req.body.number)

        if(req.body.number || req.body.number !== "" || typeof req.body.number !=="undefind"){

            var number = req.body.number;
        }

        return number;
    } catch (err) {
        console.log("err:");
        console.log(err); 

        return false;
    }
}

module.exports = { list };