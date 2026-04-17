import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateNotePage from "../pages/CreateNotePage";
import { createNote } from "../api";

const mockNavigate = jest.fn();

jest.mock("../api", () => ({
  createNote: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("CreateNotePage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates a note and navigates back to notes list", async () => {
    createNote.mockResolvedValue({ id: 1, title: "Playbook" });

    render(
      <MemoryRouter>
        <CreateNotePage token="token-123" />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/title/i), "Playbook");
    await userEvent.type(screen.getByLabelText(/tags/i), "recon, nmap");
    await userEvent.click(screen.getByRole("button", { name: "Add Note" }));

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith(
        {
          title: "Playbook",
          content: "",
          tags: ["recon", "nmap"],
        },
        "token-123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });

  test("shows a visible error when create fails", async () => {
    createNote.mockRejectedValue(new Error("Create failed"));

    render(
      <MemoryRouter>
        <CreateNotePage token="token-123" />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/title/i), "Failed note");
    await userEvent.click(screen.getByRole("button", { name: "Add Note" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Create failed");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
