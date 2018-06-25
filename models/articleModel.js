var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var articleSchema = mongoose.Schema({
    title: String,
    link: String,
    summary: String,
    saved: {
        type: Boolean,
        default: false
      },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

module.exports = mongoose.model('Article', articleSchema);