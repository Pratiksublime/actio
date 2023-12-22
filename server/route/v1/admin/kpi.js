const { body, check } = require('express-validator');
const { userAuth } = require('../../../middleware/auth');
const kpiController = require('../../../controller/v1/admin/kpi');

module.exports = (app) => {
    const validateKPIInsert = [
        body('kpi')
            .isArray(),
        body('kpi.*.typeStatus').isNumeric().isLength({ min: 1 }),
        body('sports_id').isNumeric().isLength({ min: 1 }),
        body('removeKPI').isArray().optional({ checkFalsy: true })
    ];
    
    const validateSportsKPI = [
        body('sports_id').isNumeric().isLength({ min: 1 })
    ];

    app.post('/v1/admin/insertKPILabel', userAuth, validateKPIInsert, kpiController.insertKPI);
    app.post('/v1/admin/listSports', userAuth, kpiController.listSports);
    app.post('/v1/admin/listSportsKPI', userAuth, validateSportsKPI, kpiController.listSportsKPI);
}