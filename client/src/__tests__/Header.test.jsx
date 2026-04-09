import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "../components/Header";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("Header component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows logout button when token exists", () => {
    render(
      <MemoryRouter>
        <Header token="token-123" logout={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  test("hides logout button when token is missing", () => {
    render(
      <MemoryRouter>
        <Header token="" logout={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
  });

  test("calls logout and navigates to auth on logout click", async () => {
    const logout = jest.fn();

    render(
      <MemoryRouter>
        <Header token="token-123" logout={logout} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/auth");
  });
});
