import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EventsDashboard from "./EventsDashboard";

// Dummy components to test navigation targets
const AddEvent = () => <div>Add Event Page</div>;
const ViewEventsList = () => <div>All Events</div>;

describe("EventsDashboard Component Tests", () => {
  const testDate = "2025-06-03";

  function renderWithRouter(initialEntries = [`/events-dashboard/${testDate}`]) {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/events-dashboard/:date" element={<EventsDashboard />} />
          <Route path="/add-event/:date" element={<AddEvent />} />
          <Route path="/view-events" element={<ViewEventsList />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("renders EventsDashboard with correct date", () => {
    renderWithRouter();
    expect(screen.getByText("Events Dashboard")).toBeInTheDocument();
    expect(screen.getByText(/Selected Date:/)).toBeInTheDocument();

    // Date shown in human readable format, e.g. "Tue Jun 03 2025"
    const expectedDate = new Date("2025-06-03").toDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  test("Add Event card is present and navigates correctly", () => {
    renderWithRouter();

    const addEventCard = screen.getByTestId("addEventLink");
    expect(addEventCard).toBeInTheDocument();
    expect(addEventCard).toHaveTextContent("Add Event");

    // Click and navigate to Add Event page
    fireEvent.click(addEventCard);
    expect(screen.getByText("Add Event Page")).toBeInTheDocument();
  });

  test("View Events card is present and navigates correctly", () => {
    renderWithRouter();

    const viewEventsCard = screen.getByTestId("viewEventsLink");
    expect(viewEventsCard).toBeInTheDocument();
    expect(viewEventsCard).toHaveTextContent("View Events");

    // Click and navigate to View Events page
    fireEvent.click(viewEventsCard);
    expect(screen.getByText("All Events")).toBeInTheDocument();
  });
});
