import React, { useState } from 'react';
import '../styles/ViewCalendar.css';

const ViewCalendar = () => {
  const [date, setDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years range for dropdown (e.g., from 1970 to 2070)
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 50; y <= currentYear + 50; y++) {
    years.push(y);
  }

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  // Handle dropdown changes
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setDate(prev => new Date(prev.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setDate(prev => new Date(newYear, prev.getMonth(), 1));
  };

  const renderCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();

    const totalDays = daysInMonth(month, year);
    const firstDayIndex = firstDayOfMonth(month, year);

    const calendarDays = [];

    for (let i = 0; i < firstDayIndex; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Special styling for August 2025 days
      const isAugust2025 = (month === 7 && year === 2025); // month is zero-based

      calendarDays.push(
        <div
          key={day}
          className={
            `calendar-day${isToday ? ' today' : ''}${isAugust2025 ? ' august-2025' : ''}`
          }
        >
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="calendar-card" >
      <h2 className="calendar-heading" data-testid="calendarPage">Calendar</h2>

      <div className="calendar-header">
        {/* Month dropdown - left */}
        <select
          className="month-select"
          value={date.getMonth()}
          onChange={handleMonthChange}
          aria-label="Select month"
        >
          {monthNames.map((m, i) => (
            <option key={i} value={i}>
              {m}
            </option>
          ))}
        </select>

        {/* Center month-year text */}
        <div className="calendar-title">
          {monthNames[date.getMonth()]} {date.getFullYear()}
        </div>

        {/* Year dropdown - right */}
        <select
          className="year-select"
          value={date.getFullYear()}
          onChange={handleYearChange}
          aria-label="Select year"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">{day}</div>
        ))}

        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default ViewCalendar;
