
import React, { useState, useEffect } from "react";
import "../styles/ViewEventsList.css";
import { useNavigate } from 'react-router-dom';

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredEvents(events);
    } else {
      const lowerQuery = query.toLowerCase();
      setFilteredEvents(
        events.filter((event) =>
          event.eventId.toLowerCase().includes(lowerQuery) ||
          event.name.toLowerCase().includes(lowerQuery) ||
          event.title.toLowerCase().includes(lowerQuery)
        )
      );
    }
  }, [query, events]);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
       data.sort((a, b) => a.eventId.localeCompare(b.eventId));
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents(events.filter((e) => e._id !== id));
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleUpdate = (id) => {
  // Redirect to update page or open a modal
  navigate(`/update-event/${id}`);
     };

  return (
    <div className="view-events-container" data-testid="viewEventsListPage">
      <h2>All Events</h2>

      <input
        type="text"
        placeholder="Search by Name, ID, or Title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-bar"
      />

      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Event ID</th>
              <th>Name</th>
              <th>Title</th>
              <th>Description</th>
              <th>Event Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id}>
                <td>{event.eventId}</td>
                <td>{event.name}</td>
                <td>{event.title}</td>
                <td>{event.description}</td>
                <td>{new Date(event.datetime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
              <td style={{ display: "flex", gap: "10px" }}>
                   <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                                Delete
                    </button>
                  <button className="update-btn" onClick={() => handleUpdate(event._id)}>
                          Update
                  </button>
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewEvents;

