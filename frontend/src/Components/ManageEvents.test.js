import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import ManageEvents from "./ManageEvents";

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("ManageEvents Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  test("renders ManageEvents page correctly", () => {
    render(
      <MemoryRouter>
        <ManageEvents />
      </MemoryRouter>
    );

    expect(screen.getByTestId("manageEventsPage")).toBeInTheDocument();
    expect(screen.getByText(/Manage Events Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Prev/i)).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("navigates to previous and next months", () => {
    render(
      <MemoryRouter>
        <ManageEvents />
      </MemoryRouter>
    );

    const prevButton = screen.getByText(/Prev/i);
    const nextButton = screen.getByText(/Next/i);

    const monthLabel = screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/i);
    const originalMonth = monthLabel.textContent;

    fireEvent.click(nextButton);
    const nextMonth = screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/i).textContent;
    expect(nextMonth).not.toBe(originalMonth);

    fireEvent.click(prevButton);
    const currentMonth = screen.getByText(/January|February|March|April|May|June|July|August|September|October|November|December/i).textContent;
    expect(currentMonth).toBe(originalMonth); // Back to original month
  });

  test("navigates to correct date on calendar day click", () => {
    render(
      <MemoryRouter>
        <ManageEvents />
      </MemoryRouter>
    );

    const dayButton = screen.getAllByTitle("Click to manage events")[0];
    fireEvent.click(dayButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    const calledWith = mockNavigate.mock.calls[0][0];

    expect(calledWith).toMatch(/^\/events-dashboard\/\d{4}-\d{2}-\d{2}$/);
  });
});
