const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    event_name: {
        type : String,
        required: true
    },
    start_date: {
        type : Date,
        required: true,
        default: Date.now
    },
    end_date: {
        type : Date,
        required: true,
        default: Date.now
    },
    event_location: {
        type : String,
        required: true
    },
    event_logo: {
        type : String,
        required: true
    },
    company_name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required: true
    },
    phone: {
        type : String,
        required: true
    },
    address: {
        type : String,
        required: true
    },
    client_logo: {
        type : String,
        required: true
    }
});


module.exports = mongoose.model('Event', eventSchema);