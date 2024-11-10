const mongoose = require('mongoose');

const AssignmentSchema = mongoose.Schema({
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AssignmentModel', AssignmentSchema);
