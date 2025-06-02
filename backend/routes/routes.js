const express = require('express');
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  searchEvents
} = require('../controllers/eventController');

router.get('/events/search', searchEvents);  // place this first
router.get('/events', getAllEvents);
router.get('/events/:id', getEvent);
router.post('/events', createEvent);
router.patch('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
