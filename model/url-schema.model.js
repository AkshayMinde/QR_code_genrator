const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({

    ID:{
        type:String,
        required:true
    },
    OriginalUrl: {
        type: String,
        required: true
    },
    ShortUrl: {
        type: String,
        required: true,
    },
    ClickCount: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('qr_code', urlSchema);