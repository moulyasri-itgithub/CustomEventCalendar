import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../styles/EventsDashboard.css';

const EventsDashboard = () => {
  const { date } = useParams();
  const navigate = useNavigate();

  const [year, month, day] = date.split("-");
  const localDate = new Date(year, month - 1, day);

  return (
    <div className="events-dashboard-container">
      <h2>Events Dashboard</h2>
      <p>
        Selected Date: <strong>{localDate.toDateString()}</strong>
      </p>

      <div className="cards-container">
        <div className="card add-event-card" data-testid="addEventLink" onClick={() => navigate(`/add-event/${date}`)}>
          Add Event
        </div>
         <div className="card view-event-card"  data-testid="viewEventsLink" onClick={() => navigate(`/view-events`)}>
         View Events
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;
