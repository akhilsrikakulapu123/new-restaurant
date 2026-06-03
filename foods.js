const express = require('express');
const Food = require('../models/Food');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const foods = await Food.find().sort({ name: 1 });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch foods' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch food item' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, price, image, cuisine } = req.body;
    const food = new Food({ name, price, image, cuisine });
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create food item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update food item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ error: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete food item' });
  }
});

module.exports = router;
