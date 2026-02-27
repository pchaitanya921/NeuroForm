const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { generateForm, getAdaptiveNext, generateInsights, generateExecutiveSummary, chatWithData } = require('../services/grok');
const Form = require('../models/Form');
const Response = require('../models/Response');
const Insight = require('../models/Insight');

// POST /api/ai/generate-form — generate form from goal
router.post('/generate-form', protect, async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ success: false, message: 'Goal is required' });

        const generated = await generateForm(goal);

        // Auto-save the generated form
        const form = await Form.create({
            title: generated.title,
            description: generated.description,
            goal,
            questions: generated.questions,
            owner: req.user._id,
            settings: { adaptiveFlow: true }
        });

        res.json({ success: true, form, generated });
    } catch (err) {
        console.error('AI generate-form error:', err.message);
        if (err.response) {
            console.error('Grok API response status:', err.response.status);
            console.error('Grok API response body:', JSON.stringify(err.response.data, null, 2));
        }
        res.status(500).json({ success: false, message: `AI generation failed: ${err.message}` });
    }
});

// POST /api/ai/adaptive-next — get adaptive next question
router.post('/adaptive-next', async (req, res) => {
    try {
        const { questions, answers, currentQuestionId } = req.body;
        if (!questions || !answers) {
            return res.status(400).json({ success: false, message: 'questions and answers are required' });
        }

        const result = await getAdaptiveNext(questions, answers, currentQuestionId);
        res.json({ success: true, result });
    } catch (err) {
        console.error('AI adaptive-next error:', err.message);
        res.status(500).json({ success: false, message: `Adaptive AI failed: ${err.message}` });
    }
});

// POST /api/ai/insights/:formId — generate insights for a form
router.post('/insights/:formId', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const responses = await Response.find({ form: req.params.formId });
        if (responses.length === 0) {
            return res.status(400).json({ success: false, message: 'No responses available to analyze yet' });
        }

        const aiInsights = await generateInsights(form, responses);

        // Upsert insight document
        const insight = await Insight.findOneAndUpdate(
            { form: form._id },
            {
                ...aiInsights,
                totalResponses: responses.length,
                generatedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ success: true, insight });
    } catch (err) {
        console.error('AI insights error:', err.message);
        res.status(500).json({ success: false, message: `Insight generation failed: ${err.message}` });
    }
});

// GET /api/ai/insights/:formId — retrieve existing insights
router.get('/insights/:formId', async (req, res) => {
    try {
        const insight = await Insight.findOne({ form: req.params.formId });
        if (!insight) return res.status(404).json({ success: false, message: 'No insights available yet. Generate them from your dashboard.' });
        res.json({ success: true, insight });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching insights' });
    }
});

// POST /api/ai/summary/:formId — generate executive summary
router.post('/summary/:formId', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const insight = await Insight.findOne({ form: form._id });
        if (!insight) {
            return res.status(400).json({ success: false, message: 'Generate insights first before creating a summary' });
        }

        const summary = await generateExecutiveSummary(form, insight);
        insight.executiveSummary = summary;
        await insight.save();

        res.json({ success: true, summary });
    } catch (err) {
        console.error('AI summary error:', err.message);
        res.status(500).json({ success: false, message: `Summary generation failed: ${err.message}` });
    }
});

// POST /api/ai/chat — Chat with your global form data
router.post('/chat', protect, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ success: false, message: 'Message is required' });

        // Get user's context to feed to LLM
        const forms = await Form.find({ owner: req.user._id });
        const formIds = forms.map(f => f._id);
        const insights = await Insight.find({ form: { $in: formIds } });

        const answer = await chatWithData(message, insights, forms);

        res.json({ success: true, answer });
    } catch (err) {
        console.error('AI chat error:', err.message);
        res.status(500).json({ success: false, message: `Chat failed: ${err.message}` });
    }
});

module.exports = router;
