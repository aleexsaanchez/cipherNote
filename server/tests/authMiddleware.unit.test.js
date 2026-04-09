const jwt = require("jsonwebtoken");
const authMiddleware = require("../routes/authMiddleware");

const SECRET = "secretkey";

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware unit", () => {
  test("returns 401 when authorization header is missing", () => {
    const req = { headers: {} };
    const res = buildRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when bearer token is malformed", () => {
    const req = { headers: { authorization: "Bearer" } };
    const res = buildRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("returns 401 when token is invalid", () => {
    const req = { headers: { authorization: "Bearer not-a-real-jwt" } };
    const res = buildRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("sets req.userId and calls next for a valid token", () => {
    const token = jwt.sign({ id: 42 }, SECRET, { expiresIn: "1h" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = buildRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.userId).toBe(42);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
