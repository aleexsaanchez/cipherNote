import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditNotePage from "../pages/EditNotePage";
import { getNoteById, updateNote } from "../api";

const mockNavigate = jest.fn();

jest.mock("../api", () => ({
  getNoteById: jest.fn(),
  updateNote: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={["/notes/edit/5"]}>
      <Routes>
        <Route path="/notes/edit/:id" element={<EditNotePage token="token-123" />} />
      </Routes>
    </MemoryRouter>
  );

describe("EditNotePage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads note data and updates note", async () => {
    getNoteById.mockResolvedValue({
      id: 5,
      title: "Original",
      content: "<p>Initial content</p>",
      tags: ["web", "xss"],
    });
    updateNote.mockResolvedValue({ id: 5, title: "Updated" });

    renderPage();

    expect(await screen.findByDisplayValue("Original")).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/title/i);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Updated");

    const tagsInput = screen.getByLabelText(/tags/i);
    await userEvent.clear(tagsInput);
    await userEvent.type(tagsInput, "incident-response, soc");

    await userEvent.click(screen.getByRole("button", { name: "Update Note" }));

    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith(
        "5",
        {
          title: "Updated",
          content: "<p>Initial content</p>",
          tags: ["incident-response", "soc"],
        },
        "token-123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });

  test("shows loading and fetch error state", async () => {
    getNoteById.mockRejectedValue(new Error("Unable to load"));

    renderPage();

    expect(screen.getByText("Loading note...")).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent("Unable to load");
  });

  test("shows update error state when save fails", async () => {
    getNoteById.mockResolvedValue({
      id: 5,
      title: "Original",
      content: "<p>Initial content</p>",
      tags: [],
    });
    updateNote.mockRejectedValue(new Error("Update failed"));

    renderPage();

    expect(await screen.findByDisplayValue("Original")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Update Note" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Update failed");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
