const { list } = require('pm2');
const db = require('../../db');

const insertKPI = async (req) => {
    try {
        let insertKPIArray = [];
        let toUpdateKPI = [];
        let toDeleteKPI = (req.body.removeKPI && req.body.removeKPI.length) ? req.body.removeKPI : [];

        // Delete KPI
        if (toDeleteKPI.length) {
            await db.query(`DELETE FROM ${process.env.SCHEMA}.kpi_category 
            WHERE id in (${toDeleteKPI})`);
            await db.query(`DELETE FROM ${process.env.SCHEMA}.kpi_sport_mapping
            WHERE kpi_category_id in (${toDeleteKPI})`)
        }
        let toInsertKPI = req.body.kpi.filter((item) => {
            if (item.id) {
                toUpdateKPI.push(item)
            }
            else {
                return item;
            }
        });

        // Updater KPI
        if (toUpdateKPI.length) {
            for (let item of toUpdateKPI) {
                await db.query(`UPDATE ${process.env.SCHEMA}.kpi_category
                SET category_name = '${item.category_name}',
                type_status = ${item.typeStatus},
                updated_at = now(),
                updated_by = ${req.myID}
                WHERE id = ${item.id} 
                `)
            }
        }

        // Insert KPI
        for (let item of toInsertKPI) {
            insertKPIArray.push(`('${item.category_name}',now(),${req.myID},${item.typeStatus})`)
        }
        insertKPIArray = insertKPIArray.join();
        let kpiQuery = `INSERT INTO ${process.env.SCHEMA}.kpi_category(
           category_name,
           created_at,
           created_by,
           type_status
            )
            VALUES ${insertKPIArray} returning id`;
        kpiQuery = await db.query(kpiQuery);
        if (kpiQuery.rowCount) {
            kpiQuery.rows;
            let insertcaKPIArray = [];
            for (let items of kpiQuery.rows) {
                insertcaKPIArray.push(`(${items.id},${req.body.sports_id})`)
            }
            let kpiQueryca =
                `INSERT INTO ${process.env.SCHEMA}.kpi_sport_mapping(
             kpi_category_id,
             sports_id
            )
            VALUES ${insertcaKPIArray}`;
            kpiQueryca = await db.query(kpiQueryca);
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const listSports = async () => {
    try {
        let sportsQuery = `SELECT id,sports_name FROM ${process.env.SCHEMA}.sports`;
        sportsQuery = await db.query(sportsQuery);
        if (sportsQuery.rowCount) {
            sportsQuery = sportsQuery.rows;
            return sportsQuery;
        }
        else {
            return [];
        }
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

const listSportsKPI = async (req) => {
    try {
        let listSportsKPI = `SELECT
        kc.id,
        kc.category_name,
        kc.type_status
        FROM kpi_category as kc
        INNER JOIN kpi_sport_mapping as ksm
        ON ksm.kpi_category_id = kc.id
        WHERE ksm.sports_id = ${req.body.sports_id}`;
        listSportsKPI = await db.query(listSportsKPI);
        let sports = await db.query(`SELECT sports_name FROM sports WHERE id=${req.body.sports_id}`);
        if (!sports.rowCount) {
            return {
                sports_id: '',
                sports_name: '',
                listSportsKPI: []
            }
        }
        const result = {
            sports_id: req.body.sports_id,
            sports_name: sports.rows[0].sports_name,
            listSportsKPI: []
        };
        if (listSportsKPI.rowCount) {
            result['listSportsKPI'] = listSportsKPI.rows.map((i) => {
                if ('type_status' in i) {
                    i['typeStatus'] = i['type_status'];
                    delete i['type_status']
                    return i;
                }
            });
        }
        return result;
    }
    catch (err) {
        return {
            serverError: true,
            error: err.message
        }
    }
}

module.exports = { insertKPI, listSports, listSportsKPI };