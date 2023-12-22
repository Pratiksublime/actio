var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

const { Query } = require('pg');
const db = require('../../../db');
const helper = require('../../../helper/helper');



const add = async (req, res) => {
    try {
        await db.query(`BEGIN;`);
       
        if (Array.isArray(req.body.studr)) {
        let insertstudr = '';
            for (let item of req.body.studr) {
                console.log("demo3");
                if (item.photo) {
                    let isImage = /^data:image/.test(item.photo);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.photo, profilePath);
                        item.photo = uploaded.path;
                    }
                }
                if (item.adhar_card) {
                    let isImage = /^data:image/.test(item.adhar_card);
                    if (isImage) {
                        let profilePath = 'images/profile/';
                        let uploaded = helper.uploadBase64(item.adhar_card, profilePath);
                        item.adhar_card = uploaded.path;
                    }
                }
                

                 if(!item.name || typeof item.name === "undefined" || item.name === undefined && item.name ===""){
                        item.name = null;
                    }

                    if(!item.age || typeof item.age === "undefined" || item.age === undefined && item.age ===""){
                        item.age = null;
                    }

                    if(!item.photo || typeof item.photo === "undefined" || item.photo === undefined && item.photo ===""){
                        item.photo = null;
                    }
                    if(!item.adhar_card || typeof item.adhar_card === "undefined" || item.adhar_card === undefined && item.adhar_card ===""){
                        item.adhar_card = null;
                    }

                    if(!item.email || typeof item.email === "undefined" || item.email === undefined && item.email ===""){
                        item.email = null;
                    }
                    if(!item.dob || typeof item.dob === "undefined" || item.dob === undefined && item.dob ===""){
                        item.dob = null;
                    }
                    if(!item.mobile || typeof item.mobile === "undefined" || item.mobile === undefined && item.mobile ===""){
                        item.mobile = null;
                    }

                    if(!item.parents_name || typeof item.parents_name === "undefined" || item.parents_name === undefined && item.parents_name ===""){
                        item.parents_name = null;
                    }
                    if(!item.parents_no || typeof item.parents_no === "undefined" || item.parents_no === undefined && item.parents_no ===""){
                        item.parents_no = null;
                    }
                    if(!item.parents_email || typeof item.parents_email === "undefined" || item.parents_email === undefined && item.parents_email ===""){
                        item.parents_email = null;
                    }

                    if(!item.center || typeof item.center === "undefined" || item.center === undefined && item.center ===""){
                        item.center = null;
                    }

                    if(!item.district || typeof item.district === "undefined" || item.district === undefined && item.district ===""){
                        item.district = null;
                    }

                     if(!item.amount || typeof item.amount === "undefined" || item.amount === undefined && item.amount ===""){
                        item.amount = null;
                    }
                     if(!item.amount_status || typeof item.amount_status === "undefined" || item.amount_status === undefined && item.amount_status ===""){
                        item.amount_status = null;
                    }
                     if(!item.transaction || typeof item.transaction === "undefined" || item.transaction === undefined && item.transaction ===""){
                        item.transaction = null;
                    }
                     if(!item.age || typeof item.age === "undefined" || item.age === undefined && item.age ===""){
                        item.age = null;
                    }
                    if(!item.gender || typeof item.gender === "undefined" || item.gender === undefined && item.gender ===""){
                        item.gender = null;
                    }


                insertstudr += `INSERT INTO stud_registration(name,gender,age,photo,adhar_card ,email,dob, mobile,parents_name,parents_no, parents_email,center,district,amount,amount_status,transaction,name_of_institute,category,coach_name,creadet_at, status )VALUES ('${item.name}','${item.gender}',${item.age},'${(item.photo) ? "" + item.photo.replace(/'/g, '\'\'') + "" : null}','${(item.adhar_card) ? "" + item.adhar_card.replace(/'/g, '\'\'') + "" : null}','${item.email}',${item.dob},${item.mobile},'${item.parents_name}',${item.parents_no},'${item.parents_email}','${item.center}','${item.district}',${item.amount},'${item.amount_status}','${item.transaction}','${item.name_of_institute}','${item.category}','${item.coach_name}', now(), 1);`;    
             
              }
           
                 
                 console.log("insertstudr.....") ; 
                 console.log(insertstudr);  
            if(insertstudr){
                
                var insertResult = await db.query(insertstudr);
                await db.query(`COMMIT;`);
                return true;
            }

        }
        } catch (err) {

            console.log("update err:");
            console.log(err);
            return false;
            console.log(err);
        }
}


module.exports = { add };