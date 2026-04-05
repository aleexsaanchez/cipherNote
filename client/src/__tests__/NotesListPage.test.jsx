import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NotesListPage from "../pages/NotesListPage";
import { deleteNote, getNotes } from "../api";

const mockNavigate = jest.fn();

jest.mock("../api", () => ({
  getNotes: jest.fn(),
  deleteNote: jest.fn()
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("NotesListPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn(() => true);
  });

  test("loads notes and filters by search query", async () => {
    getNotes.mockResolvedValue([
      { id: 1, title: "Network Scan", content: "nmap notes", tags: ["recon"] },
      { id: 2, title: "SQL Injection", content: "payloads and bypasses", tags: ["web"] }
    ]);

    render(
      <MemoryRouter>
        <NotesListPage token="token-123" />
      </MemoryRouter>
    );

    expect(await screen.findByText("Network Scan")).toBeInTheDocument();
    expect(screen.getByText("SQL Injection")).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/search tags, tools, or tactics/i), "sql");

    expect(screen.queryByText("Network Scan")).not.toBeInTheDocument();
    expect(screen.getByText("SQL Injection")).toBeInTheDocument();
  });

  test("renders empty state when no notes are returned", async () => {
    getNotes.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <NotesListPage token="token-123" />
      </MemoryRouter>
    );

    expect(await screen.findByText(/no notes found/i)).toBeInTheDocument();
  });

  test("deletes a note when delete is confirmed", async () => {
    getNotes.mockResolvedValue([
      { id: 7, title: "XSS", content: "xss checklist", tags: ["web"] }
    ]);
    deleteNote.mockResolvedValue({ message: "Note deleted" });

    render(
      <MemoryRouter>
        <NotesListPage token="token-123" />
      </MemoryRouter>
    );

    expect(await screen.findByText("XSS")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith(7, "token-123");
    });

    expect(screen.queryByText("XSS")).not.toBeInTheDocument();
  });
});
