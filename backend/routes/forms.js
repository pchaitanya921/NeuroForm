const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const { protect } = require('../middleware/auth');

// GET /api/forms — list all forms for current user
router.get('/', protect, async (req, res) => {
    try {
        const forms = await Form.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, forms });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching forms' });
    }
});

// POST /api/forms — create new form
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, goal, questions, settings } = req.body;

        const form = await Form.create({
            title,
            description,
            goal,
            questions: questions || [],
            settings: settings || {},
            owner: req.user._id
        });

        res.status(201).json({ success: true, form });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error creating form' });
    }
});

// GET /api/forms/:id — get single form (owner or public published)
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id).populate('owner', 'name');
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        res.json({ success: true, form });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error fetching form' });
    }
});

// PUT /api/forms/:id — update form
router.put('/:id', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this form' });
        }

        const allowedFields = ['title', 'description', 'questions', 'settings', 'isPublished'];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) form[field] = req.body[field];
        });

        await form.save();
        res.json({ success: true, form });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error updating form' });
    }
});

// DELETE /api/forms/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this form' });
        }

        await form.deleteOne();
        res.json({ success: true, message: 'Form deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error deleting form' });
    }
});

// POST /api/forms/:id/publish — toggle publish
router.post('/:id/publish', protect, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ success: false, message: 'Form not found' });
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        form.isPublished = !form.isPublished;
        await form.save();
        res.json({ success: true, form, message: form.isPublished ? 'Form published!' : 'Form unpublished' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
