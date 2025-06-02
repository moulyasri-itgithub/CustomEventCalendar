import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from './App';

describe("Rendering and Navigation Tests", () => {

  test("TCR 1 - Home page renders with welcome text", () => {
    render(<App />);
    // Your HomePage component should have this test id or text
    expect(screen.getByTestId("homePage")).toHaveTextContent(/Welcome/i);
  });

  test("TCR 2 - Navigate to Calendar View", () => {
    render(<App />);
    // Your HomePage should have a button or link with data-testid="calendarLink"
    const calendarBtn = screen.getByTestId("calendarLink");
    fireEvent.click(calendarBtn);

    // ViewCalendar component should render something identifiable
    expect(screen.getByTestId("calendarPage")).toHaveTextContent(/Calendar/i);
  });
});
/*
  test("TCR 3 - Navigate to Manage Events page", () => {
    render(<App />);
    // HomePage or wherever, button with text "Manage Events"
    const manageEventsBtn = screen.getByText(/Manage Events/i);
    fireEvent.click(manageEventsBtn);

    // ManageEvents component should show this text
    expect(screen.getByText(/Manage Events Calendar/i)).toBeInTheDocument();
  });

  test("TCR 4 - Navigate to View Events List page", () => {
    render(<App />);
    // From ManageEvents or somewhere, a button/link "View Events"
    const viewEventsBtn = screen.getByText(/View Events/i);
    fireEvent.click(viewEventsBtn);

    // ViewEventsList component should render this text
    expect(screen.getByText(/All Events/i)).toBeInTheDocument();
  });

  test("TCR 5 - Navigate to Add Event page", () => {
    render(<App />);
    // From EventsDashboard or ManageEvents, button/link "Add Event"
    const addEventBtn = screen.getByText(/Add Event/i);
    fireEvent.click(addEventBtn);

    // AddEvent page should have heading "Add Event"
    expect(screen.getByText(/Add Event/i)).toBeInTheDocument();
  });

*/