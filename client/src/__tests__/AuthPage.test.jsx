import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import { login, register } from "../api";

const mockNavigate = jest.fn();

jest.mock("../api", () => ({
  login: jest.fn(),
  register: jest.fn()
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe("AuthPage component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("submits login and stores token", async () => {
    const setToken = jest.fn();
    login.mockResolvedValue({ token: "login-token" });

    render(
      <MemoryRouter>
        <AuthPage setToken={setToken} />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "pass123");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "pass123"
      });
    });

    expect(setToken).toHaveBeenCalledWith("login-token");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "login-token");
    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });

  test("switches to register mode and submits register request", async () => {
    const setToken = jest.fn();
    register.mockResolvedValue({ message: "User created!" });
    login.mockResolvedValue({ token: "register-token" });

    render(
      <MemoryRouter>
        <AuthPage setToken={setToken} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: "Create an account" }));

    await userEvent.type(screen.getByLabelText(/email/i), "new@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "newpass123");
    await userEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "newpass123"
      });
    });

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "newpass123"
      });
    });

    expect(setToken).toHaveBeenCalledWith("register-token");
    expect(mockNavigate).toHaveBeenCalledWith("/notes");
  });

  test("shows error state when auth response has no token", async () => {
    const setToken = jest.fn();
    login.mockResolvedValue({ message: "Auth failed" });

    render(
      <MemoryRouter>
        <AuthPage setToken={setToken} />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Auth failed")).toBeInTheDocument();
    expect(setToken).not.toHaveBeenCalled();
  });
});
