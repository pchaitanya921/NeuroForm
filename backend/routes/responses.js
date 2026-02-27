const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const Form = require('../models/Form');
const { protect } = require('../middleware/auth');

// POST /api/responses/:formId — submit a response
router.post('/:formId', async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (!form.isPublished) return res.status(403).json({ success: false, message: 'This form is not currently accepting responses' });

        const { answers, sessionId, respondentName, respondentEmail, metadata } = req.body;

        const response = await Response.create({
            form: form._id,
            sessionId: sessionId || `session_${Date.now()}`,
            answers: answers || [],
            respondentName,
            respondentEmail,
            metadata: {
                ...metadata,
                completedAt: new Date()
            }
        });

        // Increment response count
        await Form.findByIdAndUpdate(form._id, { $inc: { responseCount: 1 } });

        res.status(201).json({ success: true, message: 'Response submitted successfully', responseId: response._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error submitting response' });
    }
});

// GET /api/responses/:formId — get all responses (owner only)
router.get('/:formId', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const responses = await Response.find({ form: req.params.formId }).sort({ submittedAt: -1 });
        res.json({ success: true, responses, total: responses.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching responses' });
    }
});

module.exports = router;
