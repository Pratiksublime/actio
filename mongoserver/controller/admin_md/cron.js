const mongoose = require('mongoose');
const moment = require('moment');
let todays_dt = moment().format("YYYY-MM-DD HH:mm:ss");
const { sendEmail } = require('../../helper/sendmail');
const {Schema} = require('../../model/schema');


const rollout = async (req, res) => {
    try {
        const collection = mongoose.model('playerpayment', Schema.playerpayment);
        const playerCollection = mongoose.model('players', Schema.players);
    
        // Use a projection to retrieve only necessary fields
        let playerData = await collection.find({
            "paymentArray.roll_out": true,
            "paymentArray.status": "1",
            
            "paymentArray.payment_type": { $in: ["period", "session"] },
            $expr: {
                $gt: [todays_dt, "$paymentArray.end_date"]
            }
        }, { player_id: 1 }).exec();  
    
        if (playerData.length > 0) {
            // Fetch emails for these players only
            const playerIds = playerData.map(player => player.player_id);
            
            // Again, use projection to retrieve only necessary fields
            const players = await playerCollection.find({
                id: { $in: playerIds }
            }, { email_id: 1 }).exec();
    
            const emails = players.map(player => player.email_id);
            console.log("Emails to be sent to:", emails);
    
            // Send emails
            const emailText = `This is a friendly reminder that your account with our academy expired . We miss having you onboard and hope you'd consider renewing.Don't miss out on all the benefits we offer. Please renew`;
            emails.forEach(email => {
                sendEmail(email, `Account Created at `, emailText);
            });
        }
    } catch (error) {
        console.error("Error sending emails: ", error);
    }

}
const twoDaysBefore  = async (req, res) => {
    async function sendReminderEmails(offset, message) {
        const collection = mongoose.model('playerpayment', Schema.playerpayment);
        const playerCollection = mongoose.model('players', Schema.players);
    
        let targetDate = new Date(todays_dt);
        targetDate.setDate(todays_dt.getDate() + offset);
    
        let playerData = await collection.find({
            "paymentArray.roll_out": true,
            "paymentArray.status": "1",
            "paymentArray.payment_type": "period",
            "paymentArray.end_date": {
                $lte: targetDate
            }
        },{ player_id: 1 }).exec();
    
        if (playerData.length > 0) {
            const playerIds = playerData.map(player => player.player_id);
            const players = await playerCollection.find({
                id: { $in: playerIds }
            }, { email_id: 1 }).exec();
            const emails = players.map(player => player.email_id);
    
            emails.forEach(email => {
                sendEmail(email, `Reminder: Sport Academy Coaching Expiry`, message);
            });
        }
    }
    
    try {
        // 2 days before
        await sendReminderEmails(-2, `This is a friendly reminder that your account with our academy expired in 2 days . We miss having you onboard and hope you'd consider renewing.Don't miss out on all the benefits we offer. Please renew.`);
        // 5 days after
        await sendReminderEmails(5, `This is a friendly reminder that your account with our academy expired 5 days ago. We miss having you onboard and hope you'd consider renewing.Don't miss out on all the benefits we offer. Please renew..`);
        // 10 days after
        await sendReminderEmails(10, `This is a friendly reminder that your account with our academy expired 10 days ago. We miss having you onboard and hope you'd consider renewing.Don't miss out on all the benefits we offer. Please renew.`);
        // 15 days after
        await sendReminderEmails(15, `This is a friendly reminder that your account with our academy expired 15 days ago. We miss having you onboard and hope you'd consider renewing.Don't miss out on all the benefits we offer. Please renew..`);
    
    } catch (error) { 
        console.error("Error sending emails: ", error);
    }
    

};

const sessionemail = async(req,res)=>{


const collection = mongoose.model('playerpayment', Schema.playerpayment);
const playerCollection = mongoose.model('players', Schema.players);
const attendances = mongoose.model('Attendance', Schema.Attendance);

// Assuming the required modules and schemas are already defined

try {
    const activePayments = await collection.find({ status: 1 }, { player_id: 1, paymentArray: 1 });
  
    // Get player_ids for batch processing
    const playerIds = activePayments.map(payment => payment.player_id);
  
    // Fetch player emails in a single batch
    const playerEmails = await playerCollection.find({ id: { $in: playerIds } }, { id: 1, email_id: 1 });
  
    // Create a map for quick email lookups
    const emailLookup = playerEmails.reduce((map, player) => {
      map[player.id] = player.email_id;
      return map;
    }, {});
  
    for (const payment of activePayments) {
      const { player_id, paymentArray } = payment;
     
      if (!paymentArray || !paymentArray.length) continue;
  
      const { level_id = null, batch_id = null, start_date = null, end_date = null, no_of_session = null, roll_out = null, payment_type = null } = paymentArray[0];
  
      // Aggregate
      const attendancess=await attendances.aggregate([{
                $addFields: {
                    converted_mdf_dt: {
                        $cond: {
                            if: { $eq: [{ $type: "$date" }, "string"] },
                            then: { $dateFromString: { dateString: "$date" } },
                            else: "$date"
                        }
                    },
                },
            },{
                $match:{
                    converted_mdf_dt:{ $gte: start_date, $lte: end_date },
                    player_id,
                    attendance_status: "present",
                    status: 1,
                    level_id,
                    batch_id,
                }
            }
        
        ])
      //const attendancess = await attendances.aggregate([ ... ]); // kept your aggregation as it is
  
      const daysSinceEndDate = Math.ceil((new Date() - end_date) / (1000 * 60 * 60 * 24));
  
      let shouldSendEmail = false;
      let emailText = "";
      
  
      if (attendancess.length > no_of_session || (payment_type === "session" ) ) {
        if (daysSinceEndDate === -2) { // 2 days before end_date
          shouldSendEmail = true;
          emailText = "Your sessions will end in 2 days. Please be prepared.";
        } else if (daysSinceEndDate === 5) {
          shouldSendEmail = true;
          emailText = "It's been 5 days since your sessions ended. Please consider renewing.";
        } else if (daysSinceEndDate === 10) {
          shouldSendEmail = true;
          emailText = "It's been 10 days since your sessions ended.!";
        } else if (daysSinceEndDate >= 15) {
          shouldSendEmail = true;
          emailText = "It's been over 15 days since your sessions ended. Please come back and renew!";
        }
  
        if (shouldSendEmail) {
          const email_id = emailLookup[player_id];
          if (email_id) {
            sendEmail(email_id, "Reminder from Our Academy", emailText); 
            console.log(`Email sent to ${email_id}.`);
          }
        }
      } 
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
  


// try {
//   const activePayments = await collection.find({ status: 1 }, { player_id: 1, paymentArray: 1 });

//   // Get player_ids for batch processing
//   const playerIds = activePayments.map(payment => payment.player_id);

//   // Fetch player emails in a single batch
//   const playerEmails = await playerCollection.find({ id: { $in: playerIds } }, { id: 1, email_id: 1 });

//   // Create a map for quick email lookups
//   const emailLookup = playerEmails.reduce((map, player) => {
//     map[player.id] = player.email_id;
//     return map;
//   }, {});

//   for (const payment of activePayments) {
//     const { player_id, paymentArray } = payment;
   
//     if (!paymentArray || !paymentArray.length) continue;

//     const { level_id = null, batch_id = null, start_date = null, end_date = null, no_of_session = null, roll_out = null, payment_type = null } = paymentArray[0];
//     // Aggregate
//     const attendancess=await attendances.aggregate([{
//         $addFields: {
//             converted_mdf_dt: {
//                 $cond: {
//                     if: { $eq: [{ $type: "$date" }, "string"] },
//                     then: { $dateFromString: { dateString: "$date" } },
//                     else: "$date"
//                 }
//             },
//         },
//     },{
//         $match:{
//             converted_mdf_dt:{ $gte: start_date, $lte: end_date },
//             player_id,
//             attendance_status: "present",
//             status: 1,
//             level_id,
//             batch_id,
//         }
//     }

// ])
//     //console.log(attendancess);
//     console.log(`email_id ${emailLookup} has ${attendancess.length} attendances in the specified date range.-------------------------------------------`); 


//     if (attendancess.length === no_of_session && payment_type === "session" && roll_out=== "true") {    
//       const email_id = emailLookup[player_id];

//       if (email_id) {
//         const emailText = `This is a friendly reminder that your account with our academy expired. We miss having you onboard and hope you'd consider renewing. Don't miss out on all the benefits we offer. Please renew.`;
//         sendEmail(email_id, "Account Created at ", emailText); 

//         console.log(`email_id ${email_id} email send:-------------------.`);
//       }
//     } 
//   }
// } catch (error) {
//   console.error("An error occurred:", error);
// }


    

        

    
}



module.exports = { rollout,twoDaysBefore,sessionemail };
  