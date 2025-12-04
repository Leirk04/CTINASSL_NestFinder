import express from 'express';
import Visit from '../models/Visit.js';
import { authRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a visit
router.post('/', authRequired, async (req, res) => {
  try {
    const { propertyId, propertyName, visitDate, notes } = req.body;

    if (!propertyId || !propertyName || !visitDate) {
      return res
        .status(400)
        .json({ message: 'propertyId, propertyName and visitDate are required' });
    }

    const date = new Date(visitDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Invalid visitDate' });
    }

    const visit = await Visit.create({
      user: req.user.id,
      propertyId,
      propertyName,
      visitDate: date,
      notes: notes || '',
    });

    res.status(201).json(visit);
  } catch (err) {
    console.error('Create visit error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List visits for current user
router.get('/', authRequired, async (req, res) => {
  try {
    const visits = await Visit.find({ user: req.user.id }).sort({ visitDate: 1 }).lean();
    res.json(visits);
  } catch (err) {
    console.error('List visits error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


