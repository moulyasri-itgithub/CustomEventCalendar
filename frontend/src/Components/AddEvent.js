import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AddEvent.css";

const AddEvent = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    datetime: "",
  });

  const [errors, setErrors] = useState({});
  const [lastId, setLastId] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (date) {
      setFormData((f) => ({ ...f, datetime: date + "T12:00" }));
    }

    const fetchLastId = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const events = await res.json();

        if (events.length > 0) {
          setLastId(events.length);
        } else {
          setLastId(0);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLastId();
  }, [date]);

  const validate = (fieldValues = formData) => {
    const newErrors = {};

    if ("name" in fieldValues) {
      if (!fieldValues.name.trim()) {
        newErrors.name = "Name is required.";
      } else if (fieldValues.name.trim().length < 3) {
        newErrors.name = "Name must be at least 3 characters.";
      }
    }

    if ("title" in fieldValues) {
      if (!fieldValues.title.trim()) {
        newErrors.title = "Event title is required.";
      } else if (fieldValues.title.trim().length < 3) {
        newErrors.title = "Title must be at least 3 characters.";
      }
    }

    if ("datetime" in fieldValues) {
      if (!fieldValues.datetime) {
        newErrors.datetime = "Date and time is required.";
      } else if (isNaN(new Date(fieldValues.datetime).getTime())) {
        newErrors.datetime = "Invalid date/time.";
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const fieldError = validate({ [name]: value });
    setErrors((prev) => ({
      ...prev,
      ...fieldError,
      [name]: fieldError[name] || "",
    }));
  };

  const canSubmit = () => {
    const validationErrors = validate();
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { id, ...sendData } = formData;

      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      });

      if (!response.ok) throw new Error("Failed to add event");
      const newEvent = await response.json();

      alert("Event added successfully!");

      setFormData({
        name: "",
        title: "",
        description: "",
        datetime: date ? date + "T12:00" : "",
      });
      setErrors({});
    } catch (err) {
      alert("Error adding event: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-event-container" data-testid="addEventPage">
      <h2>Add Event</h2>
      <form
        className="add-event-form"
        onSubmit={handleSubmit}
        noValidate
        data-testid="addEventForm"
      >
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            data-testid="name-input"
            type="text"
            name="name"
            id="name"
            className={errors.name ? "error" : ""}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span data-testid="name-error" className="error-message">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">Event Title:</label>
          <input
            data-testid="title-input"
            type="text"
            name="title"
            id="title"
            className={errors.title ? "error" : ""}
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <span data-testid="title-error" className="error-message">
              {errors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <input
            data-testid="description-input"
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="datetime">Date and Time:</label>
          <input
            data-testid="datetime-input"
            type="datetime-local"
            name="datetime"
            id="datetime"
            className={errors.datetime ? "error" : ""}
            value={formData.datetime}
            onChange={handleChange}
          />
          {errors.datetime && (
            <span data-testid="datetime-error" className="error-message">
              {errors.datetime}
            </span>
          )}
        </div>

        <div className="form-buttons">
          <button
            data-testid="submit-button"
            type="submit"
            disabled={!canSubmit() || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Event"}
          </button>
          <button
            data-testid="cancel-button"
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEvent;
