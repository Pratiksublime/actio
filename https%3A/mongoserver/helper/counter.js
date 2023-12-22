const mongoose = require('mongoose');

module.exports = {

    idCounter: async (
        collection,
        column
    ) => {
        const _counter = await collection.aggregate([
            { $project: { [column]: 1, _id: 0 } },
            { $sort: { [column]: -1 } },
            { $limit: 1 }
        ]);
        console.log(_counter);
        // let aggregateQueryArr = [];
        // aggregateQueryArr.push({ $project: { [column]: 1, _id: 0 } });
        // aggregateQueryArr.push({ $sort: { [column]: -1 } }, { $limit: 1 });
        // const _counters = await collection.aggregate(aggregateQueryArr);
        return _counter.length >= 1 ? _counter[0][column] + 1 : 1;
    }

}
