const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('NotesModel', NoteSchema);
