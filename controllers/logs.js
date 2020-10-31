const asyncHandler = require('@evnotify/utils').asyncHandler;
const LogModel = require('../models/Log');
const errors = require('../errors.json');

const submitToLatestLog = asyncHandler(async (req, res, next) => {
    // NOTE this route should not be accessible from outside?!
    const latestLog = await LogModel.findOne({
        akey: req.headers.akey,
        status: 'running'
    }).sort('createdAt');
    const telemetryObj = req.body.telemetry || {};
    const baseData = {
        akey: req.headers.akey,
        charge: parseInt(telemetryObj.charging) || 0,
        startSOC: telemetryObj.soc_display || telemetryObj.soc_bms,
        startODO: telemetryObj.odo,
        startCEC: telemetryObj.cumulative_energy_charged,
        startCED: telemetryObj.cumulative_energy_discharged
    };

    delete req.body.akey;
    req.body.createdAt = new Date();

    if (!latestLog) {
        // create new one
        baseData.history = [req.body];
        await LogModel.create(baseData);
    } else {
        // if start soc not registered yet (due to location sync), register it once
        if (!latestLog.startSOC && baseData.startSOC) latestLog.startSOC = baseData.startSOC;
        // check if charging state changed
        if (latestLog.charge != baseData.charge) {
            // changed, create new one, close the latest one
            latestLog.status = 'finished';
            await latestLog.save();
            baseData.history = [req.body];
            await LogModel.create(baseData);
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
    }).sort('createdAt'));
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
    }).sort('createdAt') || {});  
});

const getCurrentLog = asyncHandler(async (req, res, next) => {
    res.json(await LogModel.findOne({
        akey: req.headers.akey,
        status: 'running'
    }).sort('createdAt') || {});
});

module.exports = {
    submitToLatestLog,
    getLogs,
    getLogByID,
    getLatestLog,
    getCurrentLog
};
