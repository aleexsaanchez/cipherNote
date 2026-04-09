process.env.SQLITE_STORAGE = ":memory:";

const request = require("supertest");
const db = require("../models");
const { app } = require("../server");

describe("API integration", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test("register, duplicate register, and login flows", async () => {
    const registerRes = await request(app).post("/api/users/register").send({
      email: "alice@example.com",
      password: "password123"
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe("alice@example.com");
    expect(registerRes.body.user).not.toHaveProperty("password");

    const duplicateRes = await request(app).post("/api/users/register").send({
      email: "alice@example.com",
      password: "password123"
    });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.message).toBe("User already exists");

    const invalidLoginRes = await request(app).post("/api/users/login").send({
      email: "alice@example.com",
      password: "wrong-password"
    });

    expect(invalidLoginRes.status).toBe(401);
    expect(invalidLoginRes.body.message).toBe("Invalid email or password");

    const loginRes = await request(app).post("/api/users/login").send({
      email: "alice@example.com",
      password: "password123"
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });

  test("returns 401 for protected route without token", async () => {
    const res = await request(app).get("/api/notes");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing token");
  });

  test("notes CRUD for authenticated user plus 404 cases", async () => {
    await request(app).post("/api/users/register").send({
      email: "bob@example.com",
      password: "password123"
    });

    const loginRes = await request(app).post("/api/users/login").send({
      email: "bob@example.com",
      password: "password123"
    });
    const token = loginRes.body.token;

    const createRes = await request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Port scan notes",
        content: "Use nmap -sV for service version detection",
        tags: ["recon", "nmap"]
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.title).toBe("Port scan notes");
    expect(createRes.body.tags).toEqual(["recon", "nmap"]);
    const noteId = createRes.body.id;

    const listRes = await request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);

    const getRes = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.id).toBe(noteId);

    const updateRes = await request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated scan notes",
        content: "Run nmap with --script vuln",
        tags: ["recon", "scripts"]
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe("Updated scan notes");
    expect(updateRes.body.tags).toEqual(["recon", "scripts"]);

    const notFoundBeforeDelete = await request(app)
      .get("/api/notes/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(notFoundBeforeDelete.status).toBe(404);
    expect(notFoundBeforeDelete.body.message).toBe("Note not found");

    const deleteRes = await request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Note deleted");

    const getDeletedRes = await request(app)
      .get(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(getDeletedRes.status).toBe(404);
    expect(getDeletedRes.body.message).toBe("Note not found");
  });
});
