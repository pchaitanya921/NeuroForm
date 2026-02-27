const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
    form: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true,
        unique: true
    },
    totalResponses: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 }, // -1 to 1
    sentimentLabel: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
    keyThemes: [String],
    painPoints: [String],
    positiveHighlights: [String],
    actionableRecommendations: [String],
    executiveSummary: String,
    questionInsights: [
        {
            questionId: String,
            questionText: String,
            topAnswers: [String],
            insight: String
        }
    ],
    generatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Insight', insightSchema);
