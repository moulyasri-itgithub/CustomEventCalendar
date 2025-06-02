import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/ManageEvents.css';

const ManageEvents = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => setDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const openEventsDashboard = (day) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    const dateString = `${year}-${monthStr}-${dayStr}`;

    navigate(`/events-dashboard/${dateString}`);
  };

  const renderCalendarDays = () => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const totalDays = daysInMonth(m, y);
    const firstDayIndex = firstDayOfMonth(m, y);
    const calendarDays = [];

    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(
        <div
          key={day}
          className="calendar-day"
          onClick={() => openEventsDashboard(day)}
          title="Click to manage events"
        >
          <div className="day-number">{day}</div>
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className="manage-container" data-testid="manageEventsPage">
      <h2>Manage Events Calendar</h2>

      <div className="month-navigation">
        <button onClick={prevMonth}>&lt; Prev</button>
        <div className="month-year">
          {date.toLocaleString("default", { month: "long" })} {date.getFullYear()}
        </div>
        <button onClick={nextMonth}>Next &gt;</button>
      </div>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="day-name">{d}</div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default ManageEvents;
