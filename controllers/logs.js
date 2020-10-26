const asyncHandler = require('@evnotify/utils').asyncHandler;
const LogModel = require('../models/Log');
const errors = require('../errors.json');

const submitToLatestLog = asyncHandler(async (req, res, next) => {
    // NOTE this route should not be accessible from outside?!
    const latestLog = await LogModel.findOne({
        akey: req.headers.akey,
        status: 'running'
    }).sort('startDate');
    const baseData = {
        akey: req.headers.akey,
        charge: req.body.charging,
        startDate: new Date(),
        startSOC: req.body.soc_display || req.body.soc_bms,
        startODO: req.body.odo,
        startCEC: req.body.cumulative_energy_charged,
        startCED: req.body.cumulative_energy_discharged
    };

    if (!latestLog) {
        // create new one
        baseData.history = [req.body];
        await LogModel.create(baseData);
    } else {
        // check if charging state changed
        if (latestLog.charging != req.body.charging) {
            // changed, create new one, close the latest one
            latestLog.status = 'finished';
            await latestLog.save();
            await LogModel.create({
                history: [req.body]
            });
        } else {
            // didn't changed, push to existing one
            latestLog.history.push(req.body);
            await latestLog.save();
        }
    }

    res.sendStatus(200);
});

const getLogs = asyncHandler(async (req, res, next) => {
    res.json(await LogModel.find({
        akey: req.headers.akey
    }).sort('startDate'));
});

const getLogByID = asyncHandler(async (req, res, next) => {
    const log = await LogModel.findById(req.params.id);

    if (log == null) return next(errors.LOG_NOT_FOUND);

    res.json(log);
});

const getLatestLog = asyncHandler(async (req, res, next) => {
    res.json(await LogModel.findOne({
        akey: req.headers.akey,
        status: 'finished'
    }).sort('startDate'));  
});

const getCurrentLog = asyncHandler(async (req, res, next) => {
    res.json(await LogModel.findOne({
        akey: req.headers.akey,
        status: 'running'
    }).sort('startDate'));
});

module.exports = {
    submitToLatestLog,
    getLogs,
    getLogByID,
    getLatestLog,
    getCurrentLog
};
