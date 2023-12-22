const paypal = require("paypal-rest-sdk");
const db = require('../db');
const { userAuth } = require('../middleware/auth');

paypal.configure({
    mode: process.env.PAYPALTYPE, //sandbox or live
    client_id: process.env.PAYPALCLIENTID,
    client_secret: process.env.PAYPALSECRET
});

module.exports = (app) => {
    app.get("/v1/paymentSuccess", (req, res) => {
        var PayerID = req.query.PayerID;
        var paymentId = req.query.paymentId;
        let amount = req.query.amount;
        let eventID = req.query.eventID;
        let subscriberId = req.query.subscriberId;
        let currencyType = process.env.PAYMENT_CURRENCY;
        var execute_payment_json = {
            payer_id: PayerID,
            "transactions": [{
                "amount": {
                    "currency": currencyType,
                    "total": amount
                },
                "description": "This is the payment description."
            }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, async function (
            error,
            payment
        ) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Get Payment Response");
                let success = false, merchant_email = '';
                if (Array.isArray(payment.failed_transactions) && (!(payment.failed_transactions.length))) {
                    success = true;
                }
                if (payment.transactions[0].payee && payment.transactions[0].payee.email) {
                    merchant_email = payment.transactions[0].payee.email
                }

                let payment_details = `INSERT INTO payment_details(subscriber_id,event_id,is_success,response_status_code,response_json,created_at,amount,currency_type,merchant_email_id,transaction_Id) 
                VALUES('${subscriberId}','${eventID}',${success},'${payment.httpStatusCode}','${JSON.stringify(payment)}',NOW(),'${amount}','${currencyType}','${merchant_email}','${payment.id}')`
                await db.query(payment_details);
                console.log(JSON.stringify(payment));
                res.render("success");
            }
        });
    });

    app.get("/v1/paymentCancel", (req, res) => {
        res.render("cancel");
    });

    app.get("/v1/paypalSubmit", async (req, res) => {
        try {
            if (!req.query.eventID) {
                return res.status(200).send({
                    status: 400,
                    msg: 'Event id is mandatory !'
                })
            }
            if (!req.query.subscriberId) {
                return res.status(200).send({
                    status: 400,
                    msg: 'Subscriber id is mandatory !'
                })
            }

            let subscriberId = req.query.subscriberId;
            let eventFee = `SELECT 
            e.event_name,
            e.bird_discount,
            e.tournament_id,
            CASE 
            WHEN e.early_bird_end_date IS NULL THEN e.amount::varchar
            WHEN e.early_bird_end_date > NOW() THEN e.early_bird_end_date::varchar
            ELSE e.amount::varchar
            END AS amount
            
            FROM event as e WHERE id = ${req.query.eventID}`;
            eventFee = await db.query(eventFee);
            if (!eventFee.rowCount) {
                return res.status(200).send({
                    status: 400,
                    msg: 'Event not found !'
                })
            }

            let tournamentID = eventFee.rows[0].tournament_id;
            let tournamentQuery = `SELECT 
            CASE 
            WHEN tr.type = 2 THEN ''
            WHEN 
            (tr.type = 1 OR tr.type = 3) AND (t.tournament_early_bird_end_date IS NOT NULL) AND (t.tournament_early_bird_end_date > NOW()) 
            AND (tr.early_bird_entry_fee IS NOT NULL) THEN early_bird_entry_fee::varchar
            WHEN tr.entry_fee IS NOT NULL THEN tr.entry_fee::varchar
            ELSE ''
            END AS tournament_amount
            FROM tournament as t
            LEFT JOIN tournament_fee as tr
            ON t.id = tr.tournament_id
            WHERE t.id=${tournamentID} limit 1
            `
            tournamentQuery = await db.query(tournamentQuery);
            let tournament_amount = '';
            if (tournamentQuery.rowCount) {
                tournament_amount = tournamentQuery.rows[0].tournament_amount
            }
            let amount = eventFee.rows[0].amount;
            if (!amount) {
                return res.status(200).send({
                    status: 400,
                    msg: 'Event amount not found !'
                })
            }

            if (tournament_amount != '') {
                let findTournament = `SELECT id FROM
                payment_details WHERE event_id = '${req.query.eventID}'
                AND subscriber_id = '${subscriberId}';
                `
                findTournament = await db.query(findTournament);
                if (!findTournament.rowCount) {
                    amount = ((+amount) + (+tournament_amount)).toString();
                }
            }
            let eventName = eventFee.rows[0].event_name;
            let PORT = process.env.EVNVIRONMENT === 'DEV' ? process.env.DEVPORT : process.env.PORT;
            let HOST = process.env.EVNVIRONMENT === 'DEV' ? process.env.DEVHOST : process.env.HOST;
            var create_payment_json = {
                intent: "sale",
                payer: {
                    payment_method: "paypal"
                },
                redirect_urls: {
                    return_url: `${process.env.PROTOCOL}://${HOST}:${PORT}/v1/paymentSuccess?subscriberId=${subscriberId}&eventID=${req.query.eventID}&amount=${amount}`,
                    cancel_url: `${process.env.PROTOCOL}://${HOST}:${PORT}/v1/paymentCancel`
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": eventName,
                            "sku": "Event",
                            "price": amount,
                            "currency": process.env.PAYMENT_CURRENCY,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": process.env.PAYMENT_CURRENCY,
                        "total": amount
                    },
                    "description": "This is the payment description."
                }]
            };

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {
                    console.log("Create Payment Response");
                    console.log(payment);
                    res.redirect(payment.links[1].href);
                }
            });
        }
        catch (err) {
            console.log(err)
        }
    });


    app.post("/v1/getPaymentDetailsList", async (req, res) => {
        try {
            let fromDate = '';
            if (req.body.fromDate) {
                fromDate = new Date(req.body.fromDate);
                fromDate = fromDate.getMonth() + "-" + fromDate.getDate() + "-" + fromDate.getFullYear()
                fromDate = `AND cast(p.created_at as date) >= '${fromDate}' `
            }
            let toDate = '';
            if (req.body.toDate) {
                toDate = new Date(req.body.toDate);
                toDate = toDate.getMonth() + "-" + toDate.getDate() + "-" + toDate.getFullYear()
                toDate = `AND cast(p.created_at as date) <= '${toDate}'`
            }
            // let search = '';
            // if(req.body.search) {
            //     req.body.search = req.body.search.replace(/'/g, '\'\'');
            //     search = ` AND (tournament_name) ~* '^.*${req.body.search}.*$'`;
            // }
            let status = '';
            if (req.body.status) {
                req.body.status = (req.body.status == '1') ? true : false;
                status = `AND p.is_success = ${req.body.status}`;
            }
            let query = `SELECT p.id as payment_id,
            to_char(p.created_at,'DD-MM-YYYY') as payment_created_at,
            s.id as subscriber_id,e.id as event_id,* FROM payment_details as p
            LEFT JOIN subscriber as s ON cast(s.id as varchar) = p.subscriber_id
            LEFT JOIN event as e ON cast(e.id as varchar) = p.event_id
            WHERE 1=1
            ${fromDate}
            ${toDate}
            ${status}`;
            query = await db.query(query);
            if (query.rowCount) {
                return res.status(200).send({
                    status: 200,
                    list: query.rows
                })
            }
            else {
                return res.status(200).send({
                    status: 200,
                    list: []
                })
            }
        }
        catch (err) {
            return res.status(200).send({
                status: 500,
                msg: err.message
            })
        }
    });
}