import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage" data-testid="homePage">
      <div className="content-box text-center">
        <h1 className="title">Welcome to Custom Event Calendar</h1>
        <p className="subtitle">
          <strong>Plan, track, and manage your events effortlessly.</strong>
        </p>
        <div className="button-group d-flex justify-content-center flex-wrap gap-3 mt-4">
          <Link
            to="/calendar"
            className="btn btn-primary btn-lg px-4"
            data-testid="calendarLink"
          >
            📅 View Calendar
          </Link>
          <Link
            to="/events"
            className="btn btn-success btn-lg px-4"
            data-testid="manageEventsLink"
          >
            📝 Manage Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
