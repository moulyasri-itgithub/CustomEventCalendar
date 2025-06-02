import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewCalendar from './Components/ViewCalendar';
import HomePage from './Components/HomePage';
import ManageEvents from "./Components/ManageEvents";
import EventsDashboard from "./Components/EventsDashboard";

import AddEvent from "./Components/AddEvent";
import UpdateEvent from "./Components/UpdateEvent";
import ViewEventsList from "./Components/ViewEventsList";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calendar" element={<ViewCalendar />} />
          <Route path="/events" element={<ManageEvents />} />
          <Route path="/events-dashboard/:date" element={<EventsDashboard />} />
          <Route path="/add-event/:date" element={<AddEvent />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />
           <Route path="/view-events" element={<ViewEventsList />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
