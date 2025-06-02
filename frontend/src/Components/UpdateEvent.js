import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    title: "",
    name: "",
    datetime: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        const eventData = res.data;
       setEvent({
            ...eventData,
            datetime: eventData.datetime ? eventData.datetime.substring(0,16) : ""
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/events/${id}`, event);
      alert("Event updated successfully!");
      navigate("/view-events");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    }
  };

  if (loading) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Solution: Added bg-white and shadow-none to kill all hover effects */}
          <div className="bg-white p-4 rounded border">
            <h2 className="text-center mb-4">Update Event</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={event.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={event.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                    type="datetime-local"
                    className="form-control"
                     name="datetime"
                    value={event.datetime}
                    onChange={handleChange}
                      required
                 />
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={event.description}
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary">
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;