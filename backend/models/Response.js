const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: { type: String, required: true },
    questionText: String,
    answer: mongoose.Schema.Types.Mixed, // can be string, number, array
    questionType: String
});

const responseSchema = new mongoose.Schema({
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    answers: [answerSchema],
    respondentName: String,
    respondentEmail: String,
    metadata: {
        userAgent: String,
        completedAt: Date,
        timeSpentSeconds: Number
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Response', responseSchema);
