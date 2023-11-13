
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
 createdby: String,
    title: String,
    teams:Number,
    code:String,
    date: {
        type: Date,
        default: Date.now
    
    },
   
});
const SessionModel = mongoose.model('Session', sessionSchema);
module.exports = SessionModel