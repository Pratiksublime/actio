const db = require('../db');

const GetCalendarInformation = async (req, res) => {
    try {
        let result = {
            eventMatchRegistered: [],
            eventCreated: [],
            eventManaged: [],
            eventControlled: [],
            tournamentDirected: [],
            tournamentCreated: []
        };

        // Events registered by the user as opponent and competitor
        let eventRegisteredOpponent = `SELECT ems.match_name as name, ems.description, 'opponent' as match_person, 'matchRegistered' as type,
        to_char(ems.created_at,'YYYY-MM-DD') created_at, 
        to_char(ems.match_date,'YYYY-MM-DD') start_date,
        array_to_json(
            array(SELECT d FROM (select title as venue_name, description as venue_description, path as venue_path 
            from venue_asset as va
            LEFT JOIN venue_images as vi ON vi.reference_id = va.id
            WHERE va.id = ems.venue_asset_id) d)) AS venue_details
        FROM event_match_schedule AS ems
        left join venue_asset as va on va.id = ems.venue_asset_id
		left join venue_images as vi on vi.reference_id = va.id and vi.type = 'asset'
        WHERE opponent_id IN (SELECT er.id FROM event_players as ep INNER JOIN event_registration as er ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID})`;
        eventRegisteredOpponent = await db.query(eventRegisteredOpponent);
        eventRegisteredOpponent = eventRegisteredOpponent.rows;

        let eventRegisteredCompetitor = `SELECT ems.match_name as name, ems.description, 'competitor' as match_person, 'matchRegistered' as type,
        to_char(ems.created_at,'YYYY-MM-DD') created_at,
        to_char(ems.match_date,'YYYY-MM-DD') start_date,
        array_to_json(
            array(SELECT d FROM (select title as venue_name, description as venue_description, path as venue_path 
            from venue_asset as va
            LEFT JOIN venue_images as vi ON vi.reference_id = va.id
            WHERE va.id = ems.venue_asset_id) d)) AS venue_details
        FROM event_match_schedule AS ems
        left join venue_asset as va on va.id = ems.venue_asset_id
		left join venue_images as vi on vi.reference_id = va.id and vi.type = 'asset'
        WHERE competitor_id IN (SELECT er.id FROM event_players as ep INNER JOIN event_registration as er ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID})`;
        eventRegisteredCompetitor = await db.query(eventRegisteredCompetitor);
        eventRegisteredCompetitor = eventRegisteredCompetitor.rows;
        result.eventMatchRegistered = eventRegisteredOpponent.concat(eventRegisteredCompetitor);

        // Events created by the user
        let eventCreated = `SELECT 'eventCreated' as type, event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at, 
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event As e WHERE created_by = ${req.myID}`;
        eventCreated = await db.query(eventCreated);
        eventCreated = eventCreated.rows;
        result.eventCreated = eventCreated;

        // Events managed by the user
        let eventManaged = `SELECT 'eventManaged' as type, e.event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event_managers as em INNER JOIN event as e ON em.event_id = e.id WHERE em.subscriber_id = ${req.myID}`;
        eventManaged = await db.query(eventManaged);
        eventManaged = eventManaged.rows;
        result.eventManaged = eventManaged;

        // Events controlled by the user
        let eventControlled = `SELECT 'eventControll' as  type, e.event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event_controllers as ec
        INNER JOIN event as e ON ec.event_id = e.id
        INNER JOIN subscriber as s ON s.subscriber_id = ec.subscriber_id
        WHERE s.id = ${req.myID}`;
        eventControlled = await db.query(eventControlled);
        eventControlled = eventControlled.rows;
        result.eventControlled = eventControlled;

        // Tournament Directors
        let tournamentDirectors = `SELECT 'tournamentDirectors' as type, t.tournament_name as name, t.tournament_description as description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') end_date
        FROM tournament_directors as td
        INNER JOIN tournament as t ON t.id = td.tournament_id
        INNER JOIN subscriber as s ON s.subscriber_id = td.subscriber_id
        WHERE s.id = ${req.myID}`;
        tournamentDirectors = await db.query(tournamentDirectors);
        tournamentDirectors = tournamentDirectors.rows;
        result.tournamentDirected = tournamentDirectors;

        // Tournament Created
        let tournamentCreated = `SELECT 'tournamentCreated' as type, t.tournament_name as name, t.tournament_description as description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') end_date
        FROM tournament as t WHERE t.created_by = ${req.myID}`;
        tournamentCreated = await db.query(tournamentCreated);
        tournamentCreated = tournamentCreated.rows;
        result.tournamentCreated = tournamentCreated;

        let finalResult = [];
        for (let item of result.eventControlled) {
            if (item) {
                const data = {
                    date: item.start_date,
                    type: "",
                    typeName: "",
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventCreated) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.type = ''
                findItem.typeName = '';
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    type: '',
                    typeName: '',
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventManaged) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.type = ''
                findItem.typeName = '';
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    type: '',
                    typeName: '',
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.tournamentDirected) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.type = ''
                findItem.typeName = '';
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    type: '',
                    typeName: '',
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.tournamentCreated) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.type = ''
                findItem.typeName = '';
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    type: '',
                    typeName: '',
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventMatchRegistered) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.type = ''
                findItem.typeName = '';
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.start_date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    type: '',
                    typeName: '',
                    details: [mappingData(item)]
                }
                finalResult.push(data);
            }
        }

        return finalResult;
    } catch (error) {
        console.log(error);
    }
}

const GetTypeBasedCalendarInformation = async (req, res) => {
    try {
        let result = {
            eventMatchRegistered: [],
            eventCreated: [],
            eventManaged: [],
            eventControlled: [],
            tournamentDirected: [],
            tournamentCreated: []
        };

        let registerQuery = '';
        let eventQuery = '';
        let tournamentQuery = '';
        const type = req.body.type;
        if (type == "") {
            return { status: process.env.STATUS_405, result: [], msg: 'Enter valid params...!' };
        }
        switch (type) {
            case 'Year':
                registerQuery = `and EXTRACT(Year FROM ems.match_date) = ${req.body.year}`;
                eventQuery = `and EXTRACT(Year FROM e.event_start_date) = ${req.body.year}`;
                tournamentQuery = `and EXTRACT(Year FROM t.tournament_start_date) = ${req.body.year}`;
                break;
            case 'Month':
                registerQuery = `and EXTRACT(Year FROM ems.match_date) = ${req.body.year} and EXTRACT(Month FROM ems.match_date) = ${req.body.month}`;
                eventQuery = `and EXTRACT(Year FROM e.event_start_date) = ${req.body.year} and EXTRACT(Month FROM e.event_start_date) = ${req.body.month}`;
                tournamentQuery = `and EXTRACT(Year FROM t.tournament_start_date) = ${req.body.year} and EXTRACT(Month FROM t.tournament_start_date) = ${req.body.month}`;
                break;
            case 'Week':
                registerQuery = `and ems.match_date >= '${req.body.startDate}' and ems.match_date <= '${req.body.endDate}'`;
                eventQuery = `and e.event_start_date >= '${req.body.startDate}' and e.event_start_date <= '${req.body.endDate}'`;
                tournamentQuery = `and t.tournament_start_date >= '${req.body.startDate}' and t.tournament_start_date <= '${req.body.endDate}'`;
                break;
            default:
                '';
        }

        // Events registered by the user as opponent and competitor
        let eventRegisteredOpponent = `SELECT ems.match_name as name, ems.description, 'opponent' as match_person, 'matchRegistered' as type,
        to_char(ems.created_at,'YYYY-MM-DD') created_at, 
        to_char(ems.match_date,'YYYY-MM-DD') start_date,
        array_to_json(
            array(SELECT d FROM (select title as venue_name, description as venue_description, path as venue_path 
            from venue_asset as va
            LEFT JOIN venue_images as vi ON vi.reference_id = va.id
            WHERE va.id = ems.venue_asset_id) d)) AS venue_details
        FROM event_match_schedule AS ems
        left join venue_asset as va on va.id = ems.venue_asset_id
		left join venue_images as vi on vi.reference_id = va.id and vi.type = 'asset'
        WHERE opponent_id IN (SELECT er.id FROM event_players as ep INNER JOIN event_registration as er ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID}) ${registerQuery}`;
        eventRegisteredOpponent = await db.query(eventRegisteredOpponent);
        eventRegisteredOpponent = eventRegisteredOpponent.rows;

        let eventRegisteredCompetitor = `SELECT ems.match_name as name, ems.description, 'competitor' as match_person, 'matchRegistered' as type,
        to_char(ems.created_at,'YYYY-MM-DD') created_at,
        to_char(ems.match_date,'YYYY-MM-DD') start_date,
        array_to_json(
            array(SELECT d FROM (select title as venue_name, description as venue_description, path as venue_path 
            from venue_asset as va
            LEFT JOIN venue_images as vi ON vi.reference_id = va.id
            WHERE va.id = ems.venue_asset_id) d)) AS venue_details
        FROM event_match_schedule AS ems
        left join venue_asset as va on va.id = ems.venue_asset_id
		left join venue_images as vi on vi.reference_id = va.id and vi.type = 'asset'
        WHERE competitor_id IN (SELECT er.id FROM event_players as ep INNER JOIN event_registration as er ON ep.registration_id = er.id
        WHERE ep.subscriber_id = ${req.myID}) ${registerQuery}`;
        eventRegisteredCompetitor = await db.query(eventRegisteredCompetitor);
        eventRegisteredCompetitor = eventRegisteredCompetitor.rows;
        result.eventMatchRegistered = eventRegisteredOpponent.concat(eventRegisteredCompetitor);

        // Events created by the user
        let eventCreated = `SELECT 'eventCreated' as type, event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at, 
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event As e WHERE created_by = ${req.myID} ${eventQuery}`;
        eventCreated = await db.query(eventCreated);
        eventCreated = eventCreated.rows;
        result.eventCreated = eventCreated;

        // Events managed by the user
        let eventManaged = `SELECT 'eventManaged' as type, e.event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event_managers as em INNER JOIN event as e ON em.event_id = e.id WHERE em.subscriber_id = ${req.myID} ${eventQuery}`;
        eventManaged = await db.query(eventManaged);
        eventManaged = eventManaged.rows;
        result.eventManaged = eventManaged;

        // Events controlled by the user
        let eventControlled = `SELECT 'eventControll' as  type, e.event_name as name, 
        to_char(e.created_at,'YYYY-MM-DD') created_at,
        to_char(e.event_start_date,'YYYY-MM-DD') start_date,
        to_char(e.event_end_date,'YYYY-MM-DD') end_date
        FROM event_controllers as ec
        INNER JOIN event as e ON ec.event_id = e.id
        INNER JOIN subscriber as s ON s.subscriber_id = ec.subscriber_id
        WHERE s.id = ${req.myID} ${eventQuery}`;
        eventControlled = await db.query(eventControlled);
        eventControlled = eventControlled.rows;
        result.eventControlled = eventControlled;

        // Tournament Directors
        let tournamentDirectors = `SELECT 'tournamentDirectors' as type, t.tournament_name as name, t.tournament_description as description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') end_date
        FROM tournament_directors as td
        INNER JOIN tournament as t ON t.id = td.tournament_id
        INNER JOIN subscriber as s ON s.subscriber_id = td.subscriber_id
        WHERE s.id = ${req.myID} ${tournamentQuery}`;
        tournamentDirectors = await db.query(tournamentDirectors);
        tournamentDirectors = tournamentDirectors.rows;
        result.tournamentDirected = tournamentDirectors;

        // Tournament Created
        let tournamentCreated = `SELECT 'tournamentCreated' as type, t.tournament_name as name, t.tournament_description as description,
        to_char(t.tournament_start_date,'YYYY-MM-DD') start_date,
        to_char(t.tournament_end_date,'YYYY-MM-DD') end_date
        FROM tournament as t WHERE t.created_by = ${req.myID} ${tournamentQuery}`;
        tournamentCreated = await db.query(tournamentCreated);
        tournamentCreated = tournamentCreated.rows;
        result.tournamentCreated = tournamentCreated;

        let finalResult = [];
        for (let item of result.eventControlled) {
            if (item) {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventCreated) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventManaged) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.tournamentDirected) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.tournamentCreated) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)],
                }
                finalResult.push(data);
            }
        }

        for (let item of result.eventMatchRegistered) {
            let findItem = finalResult.find(i => i.date == item.start_date);
            if (findItem) {
                findItem.details.push(mappingData(item));
                finalResult.map(item => item.date == findItem.start_date ? findItem : {});
            } else {
                const data = {
                    date: item.start_date,
                    details: [mappingData(item)]
                }
                finalResult.push(data);
            }
        }

        return { status: process.env.STATUS_200, result: finalResult.length > 0 ? finalResult : [], msg: 'Success' };
    } catch (error) {
        console.log(error);
    }
}

const mappingData = (item) => {
    if (item.venue_details && Array.isArray(item.venue_details) && item.venue_details.length > 0) {
        item.venue_name = item.venue_details[0].venue_name;
        item.venue_description = item.venue_details[0].venue_description;
        item.venue_path = item.venue_details[0].venue_path;
        delete item.venue_details;

        return item;
    } else {
        item.venue_name = ""
        item.venue_description = "";
        item.venue_path = "";
        delete item.venue_details;

        return item;
    }
}

module.exports = {
    GetCalendarInformation, GetTypeBasedCalendarInformation
}