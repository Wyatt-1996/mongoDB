var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = mongoose.Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }
});

module.exports = mongoose.model('Note', noteSchema);