
const Event = require('../models/Event');

// function to generate eventId like E1001...
const generateEventId = async () => {
  const lastEvent = await Event.findOne().sort({ createdAt: -1 });
  if (!lastEvent || !lastEvent.eventId) return 'E1000';

  const lastIdNum = parseInt(lastEvent.eventId.substring(1)); // remove 'E' prefix and parse number
  return 'E' + (lastIdNum + 1);
};

// Create event
exports.createEvent = async (req, res) => {
  try {
    const newEventId = await generateEventId();

    // Create event with generated eventId and rest of the data from req.body
    const event = await Event.create({
      eventId: newEventId,
      ...req.body
    });

    res.status(201).json(event);
  } catch (err) {
    if (err.message.includes('Event conflict')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ datetime: 1 });
    console.log('Events fetched:', events);
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Search events
exports.searchEvents = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const regex = new RegExp(query, 'i'); // partial, case-insensitive

    const events = await Event.find({
      $or: [
        { eventId: query }, // strict exact match, case sensitive
        { name: { $regex: regex } },
        { title: { $regex: regex } }
      ]
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
