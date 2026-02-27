const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: {
        type: String,
        enum: ['text', 'textarea', 'rating', 'mcq', 'scale', 'yes_no', 'email', 'number'],
        required: true
    },
    question: { type: String, required: true },
    placeholder: String,
    options: [String], // for mcq
    required: { type: Boolean, default: true },
    minRating: { type: Number, default: 1 },
    maxRating: { type: Number, default: 5 },
    // Adaptive logic
    conditionalLogic: {
        enabled: { type: Boolean, default: false },
        triggerQuestionId: String,
        triggerCondition: String, // e.g. "lte:3", "gte:4", "eq:yes"
        action: { type: String, enum: ['show', 'skip'], default: 'show' }
    }
});

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Form title is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    goal: {
        type: String, // the original AI prompt/goal
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    questions: [questionSchema],
    isPublished: {
        type: Boolean,
        default: false
    },
    settings: {
        allowAnonymous: { type: Boolean, default: true },
        collectEmail: { type: Boolean, default: false },
        showProgressBar: { type: Boolean, default: true },
        adaptiveFlow: { type: Boolean, default: true },
        thankYouMessage: { type: String, default: 'Thank you for your response! 🎉' }
    },
    responseCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

formSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Form', formSchema);
