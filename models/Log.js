const mongoose = require('mongoose');
const connection = require('@evnotify/utils').db.getDB();

const options = {
    id: false,
    collection: 'log',
    timestamps: true,
    toObject: {
        getters: true
    },
    versionKey: false
};

const LogSchema = new mongoose.Schema({
    akey: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['running', 'finished'],
        default: 'running'
    },
    charge: {
        type: Boolean,
        required: true,
        default: 0
    },
    endDate: {
        type: Date,
        required: false
    },
    startSOC: {
        type: Number,
        required: false,
    },
    endSOC: {
        type: Number,
        required: false,
    },
    startODO: {
        type: Number,
        required: false
    },
    endODO: {
        type: Number,
        required: false
    },
    startCEC: {
        type: Number,
        required: false
    },
    endCEC: {
        type: Number,
        required: false
    },
    startCED: {
        type: Number,
        required: false
    },
    endCED: {
        type: Number,
        required: false
    },
    averageKW: {
        type: Number,
        required: false
    },
    distance: {
        type: Number,
        required: false
    },
    averageSpeed: {
        type: Number,
        required: false
    },
    history: [Object],
}, options);

module.exports = connection.model('Log', LogSchema);
