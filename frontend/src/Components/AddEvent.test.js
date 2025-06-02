import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddEvent from "./AddEvent";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock the global fetch API
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("AddEvent Component", () => {
  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={["/add-event/2025-06-02"]}>
        <Routes>
          <Route path="/add-event/:date" element={<AddEvent />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test("renders form fields", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
    expect(screen.getByTestId("title-input")).toBeInTheDocument();
    expect(screen.getByTestId("description-input")).toBeInTheDocument();
    expect(screen.getByTestId("datetime-input")).toBeInTheDocument();

    expect(screen.getByTestId("submit-button")).toBeInTheDocument();

    expect(screen.getByTestId("datetime-input").value).toBe("2025-06-02T12:00");
  });

  test("enables submit button when form is valid", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    const submitBtn = screen.getByTestId("submit-button");
    expect(submitBtn).toBeDisabled();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "John" } });
    fireEvent.change(screen.getByTestId("title-input"), { target: { value: "Meeting" } });
    fireEvent.change(screen.getByTestId("datetime-input"), { target: { value: "2025-06-02T14:00" } });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
  });

  test("submits form and shows success alert", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123, name: "John", title: "Meeting" }),
    });

    window.alert = jest.fn();

    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), { target: { value: "John" } });
    fireEvent.change(screen.getByTestId("title-input"), { target: { value: "Meeting" } });
    fireEvent.change(screen.getByTestId("datetime-input"), { target: { value: "2025-06-02T14:00" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Event added successfully!");
    });

    expect(screen.getByTestId("name-input").value).toBe("");
  });

  test("does not accept invalid datetime input", () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderComponent();

    const datetimeInput = screen.getByTestId("datetime-input");

    // Try to set an invalid datetime value
    fireEvent.change(datetimeInput, { target: { value: "invalid-date-time" } });

    // The value should not change to invalid string if controlled correctly
    expect(datetimeInput.value).not.toBe("invalid-date-time");
  });
});
