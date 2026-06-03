const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const feedback = new Feedback({ name, email, message });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to submit feedback' });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: 'Unable to load feedback' });
  }
});

module.exports = router;
