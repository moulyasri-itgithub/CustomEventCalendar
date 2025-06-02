import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewEvents from "../Components/ViewEventsList";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

beforeEach(() => {
  jest.resetAllMocks();
  global.fetch = jest.fn();
  window.confirm = jest.fn(() => true); // auto-confirm deletion
});

describe("ViewEvents Component", () => {
  const sampleEvents = [
    {
      _id: "1",
      eventId: "E001",
      name: "Alice",
      title: "Meeting",
      description: "Discuss project",
      datetime: "2025-06-02T10:00:00Z",
    },
    {
      _id: "2",
      eventId: "E002",
      name: "Bob",
      title: "Conference",
      description: "Annual conference",
      datetime: "2025-07-01T12:00:00Z",
    },
  ];

  test("renders and displays events", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    expect(screen.getByTestId("viewEventsListPage")).toBeInTheDocument();

    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Meeting")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Conference")).toBeInTheDocument();
    });
  });

  test("filters events based on search input", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Alice"));

    const searchInput = screen.getByPlaceholderText("Search by Name, ID, or Title...");

    // Search by name
    fireEvent.change(searchInput, { target: { value: "Bob" } });
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();

    // Search by eventId
    fireEvent.change(searchInput, { target: { value: "E001" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    // Search by title
    fireEvent.change(searchInput, { target: { value: "Meeting" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();

    // Empty search shows all
    fireEvent.change(searchInput, { target: { value: "" } });
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("shows 'No events found.' when filter has no matches", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Alice"));

    fireEvent.change(screen.getByPlaceholderText("Search by Name, ID, or Title..."), {
      target: { value: "NonExisting" },
    });

    expect(screen.getByText("No events found.")).toBeInTheDocument();
  });

  test("deletes an event when delete button clicked and confirmed", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => sampleEvents,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Alice"));

    const deleteButtons = screen.getAllByText("Delete");
    expect(deleteButtons.length).toBe(2);

    fireEvent.click(deleteButtons[0]); // Delete first event

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:5000/api/events/1", { method: "DELETE" });
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });
  });

  test("does not delete event if confirmation is cancelled", async () => {
    window.confirm = jest.fn(() => false); // User cancels

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Alice"));

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(fetch).toHaveBeenCalledTimes(1); // Only initial fetch called, no DELETE
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  test("navigates to update page when update button clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => sampleEvents,
    });

    render(
      <MemoryRouter>
        <ViewEvents />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Alice"));

    const updateButtons = screen.getAllByText("Update");
    fireEvent.click(updateButtons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith("/update-event/1");
  });
});
